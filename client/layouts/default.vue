<script>
import Vue from 'vue'
import smoothscroll from 'smoothscroll-polyfill'

import registerComponents from '~/components/utils/registerComponents'
import { C4UiLib } from '~/components/utils/framework'
import breakpoints from '~/components/utils/breakpoints'

import IDB from '~/components/utils/db/IDB'
// import matchVuexAndIDB from '~/components/utils/db/matchVuexAndIDB'

// import { watchers as updateIDBVuexWwatchers } from '~/components/utils/db/updateIDBfromVuex'

import {
  breakpointsClasses,
  getUid,
  mediaListener,
  nextAnimFrame,
  nextFrame,
  scrollWindow,
  setTouchDevice,
  sleep,
} from '~/components/utils/main'

export default {
  name: 'DefaultLayout',
  data: () => ({
    ...breakpoints.data,
    loadingText: 'LOADING...',
    prefetch: ['working'],
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

        href: 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600&display=swap',
        rel: 'stylesheet',
      }
      // {
      //   hid: 'main-styles',
      //   rel: 'stylesheet',
      //   href: '/main.css',
      // }
    )

    if (this.$c4.mounted) {
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
    } else {
      links.push(
        {
          hid: 'initial-theme-styles-preload',
          rel: 'preload',
          as: 'style',
          href: `css/initialTheme.css`,
        },
        {
          hid: 'initial-theme-styles',
          rel: 'stylesheet',
          href: `css/initialTheme.css`,
        }
      )
    }

    const headerText = this.$store.state.headerText

    return {
      title: headerText ? headerText + ' page' : '',
      link: [...links],
      //   style: [{ cssText: styles, type: 'text/css', hid: 'ui-styles' }],
      htmlAttrs: {
        id: 'nina',
        lang: 'el',
      },
    }
  },
  computed: {
    ...breakpoints.computed,
    pageEntered() {
      return this.$store.getters.pageEntered
    },

    pageLoading() {
      return {
        appLoaded: this.$store.state.appLoaded,
        showLoading: this.$store.state.showPageLoading,
        // pageRendered: this.$route.matched[0].instances.default.selfRendered,
      }
    },
  },
  watch: {
    '$theme.light'() {
      this.$el
        .closest('html')
        .classList.replace(
          this.$theme.light ? 'dark-theme' : 'light-theme',
          this.$theme.light ? 'light-theme' : 'dark-theme'
        )
    },
    $route(n, o) {
      this.setGreetings()

      this.willChangeLoading = false
      this.loadingLeaveAnimation = false

      if (n.path != o.path) {
        this.$commit('UPDATE_', {
          path: 'showOnMobile',
          value: false,
          innerPath: 'header',
        })
      }
    },

    '$c4.overlays'() {
      if (this.$c4.overlays.length) {
        if (!this.$c4.htmlOverlayClassAdded) {
          this.$c4.htmlOverlayClassAdded = true
          const html = this.$el.closest('html')
          html.style.setProperty(
            '--padding-right',
            `${innerWidth - html.clientWidth}px`
          )
          requestAnimationFrame(() => {
            html.classList.add('overlay-active')
          })
        }
      } else {
        const html = this.$el.closest('html')

        html.classList.remove('overlay-active', 'no-overlay')

        html.style.removeProperty('--padding-right')

        this.$c4.htmlOverlayClassAdded = false
      }
    },
    async '$store.state.vmodel.pageVisible'(n) {
      if (n) {
        await this.$nuxt.refresh()

        setTouchDevice.call(this)

        this.$nuxt.refreshOnlineStatus()

        this.setGreetings()
      }
    },

    async pageLoading(n) {
      const loadingText = (value = 'LOADING...') => (this.loadingText = value)
      const toggleLoading = (value = true) =>
        this.$nextTick(() => (this.showLoading = value))
      if (n.appLoaded) {
        if (n.showPageLoading) {
          loadingText()
          return toggleLoading()
        }

        this.willChangeLoading = true
        this.loadingLeaveAnimation = true

        await this.$sleep(300)

        toggleLoading(false)

        await this.$nextTick()

        this.willChangeLoading = false
        this.loadingLeaveAnimation = false
      } else {
        loadingText()
        return toggleLoading()
      }
    },
  },
  beforeCreate() {
    registerComponents(Vue)

    Vue.prototype.$commit = this.$store.commit

    Vue.prototype.$loadedComponent = (str) =>
      !!this.$store.state.fetched.components[str]

    Vue.prototype.$c4 = Vue.observable(new C4UiLib(Vue))

    Vue.prototype.$theme = Vue.prototype.$c4.theme

    Vue.prototype.$IDB = IDB
  },
  created() {
    this.setGreetings()
  },
  async beforeMount() {

    const setPrototype = () => {
      Vue.prototype.$nextFrame = nextFrame.bind(this)

      Vue.prototype.$nextAnimFrame = nextAnimFrame.bind(this)

      Vue.prototype.$sleep = sleep

      Vue.prototype.$scrollWindow = scrollWindow.bind(this)
    }

    setPrototype()

    breakpoints.mounted.call(this)

    setTouchDevice.call(this)

    const setTheme = (val) => {
      this.$theme.is = val
        ; (
          document.documentElement || document.getElementsByTagName('html')[0]
        ).classList.add(this.$theme.light ? 'light-theme' : 'dark-theme')
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

    await this.$nextTick()
    await this.$IDB({
      action: 'init',
      args: { name: 'nina' },
    })

    this.$commit('UPDATE_', {
      path: 'init',
      innerPath: 'idb',
      value: true,
    })

    // if (response.data.upgradeCalled && response.data.uid) {
    //   await this.$store.getters.supabase.from('profiles').insert({
    //     uid,
    //   })
    // }

    const uid = await getUid.call(this)

    this.$commit('UPDATE_', {
      path: 'idb',
      value: {
        ...this.$store.state.idb,
        uid,
      },
    })
  },

  mounted() {
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
          this.$commit('UPDATE_', {
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

      Object.entries(this.$store.state).forEach((x) => {
        this.$commit('UPDATE_', {
          path: x[0],
          value: x[1],
        })
      })

      await this.$nextTick()

      this.$commit('UPDATE_', {
        path: 'pageTransitionState',
        value: 'afterEnter',
      })

      await this.$sleep(200)

      this.showUserPrefTheme = false

      this.$c4.mounted = true
      this.$commit('UPDATE_', {
        path: 'appLoaded',
        value: true,
      })
    })
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

      this.$commit('UPDATE_', {
        name: 'greeting',
        value: greeting(),
      })
    },
  },
  render(h) {
    const scoping = { 'data-l-dt': '' }
    const div = (d, c) => h('div', d, c)
    const Nuxt = (d) => h('nuxt', d)
    const main = (d, c) => h('main', d, c)

    return div(
      {
        attrs: {
          ...scoping,
        },
        domProps: {
          id: 'ui-root',
        },
        staticClass: 'theme-surface',
        class: [
          `${this.$theme.is}-theme`,
          this.$store.state.pageTransition,
          {
            'touch-device': this.$store.state.isTouchDevice,
            'strict-touch': this.$store.state.isStrictTouchDevice,
            'can-hover': !this.$store.state.isStrictTouchDevice,
            'page-transitioning': !this.pageEntered,
            'backdrop-false': !this.$store.state.supportsBackdrop,
            'backdrop-true': this.$store.state.supportsBackdrop,
            'no-page-anim': this.$store.state.noPageAnimation,
          },

          breakpointsClasses.call(this),
        ],
        on: {
          '&mousedown': () => { },
          '&mousemove': () => { },
          '&mouseup': () => { },
          '&touchstart': () => { },
          '&touchmove': () => { },
          '&touchcancel': () => { },
          '&touchend': () => { },
          '&keydown': () => { },
          '&keyup': () => { },
          '&blur': () => { },
          '&click': () => { },
          '&load': () => { },
          '&error': () => { },
        },
      },
      [
        main([
          Nuxt()
        ])
      ]
    )
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
  --max-width: 2564px;
  min-width: min(var(--max-width), 100vw);
  max-width: var(--max-width);
  min-height: 100vh;
  height: 100%;
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
