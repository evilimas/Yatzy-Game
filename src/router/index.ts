import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/yatzy",
      name: "yatzy",
      component: () => import("../views/YatzyView.vue"),
      props: true,
    },
  ],
});

export default router;
