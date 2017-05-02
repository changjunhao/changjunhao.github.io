// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import $ from 'jquery';
import App from './App';
import router from './router';
import './plugins/jquery.particleground.min';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  mounted() {
    $('body').particleground({
      dotColor: '#5cbdaa',
      lineColor: '#5cbdaa',
    });
    $('.link').css({
      'margin-left': ($('#intro-icon').width() - 300) / 4,
    });
  },
});
