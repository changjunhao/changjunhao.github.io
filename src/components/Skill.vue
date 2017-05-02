<template>
  <section id="skill">
    <h1 >专 业 技 能</h1>
    <article class="skills clear">
      <ul class="skill-lang">
        <li>语言</li>
        <li>HTML(5)</li>
        <li>CSS(3)</li>
        <li>Javascript</li>
        <li>Java</li>
        <li>SQL</li>
      </ul>
      <ul class="skill-template">
        <li>模版引擎</li>
        <li>Jade</li>
        <li>EJS</li>
      </ul>
      <ul class="skill-frame">
        <li>框架</li>
        <li>jQuery</li>
        <li>Vue.js</li>
      </ul>
      <ul class="skill-tech">
        <li>技术</li>
        <li>Git</li>
        <li>SVN</li>
        <li>Ajax</li>
      </ul>
    </article>
    <div class="prev">
      <a href="/" hidefocus="true"></a>
    </div>
    <div class="next">
      <a href="#/more" hidefocus="true"></a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'skill',
  };
</script>

<style>
  #skill ul {
    float: left;
    padding: 0;
    height: auto;
    width: 160px;
    margin: 60px 0 0 48.8px;
    border: 2px solid #FFFFFF;
    font-size: 20px;
    font-family: "Microsoft YaHei light";
    text-align: center;
    vertical-align: top;
  }
  #skill li {
    height: 36px;
    line-height: 36px;
  }
  #skill li:first-child {
    background-color: #FFFFFF;
    color: #333;
  }
  #skill li:hover {
    background-color: #FFFFFF;
    color: #333;
    cursor: default;
  }
</style>
