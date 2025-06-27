// tests/HomeView.spec.ts
import { describe, it, expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import { createPinia, setActivePinia } from "pinia";
import { yatzyStore } from "@/stores/yatzyStore";
import { createRouter, createWebHistory } from "vue-router";
import YatzyView from "@/views/YatzyView.vue";
import WinnerModal from "../WinnerModal.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/yatzy", component: YatzyView },
];

describe("HomeView", () => {
  it("sets to 4 players and navigates to /yatzy - view", async () => {
    setActivePinia(createPinia());

    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    const store = yatzyStore();

    const input = wrapper.get('input[type="number"]');
    await input.setValue("4");

    expect(store.players).toBe(4);

    await router.push("/yatzy");
    await router.isReady();

    expect(router.currentRoute.value.path).toBe("/yatzy");

    expect(store.completeScoreboards.length).toBe(4);
  });
});

// describe("Check Component action and event", () => {
//   test("Enter value and emit event on button click", () => {
//     let wrapper = mount(WinnerModal);
//     const store = yatzyStore();
//     store.gameStarted = true;
//     // Find the button and activate it
//     wrapper.find("button").trigger("click");
//     // Capture the event parameters
//     let inputEvents = wrapper.emitted("newGame");
//     console.log(inputEvents);
//     // Check if the gameStarted is false
//     expect(inputEvents[0]).toEqual([(store.gameStarted === false)]);
//   });
// });
