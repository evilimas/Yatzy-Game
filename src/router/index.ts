import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      props: true,
    },
    {
      path: "/edit-profile",
      name: "edit-profile",
      component: () => import("../views/EditProfileView.vue"),
      props: true,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/yatzy",
      name: "yatzy",
      component: () => import("../views/YatzyView.vue"),
      props: true,
    },
    {
      path: "/yatzy-mp",
      name: "yatzy-mp",
      component: () => import("../views/YatzyMPView.vue"),
      props: true,
    },
    {
      path: "/yatzy-mp/:roomId",
      name: "yatzy-mp-room",
      component: () => import("../views/GameRoom.vue"),
      props: true,
    },
  ],
});

export default router;
