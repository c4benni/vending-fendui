<script>
import { computedBR, mountComplexComponent } from '../utils/main'

export default {
  name: 'SavedItem',
  props: {
    item: {
      type: String,
      default: undefined,
    },
    selecting: Boolean,
    isSelected: Boolean,
  },
  data: () => ({
    selfName: 'SavedItem',
    renderedComponents: ['AppImg'],
    selected: {
      size: null,
      color: null,
      quantity: 1,
    },
  }),
  computed: {
    ...mountComplexComponent.computed,
    ...computedBR,

    getItem() {
      return this.$store.state.recipes?.[this.item] || {}
    },

    validItem() {
      return this.getItem
    },
  },
  watch: {
    ...mountComplexComponent.watch,
  },

  mounted() {
    mountComplexComponent.mounted.call(this)
  },
  methods: {
    ...mountComplexComponent.methods,
  },
  render(h) {
    const scoping = { 'data-s-sim': '' }
    const div = (d, c) => h('div', d, c)
    const a = (d, c) => h('nuxt-link', d, c)

    const h3 = (d, c) => h('h3', d, c)
    const icon = (d, c) => h('uiIcon', d, c)
    const img = (d, c) => h('appImg', d, c)

    const item = this.getItem

    const breakpoints = this.breakpoints

    const xxs = breakpoints.is == 'xxs'
    const xs = breakpoints.is == 'xs'
    const sm = breakpoints.is == 'sm'
    const md = breakpoints.is == 'md'
    const lg = breakpoints.is == 'lg'
    const xl = breakpoints.is == 'xl'

    return a(
      {
        key: item.id,
        props: {
          to: this.selecting ? this.$route.fullPath : `/recipe/${item.id}`,
          replace: this.selecting,
        },
        attrs: {
          ...scoping,
          title:
            (this.selecting
              ? this.isSelected
                ? 'unselect '
                : 'select '
              : '') + item.title?.toLowerCase?.(),
        },
        staticClass: 'root fill-before cursor-pointer',
        class: [
          {
            'fill-after is-selecting': this.selecting,
            selected: this.isSelected,
          },
        ],
        on: {
          ...this.$listeners,
        },
      },
      [
        div(
          {
            attrs: { ...scoping },
            staticClass: 'item-info',
          },
          [
            div(
              {
                attrs: { ...scoping },
                staticClass: 'info-header',
              },
              [
                h3(
                  {
                    attrs: { ...scoping },
                    staticClass: 'title',

                    class: [
                      {
                        'line-clamp-1': md || lg || xl || sm,
                        'line-clamp-2': xxs || xs,
                      },
                    ],
                  },
                  item.title
                ),
                h(
                  'h4',
                  {
                    attrs: { ...scoping },
                    staticClass: 'price',
                  },
                  [item.area]
                ),
              ]
            ),

            this.selecting
              ? icon({
                  attrs: {
                    ...scoping,
                    name: this.selecting
                      ? this.isSelected
                        ? 'checkboxChecked'
                        : 'blankCheckboxOutline'
                      : 'heart',
                    size: xxs ? 'sm' : !xl ? 'md' : 'lg',
                    clickable: true,
                    title:
                      (this.selecting ? 'select ' : 'remove ') + item.title,
                  },
                  staticClass: 'delete',
                  class: [
                    {
                      'saturated-primary white-text':
                        this.selecting && this.isSelected,
                    },
                  ],
                  // on: !this.selecting
                  //   ? {
                  //       '!click': () => {
                  //         this.$commit('SAVED_ITEMS', {
                  //           type: 'remove',
                  //           value: this.item,
                  //         })
                  //       },
                  //     }
                  //   : undefined,
                })
              : h('savedBtn', {
                  props: {
                    item: item.id,
                  },
                  staticClass: ',',
                }),
          ]
        ),

        [1].map(() => {
          const size = xxs
            ? '72'
            : xs
            ? '96'
            : sm
            ? '280'
            : md
            ? '320'
            : lg
            ? '360'
            : xl
            ? '400'
            : '72'

          return img({
            props: {
              src: item.img?.src || '',
              height: size + 'px',
              width: sm || md || lg || xl ? '100%' : size + 'px',
            },
            staticClass: 'image',
          })
        }),
      ]
    )
  },
}
</script>

<style>
/* MOBILE FIRST */

.root[data-s-sim] {
  --padding: 1.5rem;
  --half-padding: calc(var(--padding) / 2);
  display: grid;
  grid-auto-flow: column;
  padding: var(--half-padding) var(--padding);
  padding-right: max(var(--half-padding), 10px);
  position: relative;
  grid-template-columns: auto 1fr;
  column-gap: calc(var(--padding) / 1.5);
  isolation: isolate;
  max-width: 660px;
  margin: 0 auto;
  width: 100%;
}

