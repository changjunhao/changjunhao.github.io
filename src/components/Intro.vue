<template>
  <section id="intro">
    <h1 id="name">
      <a href="https://changjunhao.github.io">常 君 豪</a>
    </h1>
    <article class="clear">
      <div id="intro-icon">
        <a class="link" href="http://weibo.com/zennew" id="link-weibo" target="_blank" title="微博">微博</a>
        <a class="link" href="https://github.com/changjunhao" id="link-github" target="_blank" title="GitHub">GitHub</a>
        <a class="link" href="http://blog.ifable.cn" id="link-blog" target="_blank" title="Blog">Blog</a>
      </div>
      <ul class="info">
        <li><span>姓名</span> | 常君豪</li>
        <li><span>出生日期</span> | 1992-02-16</li>
        <li><span>所在地</span> | 北京 - 海淀</li>
        <li><span>邮箱</span> | <a href="mailto:&#99;&#104;&#97;&#110;&#103;&#106;&#117;&#110;&#104;&#97;&#111;&#64;&#111;&#117;&#116;&#108;&#111;&#111;&#107;&#46;&#99;&#111;&#x6d;" hideFocus="true">&#99;&#104;&#97;&#110;&#103;&#106;&#117;&#110;&#104;&#97;&#111;&#64;&#111;&#117;&#116;&#108;&#111;&#111;&#107;&#46;&#99;&#111;&#x6d;</a></li>
        <li><span>GitHub</span> | <a href="https://github.com/changjunhao" target="_blank">点击进入</a> </li>
        <li><span>Linkedin</span> | <a href="https://cn.linkedin.com/in/ifable" target="_blank">点击进入</a></li>
        <li><span>Blog</span> | <a href="http://blog.ifable.cn" target="_blank">点击进入</a></li>
      </ul>
      <div class="experience">
        <p>我喜欢研究所碰到的各种技术，不给自己设边界，有 Geek 精神。<br>我有时间概念，能在约定时间内保证完成任务。</p>
        <p>熟悉 HTML、CSS、Javascript，能熟练开发符合 W3C 标准的页面，熟练使用 jQuery 框架。<br>
          有良好的编码习惯。<br>
          有 Java 基础，对服务器端开发有一定了解，能够配合程序员完成相关工作。<br>
        </p>
      </div>
    </article>
    <div class="next">
      <a href="#/skill" hidefocus="true"></a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'intro',
  };
</script>

<style>
  #intro-icon {
    height: 100px;
    width: 100%;
    line-height: 100px;
  }
  .link {
    display: inline-block;
    height: 100px;
    width: 100px;
    text-indent: -9999em;
    -webkit-transition: 0.4s linear;
    transition: 0.4s ease-in;
  }
  .link:hover {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
  #link-github {
    background: url(../assets/github.png) no-repeat center;
  }
  #link-weibo {
    background: url(../assets/weibo.png) no-repeat center;
  }
  #link-blog {
    background: url(../assets/blog.png) no-repeat center;
  }
  .info {
    float: left;
    width: 320px;
  }
  .info li {
    height: 30px;
  }
  .info li a {
    display: inline-block;
  }
  .info li a:hover {
    border-bottom: 2px solid white;
  }
  .info li span {
    display: inline-block;
    text-align: right;
    width: 70px;
  }
  .experience {
    float: right;
    display: inline-block;
    width: 460px;
    margin-left: 80px;
  }
  .experience p{
    line-height: 1.5em;
  }
</style>
