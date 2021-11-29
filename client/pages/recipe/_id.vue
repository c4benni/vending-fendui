<script>
import { computedBR, minutes, mountComplexPage } from '~/components/utils/main'
export default {
  name: 'RecipeId',
  data: () => ({
    selfName: 'RecipeId',
    renderedComponents: ['ParallaxPage', 'UiTable', 'SimilarItems', 'Trending'],
    loading: false,
    selfRecipe: {},
  }),
  head() {
    return {
      title: this.pageTitle,
    }
  },
  computed: {
    ...mountComplexPage.computed,
    ...computedBR,
    params() {
      return this.$route.params.id
    },
    recipe() {
      return this.$store.state.recipes?.[this.params] || {}
    },
    pageTitle() {
      const recipe = this.recipe

      const title = recipe.title || 'loading recipe title...'

      return `View recipe - ${title} `
    },
  },
  watch: {
    ...mountComplexPage.watch,
    recipe(n, o) {
      if (n?.timeStamp > o?.timeStamp) {
        this.fetchGroup()
      }
    },
    '$store.state.idb'(n) {
      if (n.uid) {
        this.fetchGroup()
      }
    },
  },
  beforeCreate() {
    this.$commit('UPDATE_', {
      path: 'text',
      value: 'Recipe',
      innerPath: 'header',
    })
  },
  created() {
    this.fetchGroup()
  },
  mounted() {
    mountComplexPage.mounted.call(this)
  },
  methods: {
    ...mountComplexPage.methods,

    async fetchGroup() {
      this.loading = true

      await this.$nextTick()

      if (!this.params) {
        return
      }

      const now = Date.now()

      const saved =
        this.$store.state.fetchTimeStamps[`fetchAll-${this.params}`] || 0

      if (now - minutes(30) > saved && this.$store.state.idb.uid) {
        const { data } = await this.$fetchGroup({
          array: [this.params],
          fn: 'fetch_all',
          save: () => ({
            timeStamp: now,
            forRecipeId: true,
          }),
          replace: true,
        })

        if (data) {
          this.loading = false

          this.selfRecipe = data[0]

          //   console.log(data)
          const timeStamps = {
            ...this.$store.state.fetchTimeStamps,
          }

          timeStamps[`fetchAll-${this.params}`] = now
          this.$commit('UPDATE_', {
            path: 'fetchTimeStamps',
            value: { ...timeStamps },
          })
        } else {
          this.loading = 'error'
        }
      }

      this.loading = false
    },
  },
  render(h) {
    const div = (d, c) => h('div', d, c)
    let getItem = this.recipe

    if (!this.$store.state.appLoaded || !getItem.img) {
      return div(
        {
          staticClass: 'sr-only',
        },
        ['Loading recipe please wait...']
      )
    }
    const media = [getItem?.media?.youtube].filter(Boolean)

    if (!getItem.instructions && this.selfRecipe.instructions) {
      getItem = this.selfRecipe
    }

    const scoping = { 'data-p-r-id': '' }
    const h2 = (d, c) => h('h2', d, c)

    const h3 = (d, c) => h('h3', d, c)
    const h4 = (d, c) => h('h4', d, c)

    // const span = (d, c) => h('span', d, c)
    const appSection = (d, c) => h('appSection', d, c)

    const savedBtn = (d, c) => h('savedBtn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const parallaxPage = (d) => h('parallaxPage', d)

    const table = (d) => h('ui-table', d)
    const similarItems = (d) => h('similarItems', d)
    const trending = (d) => h('trending', d)

    const br = this.breakpoints

    const mobileDevice = /xxs|xs|sm/.test(br.is)

    return parallaxPage({
      props: {
        img: getItem.img,
        hideFooter: this.loading,
      },
      attrs: {
        id: 'scrolling-element',
      },
      staticClass: 'recipe-id fade-appear',
      class: [
        {
          'overflow-hidden': !this.$store.getters.pageEntered,
        },
      ],
      scopedSlots: {
        header: () => {
          return [
            // [
            //   getItem.area &&
            //     h3(
            //       {
            //         attrs: {
            //           ...scoping,
            //         },
            //         staticClass: 'subtitle',
            //       },
            //       [getItem.area]
            //     ),
            // ],

            savedBtn({
              props: {
                item: this.params,
              },
            }),
          ]
        },
        default: () => {
          return this.loading
            ? [
                div(
                  {
                    attrs: {
                      ...scoping,
                      'aria-label': 'loading please wait...',
                    },
                    staticClass: 'loading-root',
                  },
                  [
                    this.loading === 'error'
                      ? icon({
                          attrs: {
                            clickable: true,
                            name: 'refresh',
                            size: 'lg',
                            tag: 'button',
                          },
                          on: {
                            '!click': this.fetchGroup,
                          },
                        })
                      : div({
                          attrs: { ...scoping },
                          staticClass: 'spinner',
                        }),
                    h2(
                      {
                        attrs: { ...scoping },
                        staticClass: 'loading-title',
                      },
                      this.loading === 'error'
                        ? 'Error fetching'
                        : 'LOADING RECIPE ...'
                    ),
                  ]
                ),
              ]
            : div(
                {
                  key: this.recipe.forRecipeId,
                  attrs: { ...scoping },
                  staticClass: 'body-wrap',
                },
                [
                  [
                    div(
                      {
                        attrs: { ...scoping },
                        staticClass: 'row-1',
                      },
                      [
                        h3(
                          {
                            attrs: {
                              ...scoping,
                            },
                            staticClass: 'area',
                          },
                          [
                            (getItem.area || 'Unknown').replace(
                              /^unknown$/i,
                              'Unknown area'
                            ),
                          ]
                        ),

                        getItem.saves
                          ? h4(
                              {
                                attrs: {
                                  ...scoping,
                                },
                                staticClass: 'likes',
                              },
                              [
                                `${getItem.saves} like${
                                  getItem.saves > 1 ? 's' : ''
                                }`,
                              ]
                            )
                          : null,
                      ]
                    ),

                    h(
                      mobileDevice ? 'mobileShowHeaderText' : 'h2',
                      {
                        props: { tag: 'h2' },
                        attrs: {
                          ...scoping,
                        },
                        staticClass: 'title line-clamp-3',
                      },
                      [getItem.title]
                    ),

                    appSection(
                      {
                        attrs: { title: 'Ingredients' },
                        staticClass: 'ingredient-section',
                      },
                      [
                        table({
                          props: {
                            header: ['Title', 'Qty'],
                            body: (getItem?.ingredients || []).filter(
                              (x) => x?.length == 2
                            ),
                            describe: `list of ingredients used for ${getItem.title} in no particular order`,
                            id: 'ingredients-table',
                            row: '42px',
                            column: '1fr 25%',
                          },
                        }),
                      ]
                    ),

                    appSection(
                      {
                        attrs: {
                          title: 'Instructions',
                        },
                      },
                      [
                        div(
                          {
                            attrs: { ...scoping },
                            staticClass: 'instructions',
                          },
                          [getItem.instructions]
                        ),
                      ]
                    ),

                    [
                      media.length
                        ? appSection(
                            {
                              attrs: {
                                title: 'Watch',
                              },
                            },
                            [
                              div(
                                {
                                  attrs: { ...scoping },
                                  staticClass: 'video video-wrap',
                                },
                                [
                                  media.map((item, key) => {
                                    const src = (replace) =>
                                      item.replace(
                                        /watch\?v=/,
                                        replace || 'embed/'
                                      )
                                    return h('iframe', {
                                      key: key + 'video',
                                      attrs: {
                                        ...scoping,
                                        src: src(),
                                        srcdoc: `<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{background:#FF0000;height:78px;width:96px;display:grid;place-items:center;border-radius:16px;left:50%;transform:translateX(-50%);text-align:center;cursor:pointer;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}a,img,html{background:#000;}</style><a title='click to watch' href=${src()}><img src='${src(
                                          'vi/'
                                        ).replace(
                                          /\/www/,
                                          '/img'
                                        )}/hqdefault.jpg' alt='${
                                          getItem.title
                                        } youtube video'><span><svg style="width:72px;height:72px" viewBox="0 0 24 24"><path fill="#fff" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg></span></a>`,
                                        crossorigin: true,
                                        allow:
                                          'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
                                        allowfullscreen: true,
                                        title: getItem.title,
                                      },
                                      staticClass: 'iframe',
                                    })
                                  }),
                                ]
                              ),
                            ]
                          )
                        : null,
                    ],

                    [
                      similarItems({
                        props: {
                          item: getItem.id,
                        },
                      }),
                    ],

                    trending({
                      props: {
                        showDescription: false,
                        type: '2',
                        height: '180px',
                      },
                      staticClass: 'recipe-id-trending',
                    }),
                  ],
                ]
              )
        },
      },
    })
  },
}
</script>

<style>
.loading-root[data-p-r-id] {
  padding: var(--divide-offset) var(--half-offset);
  display: grid;
  place-items: center;
  row-gap: var(--half-offset);
}

.loading-title[data-p-r-id] {
  font-size: 1rem;
  font-weight: 400;
  color: var(--subtitle-c);
}

.recipe-id {
  position: relative;
  max-height: 100vh;
  overflow: hidden auto;
  --scrollbar-size: 1px;
}

.recipe-id .root[data-sbn] {
  bottom: 0;
  right: 0;
  margin: var(--qtr-offset);
  background: var(--tertiary) !important;
  color: #fff !important;
  position: absolute;
}

.row-1[data-p-r-id] {
  display: flex;
  padding: var(--qtr-offset) var(--half-offset);
  max-width: 660px;
  margin: 0 auto;
  justify-content: space-between;
}

/* .sm-down .recipe-id .root[data-sbn] {
  position: fixed;
} */

.area[data-p-r-id] {
  font-weight: 600;
  font-size: 1.15rem;
  letter-spacing: 0.3px;
  line-height: 1.5;
  color: var(--subtitle-c);
  justify-self: flex-start;
}

.likes[data-p-r-id] {
  font-weight: 400;
  font-size: 1.05rem;
  letter-spacing: 0.3px;
  line-height: 1.5;
  color: var(--caption-c);
  font-style: italic;
  justify-self: flex-end;
}

.title[data-p-r-id] {
  font-weight: 800;
  font-size: 1.75rem;
  padding: 0 var(--half-offset);
  max-width: 660px;
  margin: 0 auto;
}

.md-up .title[data-p-r-id] {
  text-align: center;
  margin-top: var(--half-offset);
  font-size: 2.25rem;
}

.ingredient-section .root[data-uite] {
  margin-top: var(--qtr-offset);
}

.instructions[data-p-r-id] {
  padding: calc(var(--qtr-offset) / 2) var(--half-offset) 0;
  line-height: 1.75;
  color: var(--body-c);
  letter-spacing: 0.2px;
  word-spacing: 1.5px;
  max-width: 860px;
  margin: 0 auto;
}

.md-up .instructions[data-p-r-id] {
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 2;
  letter-spacing: 0.4px;
  word-spacing: 2px;
}

.video-wrap[data-p-r-id] {
  display: grid;
  place-items: center;
  padding: var(--half-offset);
}

.iframe[data-p-r-id] {
  width: 100%;
  max-width: 660px;
  height: 350px;
}

.can-hover
  .recipe-id-trending:hover
  .view-all:not(.Active):not(:hover):not(:focus)::before {
  opacity: 0.1;
}

.recipe-id .scroll-wrap[data-e-tg] {
  scroll-snap-type: none;
  --item-width: calc(min(75%, 380px) - 1.5rem);
  grid-template-columns: repeat(var(--length), var(--item-width)) var(
      --half-offset
    );
  margin-top: var(--qtr-offset);
}

.recipe-id .title[data-mcd].type-2 {
  font-size: 1rem;
  letter-spacing: 0.4px;
  text-transform: capitalize;
  font-weight: 400;
  padding: 0.25rem 0 0 0.5rem;
  transition: 0.2s transform;
  color: var(--body-c);
  text-align: left;
  cursor: pointer;
}
</style>
