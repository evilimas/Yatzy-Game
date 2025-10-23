import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameRoom from "../views/GameRoom.vue";
import LoginView from "../views/LoginView.vue";
import YatzyView from "../views/YatzyView.vue";
import YatzyMPView from "../views/YatzyMPView.vue";
import EditProfileView from "../views/EditProfileView.vue";

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
      component: EditProfileView,
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
      component: YatzyMPView,
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
