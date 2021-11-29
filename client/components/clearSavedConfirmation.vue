<script>
import { mountComplexComponent } from './utils/main'
export default {
  name: 'ClearSavedConfirmation',
  data: () => ({
    selfName: 'ClearSavedConfirmation',
    renderedComponents: ['UiDialog'],
    loading: false,
  }),
  computed: {
    ...mountComplexComponent.computed,
    meta() {
      return this.$store.state.vmodel.clearSaved.meta
    },
    vmodel() {
      const active = this.$store.state.vmodel.clearSaved.active
      const toggle = (value) => {
        this.loading = false

        this.$commit('V_MODEL', {
          path: 'active',
          innerPath: 'clearSaved',
          value,
        })
      }
      return {
        active,
        toggle,
        close: () => toggle(false),
        open: () => toggle(true),
      }
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
    const scoping = { 'data-cscn': '' }
    const dialog = (d, c) => h('ui-dialog', d, c)
    const div = (d, c) => h('div', d, c)
    const h2 = (d, c) => h('h2', d, c)
    const h3 = (d, c) => h('h3', d, c)

    const btn = (d, c) => h('ui-btn', d, c)

    const items = this.meta.items || []

    const allSaved = this.$store.state.savedItems

    const allChecked = items.length == allSaved.length

    return dialog({
      props: {
        vmodel: this.vmodel.active,
        selfMethods: this.vmodel,
        contentClass: 'clear-saved-content',
        label: 'clear saved confirmation',
      },
      on: {
        vmodel: (e) => {
          this.vmodel?.[e ? 'open' : 'close']?.()
        },
      },
      staticClass: 'clear-saved-confirmation',
      scopedSlots: {
        default: () => {
          return div(
            {
              attrs: { ...scoping },
              staticClass: 'root',
            },
            [
              h2(
                {
                  attrs: { ...scoping },
                  staticClass: 'title truncate-text',
                },
                ['Clear saved']
              ),

              h3(
                {
                  attrs: { ...scoping },
                  staticClass: 'desc',
                },
                [
                  div({ attrs: { ...scoping }, staticClass: 'title-row-1' }, [
                    allChecked
                      ? `${
                          items.length < 2
                            ? 'Your saved item'
                            : 'All your saved items'
                        } will be cleared.`
                      : `${items.length} item${
                          items.length > 1 ? 's' : ''
                        } will be unsaved.`,
                  ]),
                  div(
                    {
                      key: 'title-row-2',
                      attrs: { ...scoping },
                      staticClass: 'title-row-2',
                    },
                    ['This action cannot be undone.']
                  ),
                ]
              ),

              div(
                {
                  attrs: { ...scoping },
                  staticClass: 'action-wrap fill-before-after',
                },
                [
                  [
                    {
                      title: 'Cancel',
                      text: true,
                    },
                    {
                      title: allChecked ? 'Clear saved' : 'Unsave items',
                      color: 'error',
                      on: {
                        '!click': async () => {
                          this.loading = true

                          await this.$save({
                            id: items,
                            mode: 'remove',
                            group: true,
                          })

                          await this.$updateProfile()

                          this.vmodel.close()
                          this.meta?.onclear?.()
                        },
                      },
                    },
                  ].map((item, key) => {
                    return btn(
                      {
                        key: key + 'btn',
                        attrs: { ...scoping },
                        props: {
                          color: item.color,
                          text: item.text,
                          fill: 'var(--error)',
                          shape: 'none',
                        },
                        staticClass: `action rounded-bottom-${
                          key == 0 ? 'left' : 'right'
                        }`,
                        on: item.on || {
                          '!click': () => {
                            this.vmodel.close()
                          },
                        },
                      },
                      [
                        this.loading && key == 1
                          ? div({
                              attrs: { ...scoping },
                              staticClass: 'spinner-border',
                              style: {
                                ' --color': 'var(--primary)',
                                '--size': '1.5rem',
                              },
                            })
                          : item.title,
                      ]
                    )
                  }),
                ]
              ),
            ]
          )
        },
      },
    })
  },
}
</script>

<style>
.clear-saved-confirmation {
  touch-action: none;
  overscroll-behavior: contain;
}

.clear-saved-content {
  border-radius: var(--rounded);
  max-width: 440px;
  --min-width: 280px;
  width: min(70%, var(--min-width));
  display: grid;
}

.sm-up .clear-saved-content {
  --min-width: 300px;
}

.root[data-cscn] {
  display: grid;
}

.title[data-cscn] {
  margin: calc(var(--half-offset) * 0.75) auto var(--qtr-offset);
  padding: 0 var(--qtr-offset);
  font-size: 1.25rem;
}

.desc[data-cscn] {
  padding: 0 var(--qtr-offset);
  margin: 0 auto;
  letter-spacing: 0.3px;
  line-height: 1.4;
  color: var(--subtitle-c);
  font-size: 0.9rem;
  font-weight: 400;
  text-align: center;
}

.title-row-2[data-cscn] {
  margin-top: calc(var(--qtr-offset) / 2);
}

.action-wrap[data-cscn] {
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
  height: 44px;
  position: relative;
  margin-top: var(--half-offset);
}

.action-wrap[data-cscn]::before {
  width: 50%;
  border-right: var(--ui-divide);
}

.action-wrap[data-cscn]::after {
  border-top: var(--ui-divide);
}

.action[data-cscn] {
  min-width: 100% !important;
  min-height: 100% !important;
}
</style>
