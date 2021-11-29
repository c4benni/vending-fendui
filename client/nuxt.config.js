const description =
  'Discover your favourite recipes from different parts of the world!'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Vending App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Discover your favourite recipes!',
      },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'twitter-app-country',
        property: 'twitter:app:country',
        content: 'NG',
      },
      {
        hid: 'twitter-site',
        property: 'twitter:site',
        content: '@c4benn',
      },
      {
        hid: 'twitter-image',
        property: 'twitter:image',
        content: '~static/icon.png',
      },
      {
        hid: 'twitter-card',
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter-title',
        property: 'twitter:title',
        content: 'Vending App - Buy and sell easily',
      },
      {
        hid: 'twitter-desc',
        property: 'twitter:description',
        content: description,
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~static/css/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  loading: false,

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  router: {
    base: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      name: 'Vending App',
      shortName: 'Vending',
      short_name: 'Vending',
      description,
      background_color: '#000',
    },
    meta: {
      author: 'Chidi Benedict',
      themeColor: '#cacd23',
      nativeUI: true,
      // ohHost: 'https://www.c4benni.github.io/nina'
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  server: {
    // port: 8000, // default: 3000
    host: '0.0.0.0', // default: localhost
  }, // other configs

  pageTransition: {},
}
