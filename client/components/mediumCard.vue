<script>
import { emptyRecipe, getViewAllTo, mountComplexComponent } from './utils/main'

export default {
  name: 'MediumCard',
  props: {
    item: {
      type: [String, Object],
      default: undefined,
    },
    height: {
      type: String,
      default: '',
    },
    type: {
      // 1 = gradient title inside, 2 = title below.
      type: String,
      default: '1',
    },
    to: {
      type: [String, Object],
      default: undefined,
    },
    outline: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    selfName: 'MediumCard',
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
    const scoping = { 'data-mcd': '' }

    const card1 = ({ item }) => {
      let getItem
      if (typeof item == 'string') {
        getItem = this.$store.state.recipes?.[item]
      } else {
        getItem = item
      }

      if (!getItem) {
        getItem = emptyRecipe
      }

      const to =
        typeof this.to == 'string'
          ? this.to || `/recipe/${item}`
          : typeof this.to == 'object'
          ? getViewAllTo.call(this, {
              ...this.to,
              title: `${getItem.title} ${this.to.title || ''}`,
            })
          : '/'

      const h3 = (d, c) => h('h3', d, c)
      const img = (d, c) => h('appImg', d, c)

      return img({
        attrs: { ...scoping, title: getItem.title, tabindex: '-1' },
        props: {
          ...getItem.img,
          height: this.height || '216px',
          tag: 'ui-btn',
          componentProps: {
            tag: 'nuxt-link',
            to,
            background: 'transparent',
            ...this.outline,
          },
        },
        staticClass: 'ui-card type-1',
        style: {
          '--background': `${getItem.img.background}`,
          '--color': `${getItem.img.color}`,
        },
        class: [
          {
            'light-color': getItem.img.color == '#fff',
            'dark-color': getItem.img.color == '#000',
          },
        ],
        scopedSlots: {
          default: () => {
            return h3(
              {
                attrs: { ...scoping },
                staticClass: 'title type-1',
                style: {
                  '--linear-1': `${getItem.img.background}`.replace(
                    /\)$/,
                    ',0)'
                  ),
                  '--linear-2': `${getItem.img.background}`.replace(
                    /\)$/,
                    ',0.9)'
                  ),
                },
              },
              [
                h(
                  'span',
                  {
                    attrs: { ...scoping },
                    staticClass: 'truncate-text',
                    class: [
                      {
                        'ui-skeleton sk-heading': getItem.loading,
                      },
                    ],
                    style: getItem.loading
                      ? {
                          '--sk-width': '45%',
                          'line-height': '1.5',
                        }
                      : undefined,
                  },
                  [getItem.title || '']
                ),
              ]
            )
          },
        },
      })
    }

    const card2 = ({ item, key }) => {
      let getItem = item

      if (typeof item == 'string') {
        getItem = this.$store.state.recipes?.[item]
      }

      if (!getItem) {
        getItem = emptyRecipe
      }

      const nuxtLink = (d, c) => h('nuxtLink', d, c)
      const h3 = (d, c) => h('h3', d, c)
      const img = (d, c) => h('appImg', d, c)

      return nuxtLink(
        {
          key,
          attrs: { ...scoping, title: getItem.title, tabindex: '-1' },
          props: {
            to:
              typeof this.to == 'string'
                ? this.to || `/recipe/${getItem.ref}`
                : typeof this.to == 'object'
                ? getViewAllTo.call(this, {
                    ...this.to,
                    title: `${getItem.title} ${this.to.title || ''}`,
                  })
                : '/',
          },
          staticClass: 'card root type-2',
        },
        [
          img({
            props: {
              ...getItem.img,
              height: this.height || '216px',
              tag: 'ui-btn',
              componentProps: {
                background: 'transparent',
                tag: 'div',
                ...this.outline,
              },
            },
            staticClass: 'ui-card',
            style: {
              '--background': `${getItem.img.background}`,
              '--color': `${getItem.img.color}`,
            },
          }),

          h3(
            {
              attrs: { ...scoping },
              staticClass: 'title truncate-text type-2',
              class: [
                {
                  'ui-skeleton sk-heading': getItem.loading,
                },
              ],
              style: getItem.loading
                ? {
                    '--sk-width': '45%',
                    'line-height': '1.5',
                  }
                : undefined,
            },
            [getItem.title || '']
          ),
        ]
      )
    }

    return this.type == '1'
      ? card1({
          item: this.item,
          key:
            typeof this.item == 'string'
              ? this.item
              : this.item?.id || this.item?.title,
        })
      : this.type == '2'
      ? card2({
          item: this.item,
          key:
            typeof this.item == 'string'
              ? this.item
              : this.item?.id || this.item?.title,
        })
      : null
  },
}
</script>

<style>
.root[data-mcd]:active .title[data-mcd],
.root[data-mcd].nuxt-link-exact-active .title[data-mcd] {
  text-decoration: underline;
  color: var(--disabled-c);
}

.root[data-mcd].type-1 {
  background: var(--background) !important;
}

.root[data-mcd] .root[data-aig] {
  width: 100%;
}

.root[data-mcd] .__content[data-aig] {
  object-fit: cover;
  transition: 0.15s transform;
  background: var(--background) !important;
}

.can-hover .root[data-mcd]:hover:not(.Active) .__content[data-aig] {
  transform: var(--img-scale);
}

.can-hover .root[data-mcd]:hover .title[data-mcd] {
  text-decoration: underline;
}

.can-hover .root[data-mcd]:focus-within .title[data-mcd],
.can-hover .root[data-mcd]:focus .title[data-mcd] {
  text-decoration: underline !important;
}

.title[data-mcd].type-1 {
  font-size: 1.075rem;
  font-weight: 500;
  transition: transform 0.2s;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40%;
  align-items: flex-end;
  padding: 0.5rem;
  background: linear-gradient(
    to bottom,
    var(--linear-1) 29%,
    var(--linear-2) 75%,
    var(--background)
  );
}

.info-wrap[data-mcd].dark-color .title[data-mcd].type-1 {
  color: var(--title-c-d);
}

.info-wrap[data-mcd].light-color .title[data-mcd].type-1 {
  color: var(--title-c-l);
}

.md-up .title[data-mcd].type-1 {
  text-align: center;
  padding: 0.5rem;
  font-size: 1.25rem;
}

.title[data-mcd].type-2 {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 0 0 0.5rem;
  transition: transform 0.2s;
  color: var(--body-c);
  cursor: pointer;
}

.md-up .title[data-mcd].type-2 {
  text-align: center;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  letter-spacing: 0.3px;
}
</style>
