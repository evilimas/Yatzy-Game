import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { BiDice1, BiDice2, BiDice3, BiDice4, BiDice5, BiDice6 } from "oh-vue-icons/icons";

addIcons(BiDice1, BiDice2, BiDice3, BiDice4, BiDice5, BiDice6);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component("v-icon", OhVueIcon);

app.mount("#app");
