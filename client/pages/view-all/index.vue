<script>
import viewAllComputed from '~/components/view-all/computed'
import {
  capitalize,
  computedBR,
  extractQueryVariables,
  getObjectPath,
  getViewAllTo,
  loadingPage,
  minutes,
  mountComplexPage,
  promiser,
  scrollWindow,
  sortBy,
  sortRecipes,
} from '~/components/utils/main'
export default {
  name: 'ViewAllId',
  scrollToTop: true,
  data: () => ({
    selfName: 'ViewAllId',
    renderedComponents: ['MediumCard'],

    loading: false,

    pageLimit: 10,

    pageChanged: 0,

    selectedSortValue: '',

    selectedFilters: [],

    fetching: false,
  }),
  head() {
    return {
      title: `${this.formatQuery.title} `,
    }
  },
  computed: {
    ...mountComplexPage.computed,
    ...computedBR,

    ...viewAllComputed,

    pageIndex() {
      return parseFloat(this.$route.query.page || 1)
    },

    items() {
      const sort = ({ array, sortBy }) => {
        return sortRecipes({ array, sortBy })
      }

      if (this.formatQuery.showingFor == 'recipe' && this.formatQuery.fetched) {
        let path = getObjectPath({
          obj: this.$store.state,
          path: this.formatQuery.path,
        })

        if (!Array.isArray(path)) {
          path = []
        }

        return sort({
          array: (path || []).map((x) => {
            const { title, saves, area, id } =
              this.$store.state.recipes?.[x] || {}

            return {
              title,
              saves,
              area,
              id: id || x,
            }
          }),
          sortBy: this.selectedSortPath.value,
        }).map((x) => x.id)
      }

      if (
        /area|trending|categories|collection/.test(
          this.formatQuery.showingFor
        ) &&
        this.formatQuery.fetched
      ) {
        let path = getObjectPath({
          obj: this.$store.state,
          path: this.formatQuery.path,
        })

        if (!Array.isArray(path)) {
          path = []
        }

        return sort({
          array: (path || []).map((x) => {
            const { title, img } = x

            return {
              title,
              img,
            }
          }),
          sortBy: this.selectedSortPath.value,
        })
      }

      return []
    },
    getItems() {
      return this.items.filter(
        (_, i) =>
          i < this.pageIndex * this.pageLimit &&
          i >= (this.pageIndex - 1) * this.pageLimit
      )
    },
    pageLength() {
      return Math.ceil((this.items.length || 0) / this.pageLimit || 0)
    },

    showingFor() {
      return this.$route.query.for
    },

    sortBy() {
      const value = [...sortBy()]

      const showingFor = this.showingFor

      if (showingFor == 'recipe') {
        return value
      }

      return [
        {
          title: 'Title: A-Z',
          value: 'titledesc',
        },
        {
          title: 'Title: Z-A',
          value: 'titleasc',
        },
      ]
    },

    selectedSortPath() {
      return this.sortBy.find((x) => x.value == this.getSelectedSortValue) || {}
    },
    selectedSort() {
      return this.selectedSortPath.title
    },

    getSelectedSortValue() {
      return this.selectedSortValue
    },

    showingInfo() {
      const items = this.getItems || []

      const from = this.items.indexOf(items[0])
      const to = this.items.indexOf(items[items.length - 1]) + 1

      return `Showing ${from || 1} to ${to} of ${this.items.length} item${
        items.length > 1 ? 's' : ''
      }`
    },
  },
  watch: {
    ...mountComplexPage.watch,

    async pageIndex() {
      this.pageChanged++

      scrollWindow.call(this, false)

      await this.$sleep()

      //   this.fetchGroup()
    },

    items() {
      this.fetchRecipeGroup()
    },
    '$store.state.idb'(n) {
      if (n.uid) {
        this.fetchRouteRequest()
        this.fetchRecipeGroup()
      }
    },
    '$store.state.exploreBuilt'(n) {
      if (n && !this.formatQuery.fetched) {
        console.log(4949)
        this.fetchRouteRequest()
      }
    },
  },
  beforeCreate() {
    this.$commit('UPDATE_', {
      path: 'header',
      value: {
        text: capitalize(
          extractQueryVariables(
            this.$route.query['v-t'],
            this.$route.query['v-cst']
          )
        ).replace(/\s+collections$/, ' collection'),
        showOnMobile: true,
      },
    })
  },
  created() {
    this.pageLimit = this.formatQuery.pageLimit

    this.fetchRouteRequest()

    this.fetchRecipeGroup()
  },
  beforeMount() {
    scrollWindow.call(this, false)
    this.selectedSortValue = this.$route.query.sort || ''
  },
  mounted() {
    mountComplexPage.mounted.call(this)
  },
  methods: {
    ...mountComplexPage.methods,

    async fetchRouteRequest() {
      if (this.formatQuery.fetched === false) {
        const fetch = async () => {
          const rpc = this.formatQuery.rpc

          if (!rpc[0]) {
            return promiser()
          }
          try {
            const { data, error } = await this?.[rpc[0]]?.(rpc[1])

            if (error) {
              return promiser((this.fetching = 'error'))
            }
            return promiser(data)
          } catch (e) {
            if (e) {
              console.error(e)
            }
          }
        }

        await fetch()
      }
    },

    async fetchRecipeGroup() {
      if (this.fetching || !this.formatQuery.fetched) {
        return promiser([])
      }

      await this.$nextTick()

      if (!this.items.length) {
        return promiser()
      }

      this.fetching = true

      const now = Date.now()

      const path = (this.formatQuery.lowerTitle || '').replace(/\s+/g, '-')

      const saved = this.$store.state.fetchTimeStamps[path] || 0

      if (now - minutes(30) > saved && this.$store.state.idb.uid) {
        const { data } = await this.$fetchGroup({
          array: this.items,
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
    console.log(this.formatQuery)
    const scoping = { 'data-p-v-ix': '' }
    const div = (d, c) => h('div', d, c)
    const h2 = (d, c) => h('h2', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)
    const select = (d, c) => h('ui-select', d, c)

    if (!this.items.length) {
      return div(
        {
          attrs: { ...scoping, title: 'loading' },
          staticClass: 'loading-root',
        },
        [
          div({
            attrs: { ...scoping },
            staticClass: 'spinner page',
          }),

          h2(
            {
              attrs: { ...scoping },
              staticClass: 'loading-title',
            },
            'LOADING ITEMS...'
          ),
        ]
      )
    }

    console.log(this.formatQuery)

    const br = this.breakpoints

    const xxs = /xxs/.test(br.is)
    const xs = /xs/.test(br.is)
    const sm = /sm/.test(br.is)
    const md = /md/.test(br.is)
    const lg = /lg/.test(br.is)
    const xl = /xl/.test(br.is)

    const mobileDevice = xxs || xs || sm
    const mediumCard = (d) => h('mediumCard', d)

    const cardHeight =
      xxs || xs
        ? '148px'
        : sm
        ? '172px'
        : md
        ? '212px'
        : lg
        ? '224px'
        : xl
        ? '232px'
        : '148px'

    return div(
      {
        // key: this.formatQuery.title,
        attrs: { ...scoping },
        staticClass: 'root',
        class: [
          {
            'fade-slide-y-appear': !!this.pageChanged,
            'theme-primary': this.$theme.light,
          },
        ],
      },
      [
        mobileDevice
          ? null
          : h2(
              {
                attrs: { ...scoping },
                staticClass: 'title fill-before divide-before',
              },
              this.formatQuery.title
            ),

        div(
          {
            attrs: { ...scoping },
            staticClass: 'banner fill-before divide-before',
          },
          [
            {
              title: `sort ${this.formatQuery.lowerTitle}`,
              icon: 'sort',
              text: this.selectedSort || 'Sort by',
              vmodel: this.selectedSortValue,
            },
          ].map((item, key) => {
            return btn(
              {
                key: key + 'banner-item',
                props: {
                  background: 'transparent',
                  tag: 'form',
                },
                attrs: { tabindex: '-1' },
                staticClass: 'select-wrap',
              },
              [
                icon({
                  attrs: {
                    name: item.icon,
                    ...scoping,
                  },
                }),

                item.text,

                select({
                  ref: 'select',
                  props: {
                    multiple: key > 0,
                    items: key == 0 ? this.sortBy : this.filters,
                    title: 'sort by',
                    vmodel: item.vmodel,
                  },
                  on:
                    key == 0
                      ? {
                          vmodel: (e) => {
                            this.$router.replace({
                              query: {
                                ...this.$route.query,
                                page: 1,
                                sort: this.selectedSortValue || 'default',
                              },
                            })

                            this.selectedSortValue = e

                            scrollWindow.call(this)
                          },
                        }
                      : undefined,
                }),
              ]
            )
          })
        ),

        div(
          {
            attrs: { ...scoping },
            staticClass: 'desc',
          },
          [
            {
              title: 'total items',
              text: `${(this.items || []).length} item${
                this.items?.length > 1 ? 's' : ''
              } found`,
            },
            {
              title: 'page index',
              text: `page ${this.pageIndex} of ${this.pageLength}`,
            },
          ].map((item, key) => {
            return h(
              'p',
              {
                key: key + 'desc',
                attrs: { ...scoping, title: item.title },
                staticClass: 'desc-item',
              },
              item.text
            )
          })
        ),

        div(
          {
            attrs: { ...scoping },
            staticClass: 'items-wrap',
            class: [
              {
                'fade-appear': !!this.pageChanged,
              },
            ],
            style: {
              '--card-height': cardHeight,
            },
          },
          [
            this.getItems.map((item, key) => {
              return mediumCard({
                key: key + 'card',
                props: {
                  item,
                  type: '2',
                  height: cardHeight,
                  to: this.formatQuery.isRecipe
                    ? `/recipe/${item}`
                    : getViewAllTo.call(this, {
                        variable: `$c$:${
                          this.formatQuery.lowerTitle || ''
                        },$x$:explore,$f$:${
                          this.formatQuery.innerGet || ''
                        },$a$:${this.formatQuery.showingFor},$l$:16,$dt$:${(
                          item.title || ''
                        ).toLowerCase()}`,
                        title: '$dt$ $c$',
                        showingFor: 'recipe',
                        fetched: ':c',
                        path: `$x$Sections.$c$.${(
                          item.title || ''
                        ).toLowerCase()}`,
                        get: `$f$ {$a$:${
                          this.formatQuery.lowerTitle == 'collections'
                            ? item.title || ''
                            : (item.title || '').toLowerCase()
                        }}`,
                        limit: '$l$',
                      }),
                  outline: {
                    outlined: true,
                    outlinedStroke: '1px',
                    outlinedOpacity: '.15',
                  },
                },
              })
            }),
          ]
        ),

        h(
          'p',
          {
            attrs: { ...scoping },
            staticClass: 'items-shown',
          },
          [this.showingInfo]
        ),

        this.pageLength > 1
          ? div(
              {
                attrs: { ...scoping },
                staticClass: 'pagination-wrap',
              },
              [
                h('uiPagination', {
                  props: {
                    vmodel: parseFloat(this.$route.query.page || 1),
                    length: this.pageLength,
                  },
                  on: {
                    vmodel: async (e) => {
                      this.$router.push({
                        query: {
                          ...this.$router.query,
                          page: e,
                        },
                      })

                      await this.$nextAnimFrame()
                      scrollWindow.call(this, false)
                    },
                  },
                }),
              ]
            )
          : null,

        loadingPage.call(this, h),
      ]
    )
  },
}
</script>

<style>
.loading-root[data-p-v-ix] {
  position: absolute;
  width: 100%;
  height: calc(100vh - var(--nav-height));
  display: grid;
  align-content: center;
  justify-items: center;
  row-gap: var(--half-offset);
  z-index: 10;
  background: var(--theme-surface);
}

.md-up .loading-root[data-p-v-ix] {
  height: calc(100vh - var(--header-height));
  bottom: 0;
}

.loading-title[data-p-v-ix] {
  color: var(--primary);
  font-size: 1rem;
  font-weight: 400;
}

.root[data-p-v-ix] {
  padding-bottom: var(--divide-offset);
  --appear-duration: 250ms;
  min-height: calc(100vh - var(--nav-height));
}

.sm-down .root[data-p-v-ix] {
  padding-top: var(--header-height);
}

.title[data-p-v-ix] {
  font-size: 2.25rem;
  text-align: center;
  line-height: 1.5rem;
  padding: var(--divide-offset) var(--half-offset);
  position: relative;
}

.banner[data-p-v-ix] {
  height: auto;
  display: flex;
  justify-content: center;
  padding: 0.25rem var(--half-offset);
  position: relative;
}

.title[data-p-v-ix]::before,
.banner[data-p-v-ix]::before {
  opacity: var(--t-subtitle);
}

.banner[data-p-v-ix] > .ui-btn {
  column-gap: 0.35rem;
}

.desc[data-p-v-ix] {
  display: flex;
  justify-content: space-between;
  margin: var(--qtr-offset) 0;
  padding: 0 var(--half-offset);
}

.desc-item[data-p-v-ix] {
  font-size: 0.95rem;
  color: var(--body-c);
}

.desc-item[data-p-v-ix]:last-of-type {
  color: var(--subtitle-c);
  font-style: italic;
  font-size: 0.9rem;
}

.items-wrap[data-p-v-ix] {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(var(--view-port) - var(--half-offset)), 1fr)
  );
  gap: var(--qtr-offset);
  padding: var(--half-offset);
  max-width: 1500px;
  margin: 0 auto;
  margin-bottom: var(--half-offset);
}

.xs-down .items-wrap[data-p-v-ix] {
  --view-port: 50%;
}

.br-sm .items-wrap[data-p-v-ix] {
  --view-port: 33%;
}

.md-up .items-wrap[data-p-v-ix] {
  --view-port: 25%;
}

.items-wrap[data-p-v-ix] .title[data-mcd] {
  font-size: 0.9rem;
  color: var(--body-c);
  font-weight: 400;
  padding: 0.25rem 0 0.5rem;
}

.sm-up .items-wrap[data-p-v-ix] .title[data-mcd] {
  text-align: center;
}

.items-shown[data-p-v-ix] {
  text-align: center;
  font-weight: 500;
  font-size: min(0.875rem, 15px);
  color: var(--subtitle-c);
  margin: var(--half-offset) 0.5rem 1.5rem;
}

.light-theme .root[data-p-v-ix] .ui-btn[data-uipn]:not(.primary) {
  background: var(--theme-banner) !important;
  box-shadow: var(--raise-light);
}
</style>
