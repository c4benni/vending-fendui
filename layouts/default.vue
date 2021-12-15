

<template>
  <div
    id="ui-root"
    :class="[
      `${$theme.is}`,
      {
        'touch-device': state.isTouchDevice,
        'strict-touch': state.isStrictTouchDevice,
        'can-hover': !state.isStrictTouchDevice,
      },
    
      breakpointsClasses,
    ]"
  >
    <nuxt-child v-if="$ui.mounted" />

    <!-- tailwind hasn't loaded yet,
    so render the page loader to hide unhydrated app-->
    <div
      v-else
      style="width:100%;height:100%;position:fixed;z-index:1000;display:grid;justify-content:center;align-items:center"
    >
      <div class="spinner-border" style="--size:2rem;"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Vue from 'vue'
import smoothscroll from 'smoothscroll-polyfill'

import registerComponents from '~/utils/registerComponents'
import { C4UiLib } from '~/utils/framework'
import breakpoints from '~/utils/breakpoints'

import {
  breakpointsClasses,
  mediaListener,
  nextAnimFrame,
  nextFrame,
  setTouchDevice,
  sleep,
} from '~/utils/main'

export default {
  name: 'DefaultLayout',

  data: () => ({
    ...breakpoints.data,
  }),

  head() {
    const links = []

    links.push(
      {
        hid: 'google-font-preconnect',
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        hid: 'gstatic-preconnect',
        rel: 'preconnect',
        crossorigin: 'true',
        href: 'https://fonts.gstatic.com',
      },
      {
        hid: 'public-sans-font',
        href: 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
        rel: 'stylesheet',
      },
      {
        hid: 'satisfy-font',
        href: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap',
        rel: 'stylesheet'
      }
    )

    if (this.$ui.mounted) {
      links.push(
        {
          hid: 'animations',
          rel: 'preload',
          as: 'style',
          href: 'css/animations.css',
        },
        {
          hid: 'animations',
          rel: 'stylesheet',
          href: 'css/animations.css',
        }
      )
    }
    return {
      title: this.$route.path == '/' ? 'Welcome' : 'Loading dashboard',
      link: [...links],
      htmlAttrs: {
        id: 'vending',
        lang: 'el',
      },
    }
  },
  computed: {
    ...breakpoints.computed,

    breakpointsClasses,

    state() {
      return this.$store.state
    },

    pageEntered() {
      return this.$store.getters.pageEntered
    },

    pageLoading() {
      return {
        appLoaded: this.state.appLoaded,
        showLoading: this.state.showPageLoading,
      }
    },
  },
  watch: {
    '$theme.light'() {
      const currentTheme =
        this.$theme.light ? 'dark' : 'light'

      const newTheme = this.$theme.light ? 'light' : 'dark'

      document.documentElement
        .classList.replace(
          currentTheme,
          newTheme
        )
    },
    async $route(n, o) {
      if (n.path == '/dashboard/account') {
        requestAnimationFrame(() => scrollTo(0, 0))
      }

      this.setGreetings()

      this.$commit('UPDATE', {
        path: 'mobileNav',
        value: false
      })

      if (this.$ui.mounted && this.state.mobileNav) {
        document.documentElement
          .classList.remove('overlay-active')
      }

      if ((n.path != '/' && o.path != '/') && (n.path != o.path)) {
        await this.$refreshUser()
      }
    },

    'state.breakpoints'(n) {
      if (/lg|xl/.test(n.is)) {
        if (this.state.mobileNav) {
          document.documentElement.classList.remove('overlay-active')
          this.$commit('UPDATE', {
            path: 'mobileNav',
            value: false
          })
        }
      }
    },

    '$route.path'() {
      if (this.$ui.mounted) {
        scrollTo(0, 0)
      }
    },

    async 'state.pageVisible'(n) {
      if (n) {

        setTouchDevice.call(this)

        this.$nuxt.refreshOnlineStatus()

        this.setGreetings()

        await this.$refreshUser('/?login=true', false)
      }
    },

    'state.user'(n) {
      if (n) {
        this.$commit('UPDATE', {
          path: 'bannerActive',
          value: n.showBanner
        })

      }
    }
  },

  beforeCreate() {
    registerComponents(Vue)

    Vue.prototype.$commit = this.$store.commit

    Vue.prototype.$dispatch = this.$store.dispatch

    Vue.prototype.$ui = Vue.observable(new C4UiLib(Vue.observable))

    Vue.prototype.$theme = Vue.prototype.$ui.theme
  },
  created() {
    this.onCreated()
  },
  async beforeMount() {
    await this.onBeforeMount()
  },
  mounted() {
    this.onMounted()
  },

  methods: {
    ...breakpoints.methods,
    setGreetings() {
      const greeting = () => {
        const hr = new Date().getHours()

        if (hr >= 0 && hr < 12) {
          return 'morning'
        }
        if (hr >= 12 && hr < 17) {
          return 'afternoon'
        }
        return 'evening'
      }

      this.$commit('UPDATE', {
        name: 'greeting',
        value: greeting(),
      })
    },

    onCreated() {
      this.setGreetings()

      Vue.prototype.$toggleShowBalance = (val = !this.$store.state.showBalance) => {

        let value = val;

        if (typeof value != 'boolean') {
          value = !this.$store.state.showBalance
        }

        this.$commit('UPDATE', {
          path: 'showBalance',
          value
        })
      }
    },

    async onBeforeMount() {

      const setPrototype = () => {
        Vue.prototype.$nextFrame = nextFrame.bind(this)

        Vue.prototype.$nextAnimFrame = nextAnimFrame.bind(this)

        Vue.prototype.$sleep = sleep

      }

      setPrototype()

      breakpoints.mounted.call(this)

      setTouchDevice.call(this)

      const setTheme = (val) => {
        this.$theme.is = val
          ; (
            document.documentElement || document.getElementsByTagName('html')[0]
          ).classList.add(this.$theme.light ? 'light' : 'dark')
      }

      const currentTheme = window.matchMedia('(prefers-color-scheme: light)')

      if (currentTheme?.matches) {
        setTheme('light')
      } else setTheme('dark')

      mediaListener({
        media: currentTheme,
        callback: (e) => {
          if (e.matches) {
            setTheme('light')
          } else setTheme('dark')
        },
      })

      window.history.scrollRestoration = 'auto'

      Vue.prototype.$storeUser = async () => {

        const { data: res } = await this.$axios.get('/auth')

        const { data, error } = res

        this.$commit('UPDATE', {
          path: 'user',
          value: !data ? null : {
            ...(this.$store.state.user || {}),
            ...data
          }
        })

        return { data, error }
      }

      Vue.prototype.$refreshUser = async (
        routeTo = '/?login=true',
        skipHomePage = true
      ) => {
        if (this.$route.path == '/' && skipHomePage) { return }

        const { data } = await this.$storeUser();

        if (!data && this.$ui.mounted && this.$route.fullPath != routeTo) {

          this.$router.replace(routeTo)
        }
      }

      Vue.prototype.$apiCall = async (url, method = 'get', payload = {}) => {

        const objectMethod = typeof method == 'object'

        const getMethod = (objectMethod ? 'post' : method).toLocaleLowerCase();

        try {
          const { data: response } = await this.$axios[getMethod](url, payload)

          return { data: response.data, error: null }
        } catch (e) {
          const resError = e.response;

          // expired session
          if (resError.status == 401 && /expired/.test(resError.data.error.message)) {

            this.$commit('UPDATE', {
              path: 'notify',
              value: {
                message: 'Session expired',
                error: true,
                timeout: 7500,
                key: Date.now()
              }
            })

            this.$commit('UPDATE', {
              value: null,
              path: 'user'
            })

            this.$router.replace('/?login=true')
          }

          return {
            error: resError.data.error,
            data: null
          }
        }
      }

      await this.$nextTick();

      await this.$refreshUser()

      await this.$nextTick();

      const session = this.state.user
      const path = this.$route.path

      // redirect back to dashboard if a logged in user is trying to access login page
      if (session && path == '/') {
        this.$router.replace('/dashboard')
      }

      // redirect back to login if a logged out user is trying to access dashboard

      else
        if (!session && path != '/') {
          return this.$router.replace('/')
        }
    },

    onMounted() {
      breakpoints.mounted.call(this)

      this.$nextTick(async () => {
        this.appMounted = true

        smoothscroll.polyfill()

        const togglePageVisiblity = () => {
          const hidden =
            document.hidden || document.webkitHidden || document.msHidden
          const visibility =
            document.visibilityState ||
            document.webkitVisibilityState ||
            document.msVisibilityState
          const documentHidden = !!hidden || /^hidden/i.test(visibility)
          const toggleVisibility = (value) => {
            this.$commit('UPDATE', {
              value,
              path: 'pageVisible',
            })
          }

          if (documentHidden) {
            toggleVisibility(false)
          } else toggleVisibility(true)
        }

        togglePageVisiblity()

        document.addEventListener('visibilitychange', togglePageVisiblity)

        await this.$sleep(200, true)

        Object.entries(this.state).forEach((x) => {
          this.$commit('UPDATE', {
            path: x[0],
            value: x[1],
          })
        })

        await this.$nextTick()

        this.$commit('UPDATE', {
          path: 'pageTransitionState',
          value: 'afterEnter',
        })

        await this.$sleep(200)

        this.showUserPrefTheme = false

        this.$ui.mounted = true
      })
    }
  },
}
</script>

