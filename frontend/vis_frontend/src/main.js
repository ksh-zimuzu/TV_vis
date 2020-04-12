import Vue from "vue";
import App from "./App.vue";
import VueSmartWidget from 'vue-smart-widget'

Vue.use(VueSmartWidget);
Vue.config.productionTip = false;

//事件总线，用于跨越组件树的事件传递，谨慎使用！
Vue.prototype.$EventBus = new Vue();

new Vue({
  render: h => h(App)
}).$mount("#app");
