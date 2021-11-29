<script>
import {
  computedBR,
  minutes,
  mountComplexComponent,
  promiser,
} from '../utils/main'
export default {
  name: 'Saved',
  data: () => ({
    selfName: 'Saved',
    renderedComponents: ['LargeCard'],
    fetching: false,
  }),
  computed: {
    ...mountComplexComponent.computed,
    ...computedBR,

    allItems() {
      return this.$store.state.savedItems || []
    },

    items() {
      return this.allItems.filter((_, i) => i < 5)
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

      const saved = this.$store.state.fetchTimeStamps.savedItems || 0

      if (now - minutes(30) > saved && this.$store.state.idb.uid) {
        const { data: updateProfile } = await this.$updateProfile()

        if (updateProfile) {
          const { data } = await this.$fetchGroup({
            array: this.allItems,
            fn: 'f_d',
            save: () => ({
              timeStamp: now,
            }),
          })

          if (data) {
            this.$commit('UPDATE_', {
              path: 'fetchTimeStamps',
              value: {
                ...this.$store.state.fetchTimeStamps,
                savedItems: now,
              },
            })
          }
        }
      }

      this.fetching = false
    },
  },

  render(h) {
    if (!this.allItems.length) {
      return null
    }

    const scoping = { 'data-e-sd': '' }
    const appSection = (d, c) => h('appSection', d, c)
    const div = (d, c) => h('div', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const br = this.breakpoints

    const card = (d) => h('largeCard', d)

    return appSection(
      {
        attrs: {
          title: 'Your favourites',
          description: `We save your favoruite recipes for your reference any time!${
            this.$store.state.user ? '' : ' Sign in to sync this experience.'
          }`,
        },
        staticClass: 'e-sd',
      },
      [
        div(
          {
            attrs: { ...scoping },
            staticClass: 'snap-x-grid scroll-wrap hide-scrollbar',
            class: [
              {
                'centered-x-grid':
                  (/sm|md/.test(br.is) && this.items.length < 2) ||
                  (/md|lg/.test(br.is) && this.items.length < 3) ||
                  (/xl/.test(br.is) && this.items.length < 5),
              },
            ],
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
              to: '/saved',
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
.can-hover .e-sd:hover .view-all:not(.Active):not(:hover):not(:focus)::before {
  opacity: 0.1;
}

.snap-x-grid[data-e-sd] {
  grid-template-columns: repeat(var(--length), min(calc(100vw - 3rem), 450px)) var(
      --half-offset
    );
}

/* .br-xl .snap-x-grid[data-e-sd] {
  justify-content: center;
} */
</style>
