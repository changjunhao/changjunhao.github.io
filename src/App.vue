<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
  @import './assets/style/normalize.css';
  html,body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  body {
    font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
    background: #16a085;
    color: #fff;
  }
  ul, ol{
    list-style: none;
  }
  img{
    border: 0;
  }
  a{
    color: #FFFFFF;
    text-decoration: none;
    outline-style:none;
  }
  a:hover, a:focus{
    text-decoration: none;
  }
  .clear{
    *zoom: 1
  }
  .clear:before,.clear:after{
    display: table;
    content: ""
  }
  .clear:after{
    clear: both
  }
  .hidden{
    display: none;
  }
  /*section*/
  section {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 960px;
    height: 480px;
    margin-top: -240px;
    margin-left: -480px;
    background: rgba(200,200,200,0.7);
    border-radius: 6px;
  }
  section h1{
    text-align: center;
  }
  section article {
    width: 900px;
    margin: 0 30px;
  }
  .prev,.next{
    position: absolute;
    top: 50%;
    margin-top: -16px;
    height: 32px;
    width: 18px;
  }
  .prev a,.next a {
    display: block;
    height: 32px;
    width: 18px;
    margin: 0 auto;
  }
  .prev{
    left: 10px;
  }
  .prev a {
    background: url("./assets/prev.png") no-repeat center;
  }
  .next {
    right: 10px;
  }
  .next a {
    background: url("./assets/next.png") no-repeat center;
  }
</style>
