<script>
import { mountSingleComponent, scrollWindow } from './utils/main'
export default {
  name: 'UiFooter',
  data() {
    return {
      selfName: 'UiFooter',
    }
  },
  computed: {
    ...mountSingleComponent.computed,
  },
  mounted() {
    mountSingleComponent.mounted.call(this)
  },
  // watch: {
  //   intersection() {
  //     const value = { ...this.intersection };
  //     this.$store.commit("UPDATE_", {
  //       name: "footerIntersection",
  //       value: {
  //         isIntersecting: value.isIntersecting,
  //         height: value.isIntersecting
  //           ? value?.entries?.intersectionRect?.height || 0
  //           : 0,
  //       },
  //     });
  //   },
  // },
  render(h) {
    if (!this.$store.state.appLoaded) {
      return h('div', ['loading footer...'])
    }
    const scoping = { 'data-uifr': '' }
    const footer = (d, c) => h('footer', d, c)
    const div = (d, c) => h('div', d, c)
    const p = (d, c) => h('p', d, c)
    const a = (d, c) => h('a', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)
    // const intersection = (d, c) => h("ui-intersection", d, c);
    // const intersectionLength = 200;

    const scroll = (e) => {
      requestAnimationFrame(() => {
        scrollWindow.call(this)
      })
    }

    return footer(
      {
        attrs: { ...scoping, 'aria-label': 'footer' },
        staticClass: 'root fill-before',
      },
      [
        // !/\/bag/i.test(this.$route.path)
        //   ? intersection({
        //       props: {
        //         config: {
        //           threshold: Array.from(
        //             { length: intersectionLength },
        //             (_, i) => i * (1 / intersectionLength)
        //           ),
        //         },
        //       },
        //       scopedSlots: {
        //         default: (payload) => {
        //           this.intersection = payload;
        //           return div({
        //             attrs: { ...scoping },
        //             staticClass: "observer",
        //           });
        //         },
        //       },
        //     })
        //   : null,
        btn(
          {
            attrs: {
              ...scoping,
              title: 'scroll to top',
            },
            props: {
              size: 'lg',
              background: this.$theme.light ? 'primary' : undefined,
              shape: 'circle',
              flat: true,
              outlined: this.$theme.dark,
              simpleButton: true,
              persistent: true,
            },
            staticClass: 'scroll-to-top',
            on: {
              // '&mousedown': scroll,
              '!click': scroll,
            },
          },
          [
            icon({
              props: { size: 28, name: 'chevronDoubleUp' },
              staticClass: 'icon',
            }),
          ]
        ),
        div(
          {
            attrs: { ...scoping },
            staticClass: 'last-row',
          },
          [
            div(
              {
                attrs: { ...scoping },
                staticClass: 'copyright-wrapper',
              },
              [
                h('ui-icon', {
                  attrs: {
                    ...scoping,
                    name: 'logo',
                    size: '48px',
                  },
                  staticClass: 'logo',
                }),

                p(
                  {
                    attrs: { ...scoping },
                    staticClass: 'app-name',
                  },
                  ['Nina Recipes']
                ),

                p(
                  {
                    attrs: { ...scoping, title: 'icons 8' },
                    staticClass: 'icons-8-props',
                  },
                  [
                    'All vector icons are from the awesome ',
                    a(
                      {
                        attrs: {
                          ...scoping,
                          href: 'https://icons8.com/illustrations',
                          target: '_blank',
                          title: 'visit Icons8',
                          rel: 'noopener',
                        },
                        staticClass: 'ext-link',
                      },
                      'Icons8'
                    ),
                  ]
                ),

                p(
                  {
                    attrs: {
                      ...scoping,
                    },
                    staticClass: 'copyright',
                  },
                  [
                    `Copyright © ${new Date().getFullYear()} • By `,
                    a(
                      {
                        attrs: {
                          ...scoping,
                          href: 'https://twitter.com/c4benn',
                          target: '_blank',
                          title: 'visit Icons8',
                          rel: 'noopener',
                        },
                        staticClass: 'ext-link',
                      },
                      'C4Benn'
                    ),
                  ]
                ),
              ]
            ),
          ]
        ),
      ]
    )
  },
}
</script>

<style>
.root[data-uifr] {
  background-color: var(--theme-banner);
  position: relative;
  isolation: isolate;
  display: grid;
  padding: var(--qtr-offset);
  z-index: 2;
}

.observer[data-uifr] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
}

.root[data-uifr]::before {
  border-top: var(--ui-divide);
}

.link-text[data-uifr] {
  margin-right: 0.35rem;
  font-size: 0.9rem;
}

.ext-link[data-uifr] {
  font-size: 0.9rem;
  font-style: italic;
  color: var(--primary) !important;
}

.last-row[data-uifr] {
  display: grid;
  align-items: center;
  grid-template-rows: auto auto;
  margin-top: 2rem;
  row-gap: 2rem;
  justify-items: center;
}

.copyright-wrapper[data-uifr] {
  display: grid;
  justify-items: center;
  row-gap: 0.5rem;
}

.logo[data-uifr] {
  opacity: var(--t-title);
  margin-left: 8px;
  margin-bottom: calc(var(--qtr-offset) / 2);
  color: var(--primary);
}

.app-name[data-uifr] {
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.3px;
  margin-bottom: var(--qtr-offset);
}

.copyright[data-uifr] {
  font-size: 0.8rem;
  color: var(--caption-c);
}

.light-theme .copyright[data-uifr] {
  --t-disabled: 0.7;
}

.scroll-to-top[data-uifr] {
  --btn__size-lg: 64px;
  justify-self: flex-end;
  position: absolute;
  top: -32px;
  right: 1rem;
}

.scroll-to-top[data-uifr] .outline {
  color: var(--divide-color) !important;
  opacity: var(--t-disabled);
  transform: none !important;
}

.scroll-to-top[data-uifr] span {
  opacity: 1;
}

.scroll-to-top[data-uifr] .__default-slot {
  overflow: visible;
}

.dark-theme .scroll-to-top[data-uifr] {
  background-color: var(--theme-primary);
  color: var(--primary);
}

.scroll-to-top[data-uifr] .icon {
  transition: 0.3s transform;
}

.scroll-to-top[data-uifr].Active .icon {
  transform: translate3d(0, -50%, 0);
}

.icons-8-props {
  font-size: 0.9rem;
  color: var(--subtitle-c);
  margin-bottom: var(--divide-offset);
  opacity: var(--t-subtitle);
  font-style: italic;
}
</style>