<style>
#__layout {
  min-width: 100vw;
  min-height: 100vh;
  display: grid;
  justify-items: center;
}

#ui-root {
  background: var(--theme-surface);
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: 1fr;
  --sheet-header-height: 50px;
  position: relative;
  width: 100%;
  --nav-height: 42px;
  --header-height: 44px;
  --body-offset: 16px;
  --half-body-offset: calc(var(--body-offset) / 2);

  --divide-offset: 3rem;
  --half-offset: calc(var(--divide-offset) / 2);
  --qtr-offset: calc(var(--half-offset) / 2);
}

#ui-root.br-sm,
#ui-root.br-md {
  --body-offset: 18px;
}

#ui-root.lg-up {
  --body-offset: 20px;
}

#ui-root.br-xl::before {
  border: var(--ui-divide);
  border-width: 0 0.75px;
  z-index: 10;
  opacity: 0.5;
}

#ui-root.md-up {
  --nav-height: 0px;
  --header-height: 56px;
  overflow: hidden;
  display: grid;
  grid-template-columns: initial;
}

#ui-root.not-signed-in {
  grid-template-columns: 1fr;
}

#ui-root.br-xs,
#ui-root.br-sm {
  --nav-height: 48px;
  --header-height: 48px;
}

.first-loading-page {
  width: min(var(--max-width), 100vw);
  position: fixed;
  top: 0;
  background-color: var(--theme-surface);
  z-index: 13000;
  touch-action: none;
  display: grid;
  align-items: center;
  row-gap: 0.75rem;
  align-content: center;
  justify-items: center;
  place-items: center;
  height: 100%;
  --leave-duration: 300ms;
  --slide-x-leave: -100%;
  --slide-y-leave: -100%;
  --appear-to: 1;
}

