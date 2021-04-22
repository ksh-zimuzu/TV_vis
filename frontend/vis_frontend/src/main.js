import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import VueSmartWidget from 'vue-smart-widget'
import Vuetify from 'vuetify'
import router from './router'
import VueMeta from 'vue-meta'

import store from "./store";


import "vuetify/dist/vuetify.min.css"

const opts = {
  icons: {
    iconfont: "mdi"
  }
};



Vue.use(VueSmartWidget);
Vue.use(Vuetify);
Vue.use(VueMeta);
Vue.use(Vuex);
Vue.config.productionTip = false;

const store_instance = new Vuex.Store(store);

//事件总线，用于跨越组件树的事件传递，谨慎使用！
Vue.prototype.$EventBus = new Vue();

new Vue({
  vuetify: new Vuetify(opts),
  router,
  store: store_instance,
  render: h => h(App)
}).$mount("#app");
