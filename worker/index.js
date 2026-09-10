/* ============================================================
 * 求职 Agent 代理 · 阿里云函数计算(FC 3.0 Web 函数 / 自定义运行时)
 *
 * 职责(与原 Cloudflare Worker 完全一致):
 * 1. 保管 LLM API Key(环境变量,不落前端)
 * 2. 注入系统提示词(knowledge.js 的 KNOWLEDGE)
 * 3. CORS 白名单 + 简单的每 IP 限流
 * 4. SSE 流式透传给前端
 *
 * 运行形态:custom.debian10 自定义运行时,内置 Node.js 20。
 * 用 Node 内置 http 起 HTTP Server,监听 0.0.0.0:$FC_SERVER_PORT(默认 9000),
 * 由 FC HTTP 触发器以「透传模式」转发请求。零第三方依赖。
 *
 * 兼容任意 OpenAI Chat Completions 协议的服务
 * (DeepSeek / 通义 DashScope 兼容模式 / 混元 / Kimi / OpenAI),
 * 通过环境变量 LLM_BASE_URL / LLM_MODEL 切换,无需改代码。
 * ============================================================ */
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { KNOWLEDGE } from "./knowledge.js";

const STATIC_ALLOWED = new Set([
  "https://changjunhao.github.io",
  "https://www.ifable.cn",
  "https://ifable.cn",
]);

const RATE_LIMIT = 20;            // 每 IP 每分钟最多请求数
const MAX_MESSAGES = 20;          // 单次请求最多携带的消息条数
const MAX_CONTENT_LEN = 2000;     // 单条消息最大字符数
const MAX_TOKENS = 1024;
const MAX_BODY_BYTES = 1_000_000; // 请求体上限,防超大 payload

/* 注意:Map 限流是单实例内存态,FC 弹性扩容 / 实例回收下是「尽力而为」,
 * 个人站点量级足够;如需严格限流可接阿里云 API 网关或 Redis。 */
const rateMap = new Map();

function corsHeaders(origin) {
  const allowed =
    STATIC_ALLOWED.has(origin) ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "null",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function sendJson(res, data, status, origin) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders(origin),
  });
  res.end(JSON.stringify(data));
}

function hitRateLimit(ip) {
  const now = Date.now();
  const rec = rateMap.get(ip);
  if (!rec || now > rec.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  rec.count += 1;
  if (rateMap.size > 10_000) rateMap.clear(); // 防内存膨胀
  return rec.count > RATE_LIMIT;
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return "messages 不能为空";
  if (messages.length > MAX_MESSAGES) return "消息条数过多";
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return "非法的消息角色";
    if (typeof m.content !== "string" || m.content.length === 0) return "消息内容为空";
    if (m.content.length > MAX_CONTENT_LEN) return "单条消息过长";
  }
  return null;
}

/* FC HTTP 触发器透传客户端信息:优先取 X-Forwarded-For 首个地址 */
function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return String(xff).split(",")[0].trim();
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        req.destroy();
        reject(new Error("body too large"));
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleChat(req, res, origin) {
  const ip = clientIp(req);
  if (hitRateLimit(ip)) {
    return sendJson(res, { error: "提问太频繁了,请一分钟后再试" }, 429, origin);
  }

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    return sendJson(res, { error: "请求体不是合法 JSON" }, 400, origin);
  }
  const invalid = validateMessages(body.messages);
  if (invalid) return sendJson(res, { error: invalid }, 400, origin);

  const baseUrl = (process.env.LLM_BASE_URL || "https://api.deepseek.com/v1").replace(/\/+$/, "");
  const model = process.env.LLM_MODEL || "deepseek-flash";
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    return sendJson(res, { error: "服务端未配置 LLM_API_KEY" }, 500, origin);
  }

  let upstream;
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: KNOWLEDGE }, ...body.messages],
        stream: true,
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
      }),
    });
  } catch (err) {
    return sendJson(res, { error: "无法连接模型服务: " + err.message }, 502, origin);
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    return sendJson(
      res,
      { error: `模型服务返回 ${upstream.status}`, detail: detail.slice(0, 300) },
      502,
      origin
    );
  }

  // SSE 流式透传:不设 Content-Length,Node 自动用 Transfer-Encoding: chunked,
  // FC 据此判定为流式响应并逐块回传给浏览器。
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
    Connection: "keep-alive",
    ...corsHeaders(origin),
  });

  // 把 undici(fetch)返回的 Web ReadableStream 转成 Node 流后直接管道给响应
  const nodeStream = Readable.fromWeb(upstream.body);
  nodeStream.on("error", (err) => {
    console.error("upstream stream error:", err.message);
    if (!res.writableEnded) res.end();
  });
  // 前端 AbortController 断开时,及时销毁上游流,释放连接
  res.on("close", () => nodeStream.destroy());
  nodeStream.pipe(res);
}

const server = createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204, corsHeaders(origin));
      return res.end();
    }
    if (url.pathname === "/health") {
      return sendJson(res, { ok: true }, 200, origin);
    }
    if (url.pathname === "/chat" && req.method === "POST") {
      return await handleChat(req, res, origin);
    }
    return sendJson(res, { error: "not found" }, 404, origin);
  } catch (err) {
    console.error("handler error:", err);
    if (!res.headersSent) {
      sendJson(res, { error: "服务器内部错误" }, 500, origin);
    } else if (!res.writableEnded) {
      res.end();
    }
  }
});

/* 自定义运行时要求:Connection 保持 Keep-Alive,且服务端不主动超时,
 * 避免长连接(SSE)被 Node 默认超时中途掐断;整体时长由 FC 函数 timeout 兜底。 */
server.timeout = 0;
server.keepAliveTimeout = 0;
server.headersTimeout = 0;
server.requestTimeout = 0;

const PORT = Number(process.env.FC_SERVER_PORT || 9000);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`agent proxy listening on 0.0.0.0:${PORT}`);
});
