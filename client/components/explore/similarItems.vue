<script>
import {
  computedBR,
  getViewAllTo,
  minutes,
  mountComplexComponent,
  promiser,
} from '../utils/main'
export default {
  name: 'SimilarItems',
  props: {
    item: {
      type: String,
      default: undefined,
    },
    type: {
      type: String,
      default: '2',
    },
    height: {
      type: String,
      default: '180px',
    },
  },
  data: () => ({
    selfName: 'SimilarItems',
    renderedComponents: ['MediumCard'],
    fetching: false,
  }),
  computed: {
    ...computedBR,
    ...mountComplexComponent.computed,

    allItems() {
      return this.$store.state.recipes?.[this.item]?.similar_items || []
    },

    items() {
      return this.allItems.filter((_, i) => i < 10)
    },
  },
  watch: {
    ...mountComplexComponent.watch,
    allItems() {
      this.fetchGroup()
    },
    '$store.state.idb'(n) {
      if (n.uid) {
        this.fetchGroup()
      }
    },
  },
  created() {
    this.fetchGroup()
  },
  mounted() {
    mountComplexComponent.mounted.call(this)
  },
  methods: {
    ...mountComplexComponent.methods,

    async fetchGroup() {
      if (this.fetching) {
        return promiser([])
      }
      await this.$nextTick()

      if (!this.allItems.length) {
        return
      }

      this.fetching = true

      const now = Date.now()

      const path = `similar_items_${this.item}`

      const saved = this.$store.state.fetchTimeStamps?.[path] || 0

      if (now - minutes(30) > saved && this.$store.state.idb.uid) {
        const { data } = await this.$fetchGroup({
          array: this.allItems,
          fn: 'f_d',
          save: () => ({
            timeStamp: now,
          }),
        })

        if (data) {
          const value = {
            ...this.$store.state.fetchTimeStamps,
          }

          value[path] = now
          this.$commit('UPDATE_', {
            path: 'fetchTimeStamps',
            value,
          })
        }
      }

      this.fetching = false
    },
  },
  render(h) {
    if (!this.allItems.length) {
      return []
    }

    const scoping = { 'data-e-sis': '' }
    const appSection = (d, c) => h('appSection', d, c)
    const div = (d, c) => h('div', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const card = (d) => h('mediumCard', d)

    if (!this.items?.length) {
      return null
    }

    const br = this.breakpoints

    return appSection(
      {
        attrs: {
          title: 'Similar recipes',
        },
        staticClass: 'e-sis',
      },
      [
        div(
          {
            attrs: { ...scoping },
            staticClass: 'snap-x-grid scroll-wrap hide-scrollbar',
            style: {
              '--length': this.items.length,
            },
            class: [
              {
                'centered-x-grid':
                  (/sm|md/.test(br.is) && this.items.length < 2) ||
                  (/md|lg/.test(br.is) && this.items.length < 5) ||
                  (/xl/.test(br.is) && this.items.length < 6),
              },
            ],
          },
          [
            this.items.map((item, key) => {
              return card({
                key,
                props: {
                  item,
                  type: this.type,
                  height: this.height,
                  to: `/recipe/${item}`,
                },
              })
            }),
          ]
        ),

        btn(
          {
            props: {
              text: true,
              color: 'primary',
              to: getViewAllTo.call(this, {
                variable: `$i$:${this.item},$n$:recipe,$s$:similar,$r$:id,$f$:f_sis`,
                title: '$s$ $n$s',
                showingFor: '$n$',
                fetched: ':c',
                get: '$f$ {$r$:$i$}',
                path: `$n$s.$i$.$s$_items`,
                limit: '16',
              }),
            },
            staticClass: 'view-all',
          },
          [
            'View all',
            icon({
              attrs: { name: 'chevronRight' },
            }),
          ]
        ),
      ]
    )
  },
}
</script>

<style>
.can-hover .e-sis:hover .view-all:not(.Active):not(:hover):not(:focus)::before {
  opacity: 0.1;
}

.scroll-wrap[data-e-sis] {
  scroll-snap-type: none;
  --item-width: calc(min(75%, 380px) - 1.5rem);
  grid-template-columns: repeat(var(--length), var(--item-width)) var(
      --half-offset
    );
  margin-top: var(--qtr-offset);
}
</style>
