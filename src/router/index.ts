import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameRoom from "../views/GameRoom.vue";
import LoginView from "../views/LoginView.vue";
import YatzyView from "../views/YatzyView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
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
      component: YatzyView,
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
      component: GameRoom,
      props: true,
    },
  ],
});

export default router;
