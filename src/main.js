import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { firestorePlugin } from "vuefire";
import vuetify from "./plugins/vuetify";

Vue.use(firestorePlugin);

import VueMobileDetection from "vue-mobile-detection";
Vue.use(VueMobileDetection);

import VueOnlineProp from "vue-online-prop";
Vue.use(VueOnlineProp);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
