<script>
import { getViewAllTo, mountComplexComponent } from '../utils/main'
export default {
  name: 'Collections',
  data: () => ({
    selfName: 'Collections',
    renderedComponents: ['MediumCard'],
  }),
  computed: {
    ...mountComplexComponent.computed,

    allItems() {
      return this.$store.state.explore.collections || []
    },

    items() {
      return this.allItems.filter((_, i) => i < 5)
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
    if (!this.allItems.length) {
      return null
    }

    const scoping = { 'data-e-cs': '' }
    const appSection = (d, c) => h('appSection', d, c)
    const div = (d, c) => h('div', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const card = (d) => h('mediumCard', d)

    return appSection(
      {
        attrs: {
          title: 'Collections',
          description: `Check out the different varieties of collections we picked for you.`,
        },
        staticClass: 'e-cs',
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
                props: {
                  item,
                  to: {
                    variable: `$c$:collection,$x$:explore,$f$:f_cns,$l$:16`,
                    title: '$c$',
                    showingFor: 'recipe',
                    fetched: ':c',
                    path: `$x$Sections.$c$s.${(
                      item.title || ''
                    ).toLowerCase()}`,
                    get: `$f$ {$c$:${item.title || ''}}`,
                    limit: '$l$',
                  },
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
                variable: `$l$:20,$t$:collection,$f$:f_bee`,
                title: '$t$s',
                showingFor: '$t$',
                fetched: ':c',
                get: '$f${',
                path: `explore.$t$s`,
                limit: '$l$',
                innerGet: 'f_cns',
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
.can-hover .e-cs:hover .view-all:not(.Active):not(:hover):not(:focus)::before {
  opacity: 0.1;
}

.snap-x-grid[data-e-cs] {
  --item-width: calc(min(85%, 420px) - 1.5rem);
  grid-template-columns: repeat(var(--length), var(--item-width)) var(
      --half-offset
    );
}

.snap-x-grid[data-e-cs] > .root[data-mcd] {
  scroll-snap-align: start;
  scroll-margin-left: var(--half-offset);
  scroll-snap-margin-left: var(--half-offset);
}

.br-xl .snap-x-grid[data-e-cs] {
  justify-content: center;
}
</style>
