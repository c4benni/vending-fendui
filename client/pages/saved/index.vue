<script>
import {
  distinctArray,
  minutes,
  mountComplexPage,
  scrollWindow,
  sortBy,
  sortRecipes,
} from '~/components/utils/main'
export default {
  name: 'SavedPage',
  data: () => ({
    selfName: 'SavedPage',
    renderedComponents: ['UiSelect', 'UiIntersection'],
    sortBy: [
      {
        title: 'Recently saved',
        value: 'datedesc',
      },
      {
        title: 'Earliest saved',
        value: 'dateasc',
      },
      ...sortBy(),
    ],

    selecting: false,

    selectedItems: [],

    isIntersecting: false,

    loading: false,

    pageLimit: 10,

    pageChanged: 0,
  }),

  head() {
    const savedItems = this.savedItems
    const length = savedItems.length
      ? ` (${savedItems.length} item${savedItems.length > 1 ? 's' : ''})`
      : ' (no saved item)'
    return {
      title: `Saved${length}`,
    }
  },

  computed: {
    ...mountComplexPage.computed,

    icons() {
      return {}
    },
    pageLength() {
      return Math.ceil((this.savedItems.length || 0) / this.pageLimit || 0)
    },
    breakpoints() {
      return this.$store.state.breakpoints
    },
    savedItems() {
      const sort = ({ array, sortBy }) => {
        const by = sortBy
        const arr = [...array]

        if (by == 'datedesc') {
          return arr.reverse()
        }

        if (by == 'dateasc') {
          return arr
        }

        return sortRecipes({ array, sortBy })
      }

      return sort({
        array: this.$store.state.savedItems.map((x) => {
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
    },

    pageIndex() {
      return parseFloat(this.$route.query.page || 1)
    },

    getSavedItems() {
      return this.savedItems.filter(
        (_, i) =>
          i < this.pageIndex * this.pageLimit &&
          i >= (this.pageIndex - 1) * this.pageLimit
      )
    },

    selectedSortPath() {
      return (
        this.sortBy.find((x) => x.value == this.$store.state.sortSaved) || {}
      )
    },
    selectedSort() {
      return this.selectedSortPath.title
    },
    showingInfo() {
      const items = this.getSavedItems || []

      const from = this.savedItems.indexOf(items[0])
      const to = this.savedItems.indexOf(items[items.length - 1]) + 1

      return `Showing ${from || 1} to ${to} of ${this.savedItems.length} item${
        items.length > 1 ? 's' : ''
      }`
    },
  },
  watch: {
    ...mountComplexPage.watch,
    savedItems(n) {
      if (n && n.length) {
        this.fetchGroup()
      } else {
        requestAnimationFrame(() => {
          this.showMobileHeader()
        })
      }
    },
    '$store.state.idb'(n) {
      if (n.uid) {
        this.fetchGroup()
      }
    },
    async pageIndex() {
      this.pageChanged++

      scrollWindow.call(this, false)

      await this.$sleep()

      this.fetchGroup()
    },
  },
  beforeCreate() {
    this.$commit('UPDATE_', {
      path: 'text',
      value: 'Saved items',
      innerPath: 'header',
    })
  },
  created() {
    this.fetchGroup()

    if (!this.savedItems.length) {
      this.showMobileHeader()
    }
  },

  mounted() {
    mountComplexPage.mounted.call(this)
  },
  methods: {
    ...mountComplexPage.methods,

    showMobileHeader() {
      this.$commit('UPDATE_', {
        path: 'showOnMobile',
        innerPath: 'header',
        value: true,
      })
    },

    async fetchGroup() {
      await this.$nextTick()

      if (!this.savedItems.length) {
        return
      }

      const now = Date.now()

      const saved = this.$store.state.fetchTimeStamps.saves || 0

      if (now - minutes(30) > saved && this.$store.state.idb.uid) {
        const { data } = await this.$fetchGroup({
          array: this.savedItems,
          fn: 'f_t_i_a',
          save: () => ({
            timeStamp: now,
          }),
          replace: true,
        })

        if (data) {
          this.$commit('UPDATE_', {
            path: 'fetchTimeStamps',
            value: {
              ...this.$store.state.fetchTimeStamps,
              saves: now,
            },
          })
        }
      }
    },
  },
  render(h) {
    const scoping = { 'data-p-s-ix': '' }
    const div = (d, c) => h('div', d, c)
    const h2 = (d, c) => h('h2', d, c)
    const intersection = (d, c) => h('ui-intersection', d, c)

    const btn = (d, c) => h('ui-btn', d, c)

    const breakpoints = this.breakpoints

    const xxs = breakpoints.is == 'xxs'

    const xs = breakpoints.is == 'xs'

    const mobileDevice = /xxs|xs|sm/.test(breakpoints.is)

    const showMobileHeader = this.$store.state.header.showOnMobile

    const savedItems = this.getSavedItems

    const emptyState = () => {
      if (savedItems.length) {
        return null
      }

      return div(
        {
          attrs: { ...scoping },
          staticClass: 'empty-root',
        },
        [
          h2(
            {
              attrs: { ...scoping },
              staticClass: 'empty-title',
            },
            'You have nothing saved!'
          ),
        ]
      )
    }

    const fullState = () => {
      if (!savedItems.length) {
        return null
      }

      const wbr = (d, c) => h('wbr', d, c)
      const icon = (d, c) => h('ui-icon', d, c)

      const select = (d) => h('uiSelect', d)

      const savedItem = (d) => h('savedItem', d)

      const uiPagination = (d) => h('uiPagination', d)

      const selectedLength = this.selectedItems.length

      const allChecked = selectedLength == this.savedItems.length

      const bannerRaised = mobileDevice
        ? showMobileHeader
        : this.isIntersecting && this.$store.getters.pageEntered

      const banner = [
        div(
          {
            // key: bannerRaised + 'banner',
            attrs: { ...scoping },
            staticClass: 'banner fill-before-after',

            class: [
              {
                raised: bannerRaised,
              },
            ],
          },
          [
            div(
              {
                key: this.selecting + 'banner',

                attrs: { ...scoping },
                staticClass: 'banner-content fade-appear',
                class: [
                  {
                    'is-selecting': this.selecting,
                  },
                ],
              },
              [
                [
                  !this.selecting &&
                    btn(
                      {
                        key: xxs + 'sort',
                        attrs: {
                          ...scoping,
                          title: 'sort by',
                          tabindex: '-1',
                          action: '.',
                          name: 'sort-by',
                        },
                        staticClass: 'sort-wrap banner-action',
                        props: {
                          text: true,
                          tag: 'form',
                        },
                      },
                      [
                        select({
                          ref: 'select',
                          props: {
                            items: this.sortBy,
                            title: 'sort by',
                            vmodel: this.$store.state.sortSaved,
                          },
                          on: {
                            vmodel: (e) => {
                              this.$commit('UPDATE_', {
                                path: 'sortSaved',
                                value: e,
                              })

                              scrollWindow.call(this)
                            },
                          },
                        }),
                        [
                          !xxs &&
                            icon({
                              attrs: {
                                ...scoping,
                                name: 'sort',
                                size: xs ? '16px' : '20px',
                              },
                            }),
                        ],
                        this.selectedSort,
                      ]
                    ),
                ],

                [
                  this.selecting &&
                    btn(
                      {
                        props: {
                          background: 'primary',
                          disabled: !selectedLength,
                          shape: 'none',
                        },
                        attrs: {
                          ...scoping,
                          title: allChecked
                            ? 'clear saved items'
                            : `remove ${selectedLength} items from saved`,
                        },
                        staticClass: 'delete-items banner-action',
                        class: [
                          {
                            'rounded-bottom': bannerRaised,
                            rounded: !bannerRaised,
                          },
                        ],
                        on: {
                          '!click': () => {
                            this.$commit('V_MODEL', {
                              path: 'active',
                              innerPath: 'clearSaved',
                              value: true,
                            })

                            this.$commit('V_MODEL', {
                              path: 'meta',
                              innerPath: 'clearSaved',
                              value: {
                                onclear: () => {
                                  this.selecting = false
                                  this.selectedItems = []
                                },

                                items: this.selectedItems.map((x) => x.ref),
                              },
                            })
                          },
                        },
                      },
                      [
                        icon({
                          attrs: {
                            ...scoping,
                            name: 'delete',
                            size: xs ? '16px' : '20px',
                          },
                        }),
                        allChecked
                          ? 'Clear saved'
                          : `Remove${
                              selectedLength
                                ? ` ${selectedLength} item${
                                    selectedLength > 1 ? 's' : ''
                                  }`
                                : ''
                            }`,
                      ]
                    ),
                ],

                [1].map(() => {
                  const intermediate =
                    selectedLength && selectedLength < savedItems.length

                  const title = this.selecting
                    ? `${!allChecked ? 'Select all' : 'Deselect all'}`
                    : 'Select'

                  return btn(
                    {
                      key: xxs + 'select',
                      attrs: { ...scoping, title },
                      staticClass: 'select banner-action',
                      props: {
                        text: true,
                      },
                      on: {
                        '!click': () => {
                          if (!this.selecting) {
                            this.selecting = true
                          } else {
                            !allChecked
                              ? (this.selectedItems = this.savedItems.map(
                                  (ref, key) => ({
                                    key,
                                    ref,
                                  })
                                ))
                              : (this.selectedItems = [])
                          }
                        },
                      },
                    },
                    [
                      [
                        !xxs &&
                          icon({
                            attrs: {
                              ...scoping,
                              name: this.selecting
                                ? `${
                                    intermediate
                                      ? 'intermediateCheckbox'
                                      : allChecked
                                      ? 'multipleChecked'
                                      : 'blankCheckboxOutline'
                                  }`
                                : 'blankCheckboxOutline',
                              size: xs ? '16px' : '20px',
                            },
                          }),
                      ],
                      title,
                    ]
                  )
                }),

                [
                  this.selecting &&
                    btn(
                      {
                        key:
                          (xs && breakpoints.orientationAlias != 'la') +
                          'cancel-btn',
                        attrs: {
                          ...scoping,
                          title: 'cancel select',
                        },
                        staticClass: 'cancel-select banner-action',
                        on: {
                          '!click': () => {
                            this.selecting = false

                            this.$nextTick(() => (this.selectedItems = []))
                          },
                        },
                      },
                      [
                        icon({
                          attrs: {
                            ...scoping,
                            name: 'close',
                            size: '20px',
                          },
                        }),
                        !(xs && breakpoints.orientationAlias != 'la')
                          ? 'Cancel'
                          : '',
                      ]
                    ),
                ],
              ]
            ),
          ]
        ),
      ]

      return [
        mobileDevice
          ? h('mobileAppTitle', [
              this.selecting &&
                div(
                  {
                    key: this.selecting + 'header-append',
                    attrs: { ...scoping },
                    staticClass: 'selected-count fade-appear',
                  },
                  [
                    allChecked
                      ? `${
                          this.savedItems.length > 1 ? 'All items' : 'Item'
                        } selected`
                      : `${selectedLength} item${
                          selectedLength > 1 ? 's' : ''
                        } selected`.replace(/0 item/, 'None'),
                  ]
                ),
            ])
          : h2(
              {
                attrs: { ...scoping },
                staticClass: 'title truncate-text page-title',
              },
              [
                `Saved items `,
                wbr(),

                [
                  this.selecting &&
                    div(
                      {
                        key: this.selecting + 'header-append',
                        attrs: { ...scoping },
                        staticClass: 'selected-count fade-appear',
                      },
                      [
                        allChecked
                          ? 'All items selected'
                          : `${selectedLength} item${
                              selectedLength > 1 ? 's' : ''
                            } selected`.replace(/0 item/, 'None'),
                      ]
                    ),
                ],
              ]
            ),

        intersection({
          props: {
            config: {
              rootMargin: `-${this.$store.getters.headerHeight} 0px 0px`,
            },
            useAnimationFrame: false,
          },
          scopedSlots: {
            default: (pay) => {
              this.isIntersecting = !pay.isIntersecting

              return div({
                attrs: { ...scoping, 'aria-hidden': 'true' },
                staticClass: 'obs',
              })
            },
          },
        }),

        banner,

        div(
          {
            attrs: { ...scoping },
            staticClass: 'desc divide-before',
          },
          [
            {
              title: 'total items',
              text: `${(this.savedItems || []).length} item${
                this.savedItems?.length > 1 ? 's' : ''
              }`,
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
            key: this.selectedSort + 'main-wrap',
            attrs: {
              ...scoping,
            },
            staticClass: 'item-wrap fade-appear',
          },
          [
            savedItems.map((item, key) => {
              const isSelected = this.selecting
                ? !!this.selectedItems.find((x) => x.ref == item)
                : false

              return savedItem({
                key,
                props: {
                  item,
                  selecting: this.selecting,
                  isSelected,
                },
                nativeOn: this.selecting
                  ? {
                      click: (e) => {
                        e.preventDefault()
                        if (!isSelected) {
                          this.selectedItems = distinctArray(
                            { key, ref: item },
                            this.selectedItems,
                            false
                          )
                        } else {
                          this.selectedItems = [...this.selectedItems].filter(
                            (x) => x.ref != item
                          )
                        }
                      },
                    }
                  : undefined,
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

        [
          this.pageLength > 1 &&
            div(
              {
                attrs: { ...scoping },
                staticClass: 'pagination-wrap',
              },
              [
                uiPagination({
                  props: {
                    vmodel: parseFloat(this.$route.query.page || 1),
                    length: this.pageLength,
                  },
                  on: {
                    vmodel: async (e) => {
                      scrollWindow.call(this, false)

                      await this.$nextAnimFrame()

                      this.$router.push({
                        query: {
                          ...this.$router.query,
                          page: e,
                        },
                      })
                    },
                  },
                }),
              ]
            ),
        ],
      ]
    }

    return div(
      {
        key: this.pageIndex + 'root',
        attrs: { ...scoping },
        staticClass: 'root',
        class: [
          {
            'empty-state': !savedItems.length,
            'raise-banner': mobileDevice
              ? showMobileHeader
              : this.isIntersecting && this.$store.getters.pageEntered,
            'fade-slide-y-appear': !!this.pageChanged,
          },
        ],
      },
      [emptyState(), fullState()]
    )
  },
}
</script>

<style>
/* MOBILE FIRST */

.root[data-p-s-ix] {
  min-height: 100vh;
  --banner-height: 44px;
  --appear-duration: 150ms;
}

.pagination-wrap[data-p-s-ix] {
  margin-top: var(--half-offset);
}

.empty-root[data-p-s-ix] {
  min-height: calc(100vh - var(--nav-height));
  display: grid;
  justify-items: center;
  align-content: center;
  padding: 3rem 1.5rem;
}

.empty-title[data-p-s-ix] {
  margin: 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.4px;
}

/* FULL STATE MOBILE FIRST */

.root:not(.empty-state)[data-p-s-ix] {
  padding: 0rem 0 48px;
}

.obs[data-p-s-ix] {
  height: 1px;
  width: 100%;
  position: absolute;
}

.desc[data-p-s-ix] {
  display: flex;
  justify-content: space-between;
  margin: var(--qtr-offset) 0;
  padding: 0 var(--half-offset);
}

.desc-item[data-p-s-ix] {
  font-size: 0.95rem;
  color: var(--body-c);
}

.desc-item[data-p-s-ix]:last-of-type {
  color: var(--caption-c);
  font-style: italic;
  font-size: 0.9rem;
}

.selected-count[data-p-s-ix] {
  font-size: 1rem;
  color: var(--subtitle-c);
  font-weight: 400;
  margin-top: 0.5rem;
}

.root[data-p-s-ix]:not(.raise-banner) .root[data-a-mate]::before {
  opacity: 0;
}

.banner[data-p-s-ix] {
  width: 100%;
  min-height: var(--banner-height);
  z-index: 11;
  margin-bottom: 0.5rem;
  background: var(--blur-header);
  position: relative;
}

.banner[data-p-s-ix].raised {
  top: calc(var(--header-height) - 1px);
  background: var(--blur-banner);
  position: sticky;
}

.banner[data-p-s-ix]::after {
  border-bottom: var(--ui-divide);
}

.backdrop-false .banner[data-p-s-ix].raised {
  background: var(--theme-banner);
}

.backdrop-true .banner[data-p-s-ix].raised::before {
  backdrop-filter: var(--banner-backdrop-filter);
}

.backdrop-false .banner[data-p-s-ix]::before {
  opacity: 0;
  transition: 0.15s linear opacity;
  background-color: var(--theme-banner);
  box-shadow: var(--raise-dark);
}

.root[data-p-s-ix].raise-banner .banner[data-p-s-ix]::before {
  opacity: 1;
  transition: 0.2s linear opacity;
}

.banner-content[data-p-s-ix].is-selecting {
  justify-content: flex-end;
  padding: 0;
}

.banner-content[data-p-s-ix] {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  flex-wrap: wrap;
}

.banner-content[data-p-s-ix].is-selecting > .ui-btn {
  font-size: 0.95rem;
}

.br-xxs .banner[data-p-s-ix] {
  padding: 0 0.75rem;
  --banner-height: 38px;
}

.banner-action[data-p-s-ix] {
  display: inline-grid;
  grid-auto-flow: column;
  column-gap: 1ch;
  height: var(--banner-height) !important;
  justify-self: flex-end;
}

.delete-items[data-p-s-ix] {
  justify-self: flex-start;
}

.sort-wrap[data-p-s-ix] {
  transform: none !important;
  letter-spacing: 0px;
}

.sort-wrap[data-p-s-ix] .root[data-uist] {
  min-width: 132px;
}

.br-xs .cancel-select[data-p-s-ix] {
  column-gap: 0;
  margin-left: 0.5rem;
}

.item-wrap[data-p-s-ix] {
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.items-shown[data-p-s-ix] {
  text-align: center;
  font-weight: 500;
  font-size: min(0.875rem, 15px);
  color: var(--subtitle-c);
  margin: var(--half-offset) 0.5rem 1.5rem;
}

/* LARGE BR */

.sm-up .root[data-p-s-ix] {
  --banner-height: 52px;
}

.sm-up .item-wrap[data-p-s-ix] {
  grid-template-columns: repeat(auto-fit, minmax(calc(50% - 1.5rem), 1fr));
  column-gap: 0.25rem;
}

.md-up .banner[data-p-s-ix] {
  top: -1px;
}
</style>
