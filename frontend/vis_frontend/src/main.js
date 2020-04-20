import Vue from "vue";
import App from "./App.vue";
import VueSmartWidget from 'vue-smart-widget'
import Vuetify from 'vuetify'
import "vuetify/dist/vuetify.min.css";

const opts = {
  icons: {
    iconfont: "mdi"
  }
};

Vue.use(VueSmartWidget);
Vue.use(Vuetify);
Vue.config.productionTip = false;

//事件总线，用于跨越组件树的事件传递，谨慎使用！
Vue.prototype.$EventBus = new Vue();

new Vue({
  vuetify: new Vuetify(opts),
  render: h => h(App)
}).$mount("#app");
