<script>
import { mountSingleComponent } from '~/utils/main.js'
export default {
  name: 'AppImg',
  props: {
    gradient: Boolean,
    loading: Boolean,
    background: {
      type: String,
      default: 'var(--theme-primary)',
    },
    height: {
      type: [String, Number],
      default: undefined,
    },
    width: {
      type: [String, Number],
      default: undefined,
    },
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'div',
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    getColor: Boolean,
    config: {
      type: Object,
      default: () => {},
    },
    loadAnimation: {
      type: Boolean,
      default: true,
    },
    contentClass: {
      type: Array,
      default: () => [],
    },
    loadingType: {
      type: String,
      default: 'lazy',
    },
  },
  data() {
    return {
      loaded: null,
      selfName: 'AppImg',
      // imageLoaded: true,
      isIntersecting: false,
    }
  },
  computed: {
    ...mountSingleComponent.computed,
    worker() {
      return this.$store.state.worker
    },
    events() {
      const $events = {
        '!load': () => {
          this.loaded = true
          this.$emit('on-load')
        },
        '!error': () => {
          this.loaded = false
          this.$emit('on-error')
        },
      }
      // if (this.loaded === true) {
      //   delete $events.error
      // }
      // if (this.loaded === false) {
      //   delete $events.load
      // }
      return $events
    },
  },
  watch: {
    src() {
      this.isIntersecting = false
      this.loaded = null
    },
  },
  // created() {
  //   this.loaded = 'not-rendered'

  //   if (this.hasLoaded) {
  //     this.loaded = true
  //   }
  // },

  mounted() {
    mountSingleComponent.mounted.call(this)
  },

  render(h) {
    const returnValue = () => {
      const state = this.$store.state

      const getProp = (prop) => this[prop]

      const scoping = { 'data-aig': '' }
      const intersection = (d, c) => h('ui-intersection', d, c)

      const root = (d, c) => h(this.tag, d, c)
      const img = (d, c) =>
        (state.appLoaded && this.isIntersecting) || this.loadingType == 'eager'
          ? h('img', d, c)
          : h(
              'a',
              {
                attrs: {
                  ...scoping,
                  href: this.src,
                  target: '_blank',
                  rel: 'noopener',
                  role: 'img',
                  'aria-label': getProp('alt', 'title', ''),
                  title: 'click to view image',
                },
                staticClass: 'before-app-mounts-img fill-before-after',
              },
              [
                h('span', { attrs: { ...scoping }, staticClass: 'sr-only' }, [
                  getProp('alt', 'title', ''),
                ]),
              ]
            )
      const div = (d, c) => h('div', d, c)

      const icon = h(`ui-icon`, {
        attrs: { ...scoping },
        props: { name: 'logo', size: '25%' },
        staticClass: '__icon __content',
        class: [this.contentClass],
      })

      return root(
        {
          ref: '$el',
          key:
            'root-key-' +
            (this.alt + this.src) +
            this.loaded +
            this.$store.state.appLoaded,
          props: {
            ...this.componentProps,
          },
          attrs: {
            ...this.$attrs,
            role: 'img',
            'aria-label': this.alt || 'missing-alt',
            // title: this.alt || "missing-alt",
            ...scoping,
          },
          staticClass: 'root fill-before',
          class: [
            this.loaded !== true ? this.loadingBackground : '',
            {
              // 'no-img': !this.imageLoaded,
              'model-image':
                !this.gradient &&
                this.config?.display_type == 'model' &&
                this.loaded,

              'gradient-image': this.gradient,
              'fade-appear': this.loaded,
            },
          ],
          style: {
            '--width': getProp('width'),
            '--height': getProp('height'),
          },
          on: {
            ...this.$listeners,
          },
        },
        [
          [
            !this.isIntersecting && this.loadingType == 'lazy'
              ? intersection({
                  props: {
                    config: {
                      threshold: 0,
                    },
                    // once: true,
                  },
                  scopedSlots: {
                    default: (pay) => {
                      if (pay.entries?.boundingClientRect) {
                        if (pay.isIntersecting && this.$store.state.appLoaded) {
                          this.isIntersecting = true
                        }
                      }

                      return h('div', {
                        attrs: {
                          'aria-hidden': 'true',
                          ...scoping,
                        },
                        staticClass: 'pseudo root-obs',
                      })
                    },
                  },
                })
              : null,
          ],
          this.loaded !== false
            ? img({
                ref: '$img',
                key:
                  'img-key-' + getProp('alt', 'title') ||
                  'undefined' + this.src,
                attrs: {
                  ...scoping,
                  alt: getProp('alt', 'title', ''),
                  crossorigin: 'anonymous',
                  loading: this.loadingType,
                  src: this.src,
                  // decoding: 'async',
                },
                staticClass: '__content',
                // class: [{ 'no-load-anim': true }],
                class: [
                  {
                    // 'no-load-anim': !this.loadAnimation,
                    hidden: this.loaded !== true,
                  },
                  this.contentClass,
                ],
                // style: this.loaded !== true ? `opacity:0;` : undefined,
                on: {
                  ...(!this.loaded ? this.events : {}),
                },
              })
            : icon,
          this.$scopedSlots?.default?.(this.loaded),

          !this.loaded
            ? div({
                key: this.loaded,
                attrs: {
                  ...scoping,
                  title: 'loading image',
                  'aria-label': 'loading image, please wait',
                },
                style: {
                  background: this.background,
                },
                staticClass: 'loading-wrap',
              })
            : null,
        ]
      )
    }

    return returnValue()
  },
}
</script>

