export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'UiTDatabank',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
  },
  /*
   ** Global CSS
   */
  css: ['~assets/styles/global.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['~/plugins/api.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'cookie-universal-nuxt',
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    'nuxt-socket-io',
    'nuxt-i18n',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas'],
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab'],
          },
        ],
      },
    ],
    '@nuxtjs/style-resources',
  ],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  publicRuntimeConfig: {
    apiKey: process.env.API_KEY,
    apiUrl: process.env.API_URL,
    legacyAppUrl: process.env.LEGACY_APP_URL,
    authUrl: process.env.AUTH_URL,
    newFeaturesUrl: process.env.NEW_FEATURES_URL,
    io: {
      sockets: [
        {
          default: true,
          name: 'uitdatabank',
          url: process.env.SOCKET_URL,
        },
      ],
    },
    environment: process.env.ENV_NAME,
  },
  router: {
    middleware: ['auth'],
  },
  styleResources: {
    scss: ['./assets/styles/_colors.scss'],
  },
  storybook: {
    stories: ['~/publiq-ui/**/*.stories.mdx'],
    addons: ['@storybook/addon-docs'],
  },
  i18n: {
    locales: ['nl', 'fr'],
    defaultLocale: 'nl',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'udb-language',
    },
    vueI18n: {
      fallbackLocale: 'nl',
      messages: {
        nl: require('./i18n/nl.json'),
        fr: require('./i18n/fr.json'),
      },
    },
  },
};