.can-hover .root[data-s-sim]:hover .title[data-s-sim] {
  text-decoration: underline;
}

.root[data-s-sim].is-selecting {
  cursor: pointer;
}

.root[data-s-sim]::after {
  background: #000;
  opacity: 0.3;
  animation: fade-appear 0.15s ease;
  --appear-to: 0.3;
  transition: 0.15s opacity;
}

.root[data-s-sim].selected::after {
  opacity: 0.6;
  --appear-to: 0.6;
}

.root[data-s-sim]:not(:last-of-type)::before {
  border-bottom: var(--ui-divide);
  left: var(--padding);
}

.br-xxs .root[data-s-sim] {
  --padding: 0.75rem;
}

.root[data-s-sim] .image {
  grid-column-start: 1;
  grid-column-end: 2;
  border-radius: var(--rounded-lg);
}

.sm-up .root[data-s-sim] .image {
  border-radius: 0;
}

.sm-up .root[data-s-sim] .__content[data-aig] {
  padding-bottom: 4px;
  /* object-fit: cover; */
}

/* .sm-down .__content[data-aig] {
  filter: var(--ds-light);
} */

.item-info[data-s-sim] {
  display: grid;
}

.title[data-s-sim] {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5ch;
  padding-right: 30px;
  line-height: 1.4;
}

.price[data-s-sim] {
  font-size: 0.95rem;
  font-weight: 400;
  margin-bottom: 1ch;
}

.action[data-s-sim] {
  justify-self: flex-start;
  padding: 0 12px !important;
  background: var(--saturated-primary, var(--primary));
}

.sm-down .action[data-s-sim] {
  font-size: 0.8rem !important;
}

.br-xxs .action[data-s-sim] {
  --btn__size-sm: 24px;
  padding: 0 8px !important ;
}

.can-hover.dark-theme .action[data-s-sim]:hover,
.can-hover.dark-theme .action[data-s-sim]:focus,
.action[data-s-sim].Active {
  background: var(--primary);
}

.delete[data-s-sim],
.root[data-s-sim] .root[data-sbn] {
  position: absolute;
  top: max(var(--half-padding), 6px);
  right: max(var(--half-padding), 6px);
  z-index: 2;
}

.delete[data-s-sim]:not(.saturated-primary) {
  color: var(--caption-c);
}

.root[data-s-sim] .root[data-sbn] {
  color: var(--tertiary);
}

.root[data-s-sim] .root[data-sbn]::before {
  background: none !important;
}

.root[data-s-sim].is-selecting .delete[data-s-sim],
.root[data-s-sim].is-selecting .root[data-sbn] {
  opacity: 1;
  stroke-width: 4px;
}

/* LARGE DEVICE */
.sm-up .root[data-s-sim] {
  grid-template-columns: 1fr;
  padding: 0;
  --padding: 2rem;
  padding-top: 1.75rem;
}

.sm-up .root[data-s-sim] .image {
  grid-row-start: 2;
  grid-row-end: 3;
  justify-self: center;
}

.sm-up .root[data-s-sim]:nth-child(odd):before {
  left: 0.5rem;
  width: calc(100% - 0.5rem);
  border-bottom: var(--ui-divide);
  border-right: var(--ui-divide);
}

.sm-up .root[data-s-sim]:nth-child(odd):last-of-type::before {
  display: none;
}

.sm-up .root[data-s-sim]:nth-child(even):before {
  border-bottom: var(--ui-divide);
  left: auto;
  right: 0.5rem;
  width: calc(100% - 0.5rem);
}

.sm-up .info-header[data-s-sim] {
  display: grid;
  row-gap: 0.5rem;
  padding-left: var(--half-padding);
  padding-right: var(--half-padding);
}

.sm-up .title[data-s-sim] {
  justify-self: center;
}

.br-sm .title[data-s-sim] {
  font-size: 1.35rem;
  margin-bottom: 4px;
}

.md-up .title[data-s-sim] {
  font-size: 1.5rem;
}

.br-xl .title[data-s-sim] {
  font-size: 1.75rem;
}

.sm-up .price[data-s-sim] {
  justify-self: center;
}

.br-sm .price[data-s-sim] {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.md-up .price[data-s-sim] {
  font-size: 1.15rem;
  margin-bottom: 1rem;
}

.br-xl .price[data-s-sim] {
  font-size: 1.25rem;
}

.sm-up .action[data-s-sim] {
  justify-self: center;
  padding: 0 30px !important;
  margin-bottom: 2rem;
}
</style>
