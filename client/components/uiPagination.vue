<script>
import { computedBR, mountSingleComponent } from '../utils/main'
export default {
  name: 'UiPagination',
  props: {
    length: {
      type: Number,
      default: 15,
    },
    vmodel: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    selfName: 'UiPagination',
  }),
  computed: {
    ...mountSingleComponent.computed,
    ...computedBR,

    items() {
      const breakpoints = this.breakpoints
      const xxs = /xxs/.test(breakpoints.is)
      const xs = /xs/.test(breakpoints.is)

      const length = this.length
      const vmodel = this.vmodel
      const el = '...'
      if (length <= (xxs ? 4 : xs ? 5 : 6)) {
        return Array.from({ length }, (_, i) => i + 1)
      }

      const breakpointsLimit = xxs ? 2 : xs ? 3 : 4
      const breakpointsAdd = xxs || xs ? 1 : 2
      // start
      if (vmodel <= breakpointsLimit) {
        return [1, 2, !xxs ? 3 : false, !xs ? 4 : false, el, length].filter(
          (x) => x !== false
        )
      }
      // center
      if (vmodel > breakpointsLimit && vmodel + breakpointsAdd < length) {
        return [
          1,
          el,
          !xxs && !xs ? vmodel - 1 : false,
          vmodel,
          el,
          length,
        ].filter((x) => x !== false)
      }
      // close to end;
      if (
        vmodel > breakpointsLimit &&
        vmodel + breakpointsAdd >= length &&
        vmodel < length
      ) {
        return [
          1,
          el,
          ...Array.from(
            { length: breakpointsLimit },
            (_, i) => length - i
          ).reverse(),
        ]
      }
      // end
      return [1, !xxs && 2, !xs && 3, el, length - 1, length].filter(
        (x) => x !== false
      )
    },
  },
  mounted() {
    mountSingleComponent.mounted.call(this)
  },
  render(h) {
    const scoping = { 'data-uipn': '' }
    const div = (d, c) => h('div', d, c)
    const nav = (d, c) => h('nav', d, c)
    const btn = (d, c) => h('uiBtn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const getTo = (dir) => {
      const route = this.$route

      let to = route.path

      const pageIndex = dir == 'left' ? this.vmodel - 1 : this.vmodel + 1

      Object.entries({
        ...route.query,
        page: pageIndex,
      }).forEach((item, key) => {
        to += `${key == 0 ? '?' : '&'}${item[0]}=${item[1]}`
      })

      to += route.hash || ''

      return to
    }

    return div(
      {
        attrs: {
          ...scoping,
          'aria-label': 'page navigation',
        },
        staticClass: 'root',
      },
      [
        btn(
          {
            key: 'left-pedal',
            attrs: {
              ...scoping,
              'aria-label': 'left pedal',
              title: this.vmodel == 1 ? '' : `jump to page ${this.vmodel - 1}`,
            },
            staticClass: 'pedal __left',
            props: {
              disabled: !this.vmodel || this.vmodel == 1,
              to: getTo('left'),
            },
            on: {
              '!click': () => {
                this.$emit('vmodel', this.vmodel - 1)
              },
            },
          },
          [
            icon({
              attrs: { ...scoping, size: '20', name: 'chevronLeft' },
            }),
          ]
        ),

        nav(
          {
            attrs: { ...scoping },
            staticClass: 'nav',
            style: {
              '--length': this.items.length,
            },
          },
          [
            this.items.map((item, key) => {
              const isLink = typeof item == 'number'
              const isActive = this.vmodel == item

              let to

              if (isLink) {
                const route = this.$route

                to = route.path

                Object.entries({
                  ...route.query,
                  page: item,
                }).forEach((item, key) => {
                  to += `${key == 0 ? '?' : '&'}${item[0]}=${item[1]}`
                })

                to += route.hash || ''
              }

              return btn(
                {
                  key: key + 'link' + isActive,
                  attrs: {
                    ...scoping,
                    'aria-label':
                      isLink && isActive
                        ? `current page, page ${this.vmodel}`
                        : undefined,
                    'aria-current': 'page',
                    title: `jump to page ${item}`,
                  },
                  staticClass: 'links',
                  class: [
                    {
                      'active primary fade-appear': isActive,
                    },
                  ],
                  props: {
                    to,
                    readonly: !isLink || isActive,
                  },
                },
                `${item}`
              )
            }),
          ]
        ),

        btn(
          {
            key: 'right-pedal',
            attrs: {
              ...scoping,
              'aria-label': 'right pedal',
              title:
                this.vmodel >= this.length
                  ? ''
                  : `jump to page ${this.vmodel + 1}`,
            },
            staticClass: 'pedal __right',
            props: {
              disabled: !this.vmodel || this.vmodel == this.length,
              to: getTo('right'),
            },
            on: {
              '!click': () => {
                this.$emit('vmodel', this.vmodel + 1)
              },
            },
          },
          [
            icon({
              attrs: { ...scoping, size: '20', name: 'chevronRight' },
            }),
          ]
        ),
      ]
    )
  },
}
</script>

<style>
.root[data-uipn] {
  --size: 42px;
  --size-offset: 6px;
  --icon-size: calc(var(--size) - var(--size-offset));
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
  column-gap: 0.75rem;
  justify-content: center;
}

.br-xxs .root[data-uipn] {
  --size: 34px;
  --size-offset: 4px;
  column-gap: 0.35rem;
}

.br-xxs .nav[data-uipn] {
  column-gap: 0.4rem;
}

.nav[data-uipn] {
  display: grid;
  column-gap: 0.5rem;
  grid-auto-flow: column;
}

.ui-btn.links[data-uipn] {
  min-width: var(--size) !important;
  width: var(--size) !important;
  min-height: var(--size) !important;
  height: var(--size) !important;
  font-size: 0.9rem;
}

.ui-btn.pedal[data-uipn] {
  min-width: var(--icon-size) !important;
  width: var(--icon-size) !important;
  min-height: var(--icon-size) !important;
  height: var(--icon-size) !important;
}
</style>
