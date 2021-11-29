<script>
import {
  computedBR,
  getParallax,
  mountComplexPage,
} from '~/components/utils/main'
export default {
  name: 'ParallaxPage',
  props: {
    img: {
      type: Object,
      default: () => ({}),
    },
    hideFooter: Boolean,
  },
  data: () => ({
    selfName: 'ParallaxPage',
    renderedComponents: ['AppImg', 'UiFooter', 'UiIntersection'],
    headerOpacity: 0,
    headerLeaveTransform: {},
    pageInfoIntersectionRatio: null,
  }),

  computed: {
    ...mountComplexPage.computed,
    ...computedBR,

    pageTitle() {
      const recipe = this.recipe

      const title = recipe.title || 'loading recipe title...'

      return `View recipe - ${title} `
    },
    getHeaderLeaveTransform() {
      if (typeof this.pageInfoIntersectionRatio != 'number') {
        return ''
      }
      const $scale = this.progress(
        this.headerLeaveTransform.scale,
        1,
        this.pageInfoIntersectionRatio
      )

      const scale = `scale3d(${$scale},${$scale},1)`

      //   const trans = this.progress(
      //     this.headerLeaveTransform.translate,
      //     0,
      //     this.pageInfoIntersectionRatio
      //   )

      //   const translate = `translate3d(0,${trans}px,0)`
      const translate = ``

      return `${scale} ${translate}`
    },
  },
  watch: {
    ...mountComplexPage.watch,
    'breakpoints.is'() {
      this.setHeaderLeaveTransform()
    },
  },
  created() {
    this.setHeaderLeaveTransform()
  },
  mounted() {
    mountComplexPage.mounted.call(this)
  },
  methods: {
    ...mountComplexPage.methods,
    setHeaderLeaveTransform() {
      const br = this.breakpoints
      const mobileDevice = /xxs|xs|sm/.test(br.is)

      this.headerLeaveTransform = getParallax(
        mobileDevice ? 350 : 450,
        mobileDevice ? 450 : 480
      )
    },
    progress(from, to, ratio) {
      return from - (from - to) * ratio
    },
  },
  render(h) {
    const div = (d, c) => h('div', d, c)

    const footer = (d, c) => h('uiFooter', d, c)

    const scoping = { 'data-ppe': '' }
    // const h2 = (d, c) => h('h2', d, c)

    const intersection = (d, c) => h('ui-intersection', d, c)

    const img = (d, c) => h('appImg', d, c)

    const br = this.breakpoints

    const imgColors = {
      '--linear-1': this.img.background.replace(/\)$/, ',0)'),
      '--linear-2': this.img.background.replace(/\)$/, ',0.025)'),
      '--linear-3': this.img.background.replace(/\)$/, ',0.075)'),
      '--linear-4': this.img.background.replace(/\)$/, ',0.25)'),
      '--background': this.img.background,

      '--color': this.img.color,
    }

    const mobileDevice = /xxs|xs|sm/.test(br.is)

    const showMobileHeader = this.$store.state.header.showOnMobile

    const pageInfo = () => {
      const el = div(
        {
          attrs: {
            ...scoping,
          },
          staticClass: 'page-info fill-before',
          class: [
            {
              //   __fill: this.pageInfoIntersectionRatio >= 0.5,
              'has-gradient': this.pageInfoIntersectionRatio > 0,
            },
          ],
          style: mobileDevice
            ? {
                ...imgColors,
                // '--opacity': !showMobileHeader ? `${this.headerOpacity}` : '0',
              }
            : undefined,
        },
        [
          [
            intersection({
              props: {
                config: {
                  threshold: [
                    ...Array.from(
                      {
                        length: 200,
                      },
                      (_, i) => (i * 1) / 200
                    ),
                    1,
                  ],
                },
              },
              scopedSlots: {
                default: (pay) => {
                  if (
                    this.$store.state.appLoaded &&
                    pay.entries.boundingClientRect
                  ) {
                    this.$commit('UPDATE_', {
                      path: 'windowHeight',
                      value: pay.entries.rootBounds.height,
                    })
                    ;(!showMobileHeader || !mobileDevice) &&
                      this.$nextTick(() => {
                        this.pageInfoIntersectionRatio =
                          1 - pay.entries.intersectionRatio
                      })
                  }

                  return div({
                    attrs: { ...scoping, 'aria-hidden': 'true' },
                    staticClass: 'pseudo',
                  })
                },
              },
            }),
          ],
          [this.$scopedSlots?.header?.()],
        ]
      )

      return el
    }

    return div(
      {
        attrs: {
          ...scoping,
        },
        staticClass: 'root',
        class: [
          {
            'dark-bg': this.img.color == '#fff',
            'light-bg': this.img.color == '#000',
            '__will-change':
              this.pageInfoIntersectionRatio > 0 &&
              this.pageInfoIntersectionRatio < 1,
          },
        ],
        style: {
          '--img-height': mobileDevice ? '350px' : '450px',
        },
      },
      [
        img({
          props: {
            ...(this.img || {}),
            height: /xxs|xs|sm/.test(br.is) ? '350px' : '450px',
          },
          style: !mobileDevice
            ? {
                ...imgColors,
                '--transform': this.getHeaderLeaveTransform,
              }
            : {
                '--transform': this.getHeaderLeaveTransform,
              },
          staticClass: 'parallax-page-header',

          scopedSlots: /md|lg|xl/.test(br.is)
            ? {
                default: () => {
                  return pageInfo()
                },
              }
            : {
                default: () => {
                  return div({
                    attrs: { ...scoping, 'aria-hidden': 'true' },
                    staticClass: 'pseudo img-pseudo',
                    class: [
                      {
                        hidden: this.pageInfoIntersectionRatio > 0,
                      },
                    ],
                    style: { ...imgColors },
                  })
                },
              },
        }),

        [mobileDevice && pageInfo()],

        div(
          {
            attrs: { ...scoping },
            staticClass: 'body theme-surface fill-before',
          },
          [
            this.$scopedSlots.default?.(),
            footer({
              class: [
                {
                  hidden: this.hideFooter,
                },
              ],
            }),
          ]
        ),
      ]
    )
  },
}
</script>

