<script>
import { computedBR, getViewAllTo, mountComplexComponent } from '../utils/main'
export default {
  name: 'CategoriesSection',
  data: () => ({
    selfName: 'CategoriesSection',
    renderedComponents: ['MediumCard'],
  }),
  computed: {
    ...mountComplexComponent.computed,
    ...computedBR,

    allItems() {
      return this.$store.state.explore.categories || []
    },

    items() {
      return this.allItems.filter((_, i) => i < 6)
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
    const scoping = { 'data-e-csn': '' }
    const appSection = (d, c) => h('appSection', d, c)
    const div = (d, c) => h('div', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const breakpoints = this.breakpoints

    const miniDevice = /xxs|xs/.test(breakpoints.is)

    const card = (d) => h('mediumCard', d)

    return appSection(
      {
        attrs: {
          title: 'Categories',
          description: `We've grouped your favourite recipes just as you'd like them, check em out!`,
        },
        staticClass: 'e-csn',
      },
      [
        div(
          {
            attrs: { ...scoping },
            staticClass: 'scroll-wrap hide-scrollbar',
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
                  height: miniDevice ? '156px' : '250px',
                  type: '2',
                  to: {
                    variable: `$c$:category,$x$:explore,$f$:f_cis,$a$:categories,$l$:16`,
                    title: '$c$',
                    showingFor: 'recipe',
                    fetched: ':c',
                    path: `$x$Sections.$a$.${(item.title || '').toLowerCase()}`,
                    get: `$f$ {$a$:${(item.title || '').toLowerCase()}}`,
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
                variable: `$l$:16,$t$:categories,$f$:f_cy,$m$:min,$ld$:expanded,$x$:explore`,
                title: '$t$',
                showingFor: '$t$',
                fetched: ':c',
                get: '$f$ {$m$:2}',
                path: '$x$:$t$',
                test: `$x$:$ld$:$t$`,
                limit: '$l$',
                innerGet: 'f_cis',
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
.can-hover .e-csn:hover .view-all:not(.Active):not(:hover):not(:focus)::before {
  opacity: 0.1;
}

.scroll-wrap[data-e-csn] {
  display: grid;
  overflow-x: auto;
  overflow-y: hidden;
  overflow: auto hidden;
  grid-auto-flow: row;
  grid-template-columns: repeat(
    auto-fill,
    minmax(max(128px, calc(50% - 3rem)), 1fr)
  );
  isolation: isolate;
  -ms-scroll-snap-type: x mandatory;
  scroll-snap-type: x mandatory;
  gap: var(--qtr-offset);
  position: relative;
  padding: 0 calc(var(--divide-offset) / 2) 1rem;
  padding-bottom: 0;
}

.sm-up .e-csn .root[data-mcd].type-2 {
  scroll-snap-align: start;
  scroll-margin-left: var(--half-offset);
  scroll-snap-margin-left: var(--half-offset);
}

.br-xl .scroll-wrap[data-e-csn] {
  justify-content: center;
}

.e-csn .title[data-mcd].type-2 {
  font-size: 1rem;
  letter-spacing: 0.4px;
  text-transform: capitalize;
  font-weight: 600;
  padding: 0.25rem 0 0 0.5rem;
  transition: 0.2s transform;
  color: var(--subtitle-c);
  text-align: left;
  cursor: pointer;
}

.e-csn .root[data-mcd].type-2:active .title[data-mcd].type-2 {
  color: var(--title-c);
}

/* LARGE DEVICE */

.md-up .scroll-wrap[data-e-csn] {
  column-gap: 1rem;
  padding-top: 0;
}

.sm-up .scroll-wrap[data-e-csn] {
  grid-template-columns: repeat(var(--length), 250px) var(--qtr-offset);
}

.sm-up .scroll-wrap[data-e-csn]::after {
  content: '';
  width: 100%;
}

.md-up .e-csn .title[data-mcd].type-2 {
  font-size: 1.35rem;
  text-align: center;
  margin-top: 0.5rem;
  color: var(--body-c);
}
</style>
