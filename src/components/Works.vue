<template>
  <section id="works">
    <h1>最 新 作 品</h1>
    <article>
      <ul class="works-list">
        <li class="works-item" id="invite-panel">
          <div class="works-logo"></div>
          <h3 class="works-title"><a href="https://ifable.cn/works/new/invite" target="_blank">知乎邀请面板</a></h3>
          <p class="works-intro">按照知乎邀请面板实现其外观与功能：邀请按钮有「邀请」和「收回」两个状态；
            邀请或收回时，更新上方的 「您已邀请 x 等 n 人」的链接和文字。更多说明请查看：</p>
          <p>GitHub：
            <a href="https://github.com/changjunhao/invite-panel" target="_blank">
              github.com/changjunhao/invite-panel
            </a>
          </p>
        </li>
        <li class="works-item" id="ibook">
          <div class="works-logo"></div>
          <h3 class="works-title">iBook图书分享网站</h3>
          <p class="works-intro">使用node+mongodb搭建。图书信息可使用豆瓣API进行同步，也可自行填写上传。
            每个用户可对图书和他人评论进行评论和回复，并对不同用户提供了权限管理。更多说明请查看：</p>
          <p>GitHub：
            <a href="https://github.com/changjunhao/iBook" target="_blank">
              github.com/changjunhao/iBook
            </a>
          </p>
        </li>
      </ul>
      <div class="works-more">
        其他作品请<a href="http://blog.ifable.cn/works/" target="_blank">移步</a>
      </div>
    </article>
    <div class="prev">
      <a href="#/skill" hidefocus="true"></a>
    </div>
    <div class="next">
      <a href="#/more" hidefocus="true"></a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'works',
  };
</script>

<style>
  #works .works-list {
    height: auto;
    width: 100%;
    margin-top: 20px;
    padding: 0;
    overflow: hidden;
  }
  #works .works-item {
    float: left;
    height: auto;
    width: 405px;
    margin-left: 30px;
  }
  #works .works-item .works-logo {
    margin: 0 auto;
    height: 100px;
    width: 100px;
    -webkit-transition: 0.4s linear;
    transition: 0.4s ease-in;
  }
  #works .works-item .works-logo:hover {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
  #works .works-item .works-title {
    height: auto;
    font-size: 26px;
    text-align: center;
  }
  #works .works-title a:hover {
    border-bottom: 3px solid white;
  }
  #works .works-item .works-intro {
    height: auto;
    width: 405px;
    font-size: 18px;
    text-indent: 2em;
  }
  #works #invite-panel .works-logo {
    background: url(../assets/invite-panel.png) no-repeat center;
  }
  #works #ibook .works-logo {
    background: url(../assets/ibook.png) no-repeat center;
  }
  #works .works-more{
    margin-left: 30px;
    font-size: 18px;
  }
  #works .works-more a {
    color: red;
  }
</style>
