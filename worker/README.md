# 求职 Agent · 阿里云函数计算(FC)代理

前端聊天页(`../agent/index.html`)→ 本函数(保管 Key + 注入知识库)→ LLM API。

**为什么不能前端直连?** GitHub Pages 是纯静态托管,Key 写进页面等于全网公开,会被人盗刷。用一个云函数在服务端保管 Key 并转发即可;函数计算按量计费、闲时缩容到 0,个人站点基本零成本。

**为什么用「Web 函数」而不是「事件函数」?** 前端要的是 SSE 流式打字机效果,而 FC 只有 **Web 函数(自定义运行时)** 支持流式响应,事件函数不支持。所以这里用 `custom.debian10` 运行时 + 内置 Node.js 20 起一个 HTTP Server,由 FC HTTP 触发器透传请求。

## 目录结构

```
worker/
├── index.js        # 函数入口:Node 内置 http 起的 HTTP Server(监听 9000)
├── knowledge.js    # 知识库(系统提示词),服务端注入
├── package.json    # type: module,启用 ESM;无第三方依赖
├── s.yaml          # Serverless Devs 部署配置(等价于原 wrangler.toml)
├── .fcignore       # 打包时排除的无关文件
└── README.md
```

## 一次性部署(约 10 分钟)

前置:一个已实名的阿里云账号,并开通「函数计算 FC」。到 [RAM 控制台](https://ram.console.aliyun.com/manage/ak) 创建一对 AccessKey(建议用只授予 FC 权限的子账号)。

```bash
# 1. 安装 Serverless Devs CLI(阿里云官方 Serverless 工具)
npm install -g @serverless-devs/s

# 2. 配置密钥(交互式,按提示选 Alibaba Cloud,粘贴 AccessKeyID / Secret)
s config add
# 一路按提示填,最后给这对密钥起别名,填:default(要与 s.yaml 里的 access 一致)

# 3. 进入本目录,把 API Key 放到本地环境变量(不会进 git)
cd worker
export LLM_API_KEY=sk-你的Key       # 以 DeepSeek 为例,去 platform.deepseek.com 申请
#    Windows PowerShell 用: $env:LLM_API_KEY="sk-你的Key"

# 4. 部署
s deploy -y
# 完成后会打印一个公网访问地址,形如:
#   https://changjunhao-agent-xxxxxxxx.cn-hangzhou.fcapp.run
```

> `s.yaml` 里的 `LLM_API_KEY: ${env('LLM_API_KEY')}` 会在部署时读取上面 `export` 的本地环境变量,**密钥不写进仓库**;这与原来 `wrangler secret put` 的作用一致。

## 部署后两步收尾

1. 打开 `../agent/index.html`,把顶部 `AGENT_API_URL` 填为
   `https://changjunhao-agent-xxxxxxxx.cn-hangzhou.fcapp.run/chat`(把域名换成你实际输出的那个)
2. 提交并推送仓库,GitHub Pages 自动上线:
   `https://changjunhao.github.io/agent/`(或 `https://www.ifable.cn/agent/`)

## 验证

```bash
# 把下面的域名换成你的实际地址
BASE=https://changjunhao-agent-xxxxxxxx.cn-hangzhou.fcapp.run

# 健康检查
curl $BASE/health

# 真实问答(应流式返回,-N 关闭缓冲)
curl -N -X POST $BASE/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://changjunhao.github.io" \
  -d '{"messages":[{"role":"user","content":"他的前端技术栈?"}]}'
```

## 本地调试(可选)

```bash
cd worker
export LLM_API_KEY=sk-你的Key
FC_SERVER_PORT=9000 npm start     # 监听 http://localhost:9000
# 另开终端:curl -N -X POST localhost:9000/chat -H 'Content-Type: application/json' \
#   -d '{"messages":[{"role":"user","content":"你好"}]}'
```

## 换模型厂商

改 `s.yaml` 的 `environmentVariables`(文件里有通义 / Kimi 的备选配置,取消注释即可),然后 `s deploy -y`。任何兼容 OpenAI Chat Completions 协议的端点都能接,无需改代码。

## 改知识库(系统提示词)

编辑 `knowledge.js` 里的 `KNOWLEDGE`,然后 `s deploy -y` 重新部署即生效。
口径与 `resume-zh-v4` 保持一致;**不要**写入手机号、期望薪资、内部备忘。

## 成本估算

- 函数计算:按量计费(vCPU·秒 + 内存·秒 + 请求次数),无访问时实例缩容到 0;每月有免费额度,个人站点量级基本零成本或极低。
- DeepSeek:输入约 ¥1/百万 token、输出约 ¥2/百万 token(缓存命中更低)。知识库约 2000 字 ≈ 3k token,单轮对话成本约 ¥0.01。充 10 块钱能聊上千轮。

## 安全设计

- Key 从环境变量注入,不写进仓库,任何响应都不会带出;
- CORS 白名单仅放行 `changjunhao.github.io`、`ifable.cn` 与 localhost;
- 每 IP 20 次/分钟限流(内存态,尽力而为;要更严可在函数前挂 API 网关或接 Redis);
- 消息条数与长度校验,防 prompt 注入式长文本攻击;
- 系统提示词在服务端注入,前端只传对话记录。
