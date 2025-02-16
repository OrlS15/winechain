// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui", "@nuxt/image", "@vueuse/nuxt"],

  runtimeConfig: {
    public: {
      BC_URL: "",
      BC_CONTRACT_ADDRESS: "",
      BC_CONTRACT_ABI: "",
    },
    BC_PRIVATE_KEY: "",
  },

  ui: {
    colorMode: false,
  },
})