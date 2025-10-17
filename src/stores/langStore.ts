import { defineStore } from "pinia";
import { ref } from "vue";

export const useLangStore = defineStore("lang", () => {
  type Lang = "en" | "no";
  const currentLang = ref<Lang>("en");

  const setLang = (lang: Lang) => {
    currentLang.value = lang;
  };

  return { currentLang, setLang };
});