/* .first-loading-page.signing-in {
  background: rgba(0, 0, 0, 0.75);
}

.first-loading-page.signing-in .loading-title {
  color: #fff;
} */

.first-loading-page .loading-title {
  font-size: 1rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  font-weight: 400;
  color: var(--primary);
  --appear-duration: 300ms;
}

.loading-page {
  width: 200%;
  width: var(--width, 200%);
  height: calc(100% - var(--nav-bar-height));
  height: var(--height, calc(100% - var(--nav-bar-height)));
  position: fixed;
  left: -50%;
  bottom: var(--nav-bar-height);
  bottom: var(--bottom, var(--nav-bar-height));
  background-color: var(--theme-surface);
  z-index: 13000;
  touch-action: none;
  display: grid;
  align-items: center;
  justify-items: center;
  place-items: center;
}

.app-main {
  position: relative;
  justify-self: flex-end;
  padding-bottom: var(--nav-height);
}

.app-main > div {
  isolation: isolate;
}

.md-up .app-main {
  padding-top: var(--header-height);
}

.app-main.pb-0 {
  padding-bottom: 0;
}

.br-xs .app-main,
.br-sm .app-main {
  width: 100vw;
  height: calc(100% - var(--nav-height));
  justify-self: initial;
  align-self: flex-start;
  padding-top: 0;
}

#ui-root.md-up .app-main {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden auto;
  align-self: flex-end;
}

@keyframes logo-loader {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes logo-load-wrap {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.logo-loader {
  --size: 44px;
  height: var(--size);
  width: var(--size);
}

.first-loading-page .logo-loader {
  animation: logo-loader 1.5s infinite ease-in-out both;
}

.logo-load-wrap {
  animation: logo-load-wrap 3.5s infinite alternate-reverse ease;
}

.md-up .logo-loader {
  --size: 64px;
}

@media screen and (min-width: 959px) {
  .logo-loader {
    --size: 64px;
  }
}
</style>
