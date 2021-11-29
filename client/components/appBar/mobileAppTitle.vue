<script>
import { computedBR, mountComplexComponent } from '../utils/main'
export default {
  name: 'MobileAppTitle',
  data: () => ({
    selfName: 'MobileAppTitle',
    renderedComponents: ['MobileShowHeaderText'],
  }),
  computed: {
    ...mountComplexComponent.computed,
    ...computedBR,
    mobileDevice() {
      return /xxs|xs|sm/.test(this.breakpoints.is)
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
    if (!this.mobileDevice) {
      return null
    }

    const scoping = { 'data-a-mate': '' }
    const h1 = (d, c) => h('h1', d, c)
    const icon = (d, c) => h('ui-icon', d, c)
    const mobileShowHeaderText = (d, c) => h('mobileShowHeaderText', d, c)

    const header = this.$store.state.header

    const showOnMobile = header.showOnMobile

    return h1(
      {
        attrs: {
          ...scoping,
          'aria-hidden': showOnMobile ? 'true' : undefined,
        },
        staticClass: 'root fill-before divide-before',
      },
      [
        icon({
          attrs: { ...scoping, name: 'logo', title: 'app logo', size: '38px' },
          staticClass: 'primary-text logo',
        }),

        mobileShowHeaderText(
          {
            attrs: { ...scoping },
            staticClass: 'text',
          },
          header.text
        ),

        this.$slots.default,
      ]
    )
  },
}
</script>

<style>
.root[data-a-mate] {
  min-height: 128px;
  display: grid;
  align-items: flex-end;
  justify-content: center;
  justify-items: center;
  font-size: 2.35rem !important;
  font-weight: 600 !important;
  position: relative;
  transition: opacity 0.3s linear;
  z-index: 100;
  letter-spacing: 0.4px;
  padding: 1.25rem 1rem 1rem;
  grid-template-rows: 45px 1fr;
  align-items: center;
  isolation: isolate;
}
</style>