<style>
.root[data-aig] {
  overflow: hidden;
  position: relative;
  isolation: isolate;
  --defaultTransition: transform 0.15s ease;
  height: var(--height, initial);
  width: var(--width, initial);
  min-height: var(--height, initial);
  min-width: var(--width, initial);
  --appear-duration: 0ms;
}

.root[data-aig].model-image,
.root[data-aig].model-image img {
  background: #fff;
}

.before-app-mounts-img[data-aig] {
  height: inherit;
  width: inherit;
  display: grid;
  place-items: center;
  opacity: var(--t-caption);
  font-style: italic;
  font-size: 0.9em;
  padding: 0.75rem;
  position: relative;
}

.before-app-mounts-img[data-aig]::before {
  opacity: 0.025;
  background: currentColor;
}

.before-app-mounts-img[data-aig]::after {
  border: var(--ui-divide);
  opacity: var(--t-caption);
}

.root[data-aig].no-img {
  display: grid;
  place-items: center;
}

.root[data-aig].no-img .__content {
  opacity: var(--t-caption);
}

.root.gradient-image[data-aig] .__content[data-aig] {
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.1),
    rgb(0, 0, 0, 0.35)
  );
  background-color: #fff;
}

/* .root[data-aig]:not(.is-intersecting) {
  --defaultTransition: none;
} */

/* .root[data-aig]::before {
  opacity: 0;
  z-index: 10;
  display: block;
  transition-property: opacity, transform, display, filter;
  transition-duration: 0.3s;
}

.root[data-aig]:empty::before {
  opacity: 0.1;
  background: currentColor;
} */

/* .root[data-aig] > * {
  transition: var(--defaultTransition);
  border-radius: inherit;
} */

.root[data-aig] > img {
  height: 100%;
  min-height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
}

.loading-wrap[data-aig] {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--theme-primary);
  border-radius: inherit;
  --_size: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(1.25);
}

.dark-theme .loading-wrap[data-aig] {
  --t-disabled: 0.35;
}

.light-theme .loading-wrap[data-aig] {
  --t-disabled: 0.5;
}

.loading-item[data-aig],
.loading-wrap[data-aig]:after,
.loading-wrap[data-aig]:before {
  --_size: 1rem;
  border-radius: 50%;
  color: inherit;
  background: currentColor;
  filter: brightness(0.75);
  opacity: var(--t-disabled);
  border: var(--ui-divide);
}

.loading-wrap[data-aig]:after,
.loading-wrap[data-aig]:before {
  top: 50%;
  --transform-offset: calc(var(--_size) * 1.4);
}

.loading-wrap[data-aig]:before {
  left: 50%;
  transform: translate(calc(-50% - var(--transform-offset)), -50%);
}

.loading-wrap[data-aig]:after {
  right: 50%;
  left: auto;
  transform: translate(calc(50% + var(--transform-offset)), -50%);
}
</style>
