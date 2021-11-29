<script>
import { capitalize, mountComplexComponent } from './utils/main'
export default {
  name: 'UnderConstruction',
  data: () => ({
    selfName: 'UnderConstruction',
    renderedComponents: ['AppImg'],
  }),
  computed: {
    ...mountComplexComponent.computed,
  },
  watch: { ...mountComplexComponent.watch },
  mounted() {
    mountComplexComponent.mounted.call(this)
  },
  methods: {
    ...mountComplexComponent.methods,
  },
  render(h) {
    const scoping = { 'data-ucn': '' }
    const div = (d, c) => h('div', d, c)
    const img = (d, c) => h('appImg', d, c)
    const h2 = (d, c) => h('h2', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)

    const title = 'page is under construction'

    return div(
      {
        attrs: { ...scoping, title },
        staticClass: 'root',
      },
      [
        img({
          props: {
            alt: title,
            src: this.$store.state.vectorIcons.working,
            background: 'none',
            height: '300px',
          },
        }),

        h2(
          {
            attrs: { ...scoping },
            staticClass: 'title',
          },
          capitalize(title)
        ),

        btn(
          {
            attrs: { ...scoping },
            props: {
              background: 'primary',
              to: '/',
            },
            staticClass: 'action',
          },
          [
            icon({
              attrs: {
                ...scoping,
                size: '32px',
                name: 'chevronLeft',
              },
            }),
            'Home page',
          ]
        ),
      ]
    )
  },
}
</script>

<style>
.root[data-ucn] {
  position: relative;
  height: calc(100vh - var(--nav-height));
  display: grid;
  justify-items: center;
  align-content: flex-start;
  padding-top: var(--half-offset);
}

.root[data-ucn] .root[data-aig] {
  width: 100%;
}

.title[data-ucn] {
  margin-bottom: var(--half-offset);
  font-size: 1.25rem;
}

.md-up .root[data-ucn] {
  height: calc(100vh - var(--header-height));
}

.action[data-ucn] {
  column-gap: 0.0375rem;
}
</style>
