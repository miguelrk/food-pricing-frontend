import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/record",
    name: "record",
    component: () =>
      import(/* webpackChunkName: "record" */ "../views/Record.vue")
  },
  {
    path: "/menu",
    name: "menu",
    component: () => import(/* webpackChunkName: "menu" */ "../views/Menu.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
