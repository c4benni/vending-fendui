<script>
import { getViewAllTo, mountComplexComponent } from '../utils/main'
export default {
  name: 'AreaSection',
  data: () => ({
    selfName: 'AreaSection',
    renderedComponents: ['AppImg'],
  }),
  computed: {
    ...mountComplexComponent.computed,

    allItems() {
      return this.$store.state.explore.area || []
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

    const scoping = { 'data-e-asn': '' }
    const appSection = (d, c) => h('appSection', d, c)
    const div = (d, c) => h('div', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const card = (d) => h('mediumCard', d)

    return appSection(
      {
        attrs: {
          title: 'Cuisines',
          description: `Check out these recipes we found from different part of the world.`,
        },
        staticClass: 'e-asn',
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
                  type: '2',
                  to: {
                    variable: `$c$:cuisines,$x$:explore,$f$:f_cs,$a$:area,$l$:16`,
                    title: '$c$',
                    showingFor: 'recipe',
                    fetched: ':c',
                    path: `$x$Sections.$c$.${(item.title || '').toLowerCase()}`,
                    get: `$f$ {$a$:${(item.title || '').toLowerCase()}}`,
                    limit: '$l$',
                  },
                },
                staticClass: 'e-asn-card',
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
                variable: `$l$:16,$n$:area,$t$:cuisines,$f$:f_ce,$m$:min,$ld$:expanded,$x$:explore`,
                title: '$t$',
                showingFor: '$n$',
                fetched: ':c',
                get: '$f$ {$m$:2}',
                path: '$x$:$n$',
                test: `$x$:$ld$:$n$`,
                limit: '$l$',
                innerGet: 'f_cs',
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
.can-hover .e-asn:hover .view-all:not(.Active):not(:hover):not(:focus)::before {
  opacity: 0.1;
}

.snap-x-grid[data-e-asn] {
  --item-width: calc(min(85%, 420px) - 1.5rem);
  grid-template-columns: repeat(var(--length), var(--item-width)) var(
      --half-offset
    );
}

.e-asn-card {
  scroll-snap-align: start;
  scroll-margin-left: var(--half-offset);
  scroll-snap-margin-left: var(--half-offset);
}

.br-xl .snap-x-grid[data-e-asn] {
  justify-content: center;
}
</style>