<style>
.root[data-ppe] {
  position: relative;
  height: var(--window-height);
  max-height: var(--window-height);
  overflow: hidden auto;
  --scrollbar-size: 1px;
  padding-bottom: var(--header-height);
}

.parallax-page-header {
  width: 100% !important;
  max-width: 1500px;
  margin: 0 auto;
  background: var(--background);
  top: 0;
  left: 0;
  height: var(--img-height) !important;
}

.sm-down .parallax-page-header {
  position: fixed !important;
}

.parallax-page-header .__content[data-aig] {
  object-fit: cover;
  right: 0%;
  left: auto;
}

.__will-change[data-ppe] .parallax-page-header .__content[data-aig] {
  will-change: transform;
}

.parallax-page-header .__content[data-aig] {
  transform: var(--transform);
  /* transition: 0.05s linear transform; */
  transform-origin: top;
}

.img-pseudo[data-ppe],
.sm-down .page-info[data-ppe].has-gradient {
  background: linear-gradient(
    to bottom,
    var(--linear-1) 50%,
    var(--linear-2),
    var(--linear-3),
    var(--linear-4),
    var(--background)
  );
}

.sm-down .img-pseudo[data-ppe] {
  z-index: 10;
}

.page-info[data-ppe] {
  display: grid;
  align-content: flex-end;
  padding: var(--qtr-offset);
  isolation: isolate;
}

.sm-down .page-info[data-ppe] {
  height: var(--img-height);
  z-index: 1;
  position: relative;
}

.sm-down .page-info[data-ppe]::before {
  background: var(--background);
  opacity: var(--opacity);
  z-index: -1;
  transition: 0.15s opacity linear;
  opacity: 0;
}

.page-info[data-ppe].__fill::before {
  opacity: 1;
  transition: 0.45s opacity linear;
}

.__will-change[data-ppe] .page-info[data-ppe]::before {
  will-change: opacity;
}

.md-up .page-info[data-ppe] {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.body[data-ppe] {
  z-index: 1;
  position: relative;
}
</style>
