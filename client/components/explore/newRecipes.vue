<script>
import {
  getViewAllTo,
  minutes,
  mountComplexComponent,
  promiser,
} from '../utils/main'
export default {
  name: 'NewRecipes',
  data: () => ({
    selfName: 'NewRecipes',
    renderedComponents: ['LargeCard'],
    fetching: false,
  }),
  computed: {
    ...mountComplexComponent.computed,

    allItems() {
      return this.$store.state.explore.new_in || []
    },

    items() {
      return this.allItems.filter((_, i) => i < 5)
    },
  },
  watch: {
    ...mountComplexComponent.watch,
    allItems(n) {
      n.length && this.fetchGroup()
    },
    '$store.state.idb.uid'(n) {
      if (n) {
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

      const now = Date.now()

      const saved = this.$store.state.fetchTimeStamps.newArrivals || 0

      if (now - minutes(30) > saved && this.$store.state.idb.uid) {
        this.fetching = true

        const { data } = await this.$fetchGroup({
          array: this.allItems,
          fn: 'f_t_i_a',
          save: () => ({
            timeStamp: now,
          }),
          replace: true,
        })

        if (data?.length) {
          this.$commit('UPDATE_', {
            path: 'fetchTimeStamps',
            value: {
              ...this.$store.state.fetchTimeStamps,
              newArrivals: now,
            },
          })
        }
      }

      this.fetching = false
    },
  },

  render(h) {
    if (!this.allItems.length) {
      return null
    }

    const scoping = { 'data-e-nrs': '' }
    const appSection = (d, c) => h('appSection', d, c)
    const div = (d, c) => h('div', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const card = (d) => h('largeCard', d)

    return appSection(
      {
        attrs: {
          title: 'New recipes',
          description: 'Discover the latest recipes we just added.',
        },
        staticClass: 'e-nrs',
      },
      [
        div(
          {
            attrs: { ...scoping },
            staticClass: 'snap-x-grid scroll-wrap hide-scrollbar',
            style: {
              '--length': this.items.length,
            },
          },
          [
            this.items.map((item, key) => {
              return card({
                key: key + 'card',
                props: { item },
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
                variable: `$l$:10,$n$:recipe,$t$:new,$r$:id,$f$:f_bee`,
                title: '$t$ $n$s',
                showingFor: '$n$',
                fetched: ':c',
                get: '$f${',
                path: `explore.$t$_in`,
                limit: '$l$',
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
.can-hover .e-nrs:hover .view-all:not(.Active):not(:hover):not(:focus)::before {
  opacity: 0.1;
}

.snap-x-grid[data-e-nrs] {
  grid-template-columns: repeat(var(--length), min(calc(100vw - 3rem), 450px)) var(
      --half-offset
    );
  -ms-scroll-snap-type: x mandatory;
  scroll-snap-type: x mandatory;
}

.snap-x-grid[data-e-nrs] > * {
  scroll-snap-align: start;
  scroll-margin-left: var(--half-offset);
  scroll-snap-margin-left: var(--half-offset);
}
</style>
