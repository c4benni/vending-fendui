<script>
import { emptyRecipe, mountComplexComponent } from './utils/main'
export default {
  name: 'LargeCard',
  props: {
    item: {
      type: String,
      default: undefined,
    },
    to: {
      type: String,
      default: undefined,
    },
  },
  data: () => ({
    selfName: 'LargeCard',
    renderedComponents: ['AppImg'],
  }),
  computed: { ...mountComplexComponent.computed },
  watch: { ...mountComplexComponent.watch },
  mounted() {
    mountComplexComponent.mounted.call(this)
  },
  methods: {
    ...mountComplexComponent.methods,
  },
  render(h) {
    const scoping = { 'data-lcd': '' }

    const card = ({ item }) => {
      let getItem = this.$store.state.recipes?.[item]

      if (!getItem) {
        getItem = emptyRecipe
      }

      const div = (d, c) => h('div', d, c)
      const btn = (d, c) => h('ui-btn', d, c)

      const h3 = (d, c) => h('h3', d, c)
      const h4 = (d, c) => h('h4', d, c)
      const h5 = (d, c) => h('h5', d, c)

      const img = (d, c) => h('appImg', d, c)

      const savedBtn = () => [
        div(
          {
            attrs: {
              ...scoping,
            },
            staticClass: 'saved-wrap',
          },
          [
            h('savedBtn', {
              props: {
                item,
                componentProps: { filledOpacity: 0, filledText: false },
              },
            }),

            [
              getItem.saves
                ? h5(
                    {
                      key: getItem.saves + 'likes',
                      attrs: { ...scoping, title: 'likes (3040)' },
                      staticClass: 'saved fade-appear',
                    },
                    getItem.saves
                  )
                : null,
            ],
          ]
        ),
      ]

      return btn(
        {
          key: getItem.id,
          attrs: { ...scoping, title: getItem.title },
          props: {
            tag: 'nuxt-link',
            to: this.to || `/recipe/${item}`,
            background: getItem.loading ? 'var(--theme-primary)' : 'none',
          },
          staticClass: 'ui-card root',
          style: {
            background: getItem.img.background,
          },
        },
        [
          img({
            props: {
              ...getItem.img,
              height: '364px',
            },
          }),

          div(
            {
              attrs: { ...scoping },
              staticClass: 'info-wrap fill-before',
              class: [
                {
                  'light-color': getItem.img.color == '#fff',
                  'dark-color': getItem.img.color == '#000',
                },
              ],
              style: {
                '--background': getItem.img.background,
                '--color': getItem.img.color,
              },
            },
            [
              h4(
                {
                  attrs: { ...scoping },
                  staticClass: 'subtitle',
                  class: [
                    {
                      'ui-skeleton sk-caption': getItem.loading,
                    },
                  ],
                  style: getItem.loading
                    ? {
                        '--sk-width': '25%',
                        'line-height': '1.5',
                      }
                    : undefined,
                },
                [
                  (getItem.area || 'Unknown').replace(
                    /^unknown$/i,
                    'Unknown area'
                  ),
                ]
              ),
              h3(
                {
                  attrs: { ...scoping },
                  staticClass: 'title truncate-text',
                  class: [
                    {
                      'ui-skeleton sk-heading': getItem.loading,
                    },
                  ],
                  style: getItem.loading
                    ? {
                        '--sk-width': '50%',
                        'line-height': '1.5',
                      }
                    : undefined,
                },
                [getItem.title || '']
              ),
              btn(
                {
                  attrs: { ...scoping },
                  props: {
                    readonly: true,
                    shape: 'pill',
                    size: 'sm',
                    text: true,
                    filledText: true,
                    fill: getItem.loading
                      ? 'var(--body-c)'
                      : getItem.img.background,
                    disabled: !getItem.loading,
                    color: getItem.loading ? 'transparent' : undefined,
                  },
                  staticClass: 'card-action',
                },
                'View recipe'
              ),
              [!getItem.loading && savedBtn()],
            ]
          ),
        ]
      )
    }

    return card({ item: this.item })
  },
}
</script>

<style>
.ui-card[data-lcd].ui-btn {
  width: 100%;
  justify-content: initial;
  transition: 0.15s transform !important;
}

.ui-card[data-lcd] .__content[data-aig] {
  object-fit: cover;
  transition: 0.15s transform;
}

.can-hover .ui-card[data-lcd]:hover:not(.Active) .__content[data-aig] {
  transform: var(--img-scale);
}

.can-hover .ui-card[data-lcd]:focus-within .title[data-lcd],
.can-hover .ui-card[data-lcd]:focus .title[data-lcd] {
  text-decoration: underline !important;
}

.can-hover .ui-card[data-lcd]:hover .title[data-lcd] {
  text-decoration: underline;
}

.info-wrap[data-lcd] {
  color: var(--color);
  background: var(--background);
  padding: var(--qtr-offset);
  padding-bottom: var(--half-offset);
  display: grid;
  justify-items: flex-start;
  position: relative;
  grid-template-columns: 1fr auto;
}

.info-wrap[data-lcd]::before {
  border-top: var(--ui-divide);
}

.subtitle[data-lcd] {
  font-weight: 400;
  font-size: 1rem;
  letter-spacing: 0.2px;
  grid-column-start: 1;
  grid-row-start: 1;
}

.info-wrap[data-lcd].light-color .subtitle[data-lcd] {
  color: var(--subtitle-c-l);
}

.info-wrap[data-lcd].dark-color .subtitle[data-lcd] {
  color: var(--subtitle-c-d);
}

.title[data-lcd] {
  font-weight: 500;
  font-size: 1.4rem;
  letter-spacing: 0.2px;
  line-height: 1.5;
  grid-column-start: 1;
  grid-row-start: 2;
}

.info-wrap[data-lcd].light-color .title[data-lcd] {
  color: var(--title-c-l);
}

.info-wrap[data-lcd].dark-color .title[data-lcd] {
  color: var(--title-c-d);
}

.card-action[data-lcd].ui-btn {
  margin-top: calc(var(--qtr-offset) / 2);
  background: rgb(0, 0, 0, 0.3) !important;
  grid-column-start: 1;
  grid-row-start: 3;
}

.ui-card[data-lcd] .root[data-sbn] {
  justify-self: center;
  margin-top: -6px;
}

.saved-wrap[data-lcd] {
  grid-column-start: 2;
  height: 100%;
  grid-row-start: 1;
  display: grid;
  grid-auto-flow: row;
  align-items: flex-start;
  grid-row-end: 3;
}

.saved[data-lcd] {
  justify-self: center;
  font-size: 0.75rem;
  margin-top: -12px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.info-wrap[data-lcd].dark-color .saved[data-lcd] {
  color: var(--caption-c-d);
}

.info-wrap[data-lcd].light-color .saved[data-lcd] {
  color: var(--caption-c-l);
}
</style>
