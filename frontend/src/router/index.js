import Home from "../views/Home.vue";
import Admin from "../views/Admin.vue";
import { createRouter as _createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/",
    name: "Login",
    meta: {
      keepAlive: false,
    },
    component: () =>
      import( "../views/Login.vue"),
  },
  {
    path: "/admin",
    name:"Admin",
    component: Admin
  }
];

const router = new _createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
