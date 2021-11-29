<script>
import { computedBR, mountSingleComponent } from './utils/main'
export default {
  name: 'NavBar',
  data: () => ({
    selfName: 'NavBar',
  }),
  computed: {
    ...mountSingleComponent.computed,

    ...computedBR,

    navLinks() {
      const path = this.$route.path

      return [
        {
          title: 'Explore',
          icon: 'explore',
          active: /^\/$|^\/recipe\/|\/view-all\//.test(path),
          exactActive: path === '/',
          to: '/',
        },
        {
          title: 'Search',
          icon: 'magnify',
          active: /^\/search/.test(path),
          exactActive: path === '/search',
          to: '/search',
        },
        {
          title: 'Saved',
          icon: 'heart',
          active: /^\/saved/.test(path),
          exactActive: path === '/saved',
          to: '/saved',
        },
        {
          title: 'Profile',
          icon: 'account',
          active: /^\/profile/.test(path),
          exactActive: path === '/profile',
          to: '/profile',
        },
      ]
    },
  },
  mounted() {
    mountSingleComponent.mounted.call(this)
  },
  render(h) {
    if (!/xxs|xs|sm/.test(this.breakpoints.is)) {
      return null
    }

    const scoping = { 'data-nbr': '' }
    const nav = (d, c) => h('nav', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    return nav(
      {
        attrs: { ...scoping },
        staticClass: 'root fill-before-after',
      },
      [
        this.navLinks.map((item, key) => {
          return btn(
            {
              key: key + 'link' + item.active,
              attrs: {
                ...scoping,
                title: item.title.toLowerCase(),
                'aria-label': item.title,
              },
              props: {
                to: item.to,
                text: true,
                case: item.active ? 'upper' : undefined,
                color: item.active ? 'primary' : undefined,
                // filledText: item.active,
                filledOpacity: '.2',
                // outlined: item.active,
                // outlinedOpacity: '.1',
              },
              staticClass: 'item',
              class: [
                {
                  'fade-slide-y-appear': item.active,
                },
              ],
            },
            [
              icon({
                attrs: { ...scoping, size: '24', name: item.icon },
              }),
              [item.active ? '•' : null],
            ]
          )
        }),
      ]
    )
  },
}
</script>

<style>
.root[data-nbr] {
  height: var(--nav-height);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: 1fr;
  position: fixed;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background: var(--blur-banner);
  isolation: isolate;
  z-index: 10;
}

.root[data-nbr]::before {
  backdrop-filter: var(--banner-backdrop-filter);
}

.root[data-nbr]::after {
  border-top: var(--ui-divide);
  opacity: var(--t-disabled);
}

.item[data-nbr] {
  display: grid;
  grid-auto-flow: row;
  justify-items: center;
  height: 100% !important;
  min-height: 100% !important;
  width: 100% !important;
  border-radius: 0 !important;
  padding: 0.3rem !important;
  font-size: 1rem !important;
  --slide-y: 4px;
  --appear-duration: 150ms;
  font-weight: 600 !important;
}

.item[data-nbr] > .outline {
  border-bottom: none;
}
</style>
