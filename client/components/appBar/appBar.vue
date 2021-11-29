<script>
import { computedBR, mountSingleComponent } from '../utils/main'
export default {
  name: 'AppBar',
  data: () => ({
    selfName: 'AppBar',
  }),
  computed: {
    ...computedBR,
    ...mountSingleComponent.computed,
    navLinks() {
      const path = this.$route.path
      return [
        {
          title: 'Explore',
          to: '/',
          active: /^\/$|^\/recipe\/|\/view-all\//.test(path),
          exactActive: path == '/',
        },
        {
          title: 'Saved',
          to: '/saved',
          active: /\/saved/.test(path),
          exactActive: /\/saved$/.test(path),
        },
        {
          title: 'Profile',
          to: '/profile',
          active: /\/profile/.test(path),
          exactActive: /\/profile$/.test(path),
        },
      ]
    },
  },
  mounted() {
    mountSingleComponent.mounted.call(this)
  },
  render(h) {
    const scoping = { 'data-abr': '' }
    const header = (d, c) => h('header', d, c)
    const nav = (d, c) => h('nav', d, c)
    const div = (d, c) => h('div', d, c)

    const a = (d, c) => h('nuxt-link', d, c)
    const h1 = (d, c) => h('h1', d, c)

    const icon = (d, c) => h('ui-icon', d, c)

    const btn = (d, c) => h('ui-btn', d, c)

    const breakpoints = this.breakpoints

    const smDown = /sm|xs|xxs/.test(breakpoints.is)

    const headerPath = this.$store.state.header

    const headerText = headerPath.text

    return header(
      {
        attrs: { ...scoping },
        staticClass: 'root fill-before-after',
        class: [
          {
            show: smDown && headerPath.showOnMobile,
          },
        ],
      },
      [
        a(
          {
            attrs: { ...scoping },
            staticClass: 'app-logo',
            props: {
              to: '/',
            },
            title: 'nina recipes',
          },
          [
            icon({
              attrs: {
                ...scoping,
                name: 'logo',
                size: smDown ? '26px' : '38px',
              },
              staticClass: 'primary-text logo',
            }),

            [!smDown && 'Nina recipes'],
          ]
        ),

        [
          smDown
            ? [
                h1(
                  {
                    attrs: { ...scoping },
                    staticClass: 'title line-clamp-1',
                  },
                  headerText
                ),

                icon({
                  key: this.$theme.is + 'btn',
                  attrs: {
                    ...scoping,
                    name: `${this.$theme.dark ? 'dark' : 'light'}Mode`,
                    clickable: true,
                    size: 'lg',
                  },
                  staticClass: 'theme-btn transparent fade-appear',
                  on: {
                    '!click': () => {
                      this.$theme.light = !this.$theme.light
                    },
                  },
                }),
              ]
            : [
                h1(
                  {
                    attrs: { ...scoping },
                    staticClass: 'title sr-only',
                  },
                  headerText
                ),
                nav(
                  {
                    attrs: { ...scoping },
                    staticClass: 'links-wrap fill-before',
                  },
                  [
                    this.navLinks.map((item, key) => {
                      return btn(
                        {
                          key: key + 'link',
                          attrs: { ...scoping, title: item.title },
                          props: {
                            to: item.to,
                            text: true,
                            filledText: item.active,
                            filledOpacity: item.active ? '0.2' : undefined,
                            case: item.active ? 'upper' : undefined,
                            color: item.active ? 'primary' : undefined,
                          },
                          class: [
                            {
                              __active: item.active,
                            },
                          ],
                        },
                        [item.title]
                      )
                    }),
                  ]
                ),

                div(
                  {
                    attrs: { ...scoping },
                    staticClass: 'icons-wrap',
                  },
                  [
                    {
                      name: 'magnify',
                      title: 'search site',
                      to: '/search',
                      active: /^\/search/.test(this.$route.path),
                    },
                    {
                      name: `${this.$theme.dark ? 'dark' : 'light'}Mode`,
                      on: {
                        '!click': () => {
                          this.$theme.light = !this.$theme.light
                        },
                      },
                      staticClass: 'fade-appear',
                      title: 'change theme',
                      key: this.$theme.is,
                    },
                  ].map((item, key) => {
                    return btn(
                      {
                        key: key + 'lg-icon' + item.key,
                        attrs: { ...scoping, title: item.title },
                        props: {
                          text: true,
                          to: item.to,
                          filledText: item.active,
                          filledOpacity: item.active ? '0.2' : undefined,
                        },
                        staticClass: `${
                          item.staticClass ? item.staticClass : ''
                        } lg-icons`,
                        on: item.on,
                        class: [
                          {
                            __active: item.active,
                          },
                        ],
                      },
                      [
                        icon({
                          attrs: { ...scoping, name: item.name },
                        }),
                      ]
                    )
                  })
                ),
              ],
        ],
      ]
    )
  },
}
</script>

<style>
/* MOBILE FIRST */

.root[data-abr] {
  z-index: 10;
  height: var(--header-height);
  min-height: var(--header-height);
  width: 100%;
  max-width: var(--max-width);
  position: fixed;
  top: 0;
  background: var(--blur-header);
  isolation: isolate;
  padding: 0 var(--body-offset);
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  --icon-size: 0px;
}

.sm-down .root[data-abr] {
  visibility: hidden;
  opacity: 0;
  transform: translate3d(0, -4px, 0);
}

.root[data-abr].show {
  visibility: visible;
  transform: translate3d(0, 0, 0);
  opacity: 1;
  /* transition: 0.15s opacity, 0.15s transform; */
}

.root[data-abr]::before {
  z-index: -1;
}

@supports (backdrop-filter: blur(0px)) {
  .root[data-abr]::before {
    backdrop-filter: var(--header-backdrop-filter);
  }
}

@supports not (backdrop-filter: blur(0px)) {
  .root[data-abr]::before {
    background: var(--theme-banner);
  }
}

.root[data-abr]::after {
  border-bottom: var(--ui-divide);
  opacity: var(--t-disabled);
}

.app-logo[data-abr] {
  display: inline-grid;
  align-items: flex-end;
  grid-auto-flow: column;
  column-gap: var(--half-body-offset);
  width: max-content;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.4px;
  text-decoration: none;
  color: var(--title-c);
}

.br-sm .root[data-abr],
.br-xs .root[data-abr],
.br-xxs .root[data-abr] {
  display: flex;
  justify-content: space-between;
}

.can-hover .app-logo[data-abr]:hover {
  text-decoration: underline;
  color: var(--primary);
}

.title[data-abr] {
  padding: 0 0.25rem;
  display: grid;
  place-items: center;
  font-weight: 500;
  font-size: 1rem;
}

/* LARGE DEVICE */

.icons-wrap[data-abr],
.links-wrap[data-abr] {
  height: 100%;
}

.md-up .root[data-abr] {
  --icon-size: 44px;
  padding-top: 0 1;
  grid-template-columns: 1fr auto calc(var(--icon-size) * 2);
}

.links-wrap[data-abr] {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  position: relative;
  padding-right: 0.35rem;
  column-gap: 0.25rem;
}

.links-wrap[data-abr]::before {
  height: 70%;
  top: 15%;
  border-right: var(--ui-divide);
}

.icons-wrap[data-abr] {
  width: calc(var(--icon-size) * 2 + 0.35rem);
  display: grid;
  align-items: center;
  justify-content: flex-end;
  grid-template-columns: repeat(2, var(--icon-size));
}
</style>
