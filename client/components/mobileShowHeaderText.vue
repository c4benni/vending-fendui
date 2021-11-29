<script>
import { computedBR, mountComplexComponent } from './utils/main'

export default {
  name: 'MobileShowHeaderText',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },
  data: () => ({
    selfName: 'MobileShowHeaderText',
    renderedComponents: ['UiIntersection'],
  }),
  computed: {
    ...mountComplexComponent.computed,
    ...computedBR,
    mobileDevice() {
      return /xxs|xs|sm/.test(this.breakpoints.is)
    },
  },
  watch: { ...mountComplexComponent.watch },
  created() {
    this.toggleMobileHeader(false)
  },

  mounted() {
    mountComplexComponent.mounted.call(this)
  },
  beforeDestroy() {
    this.$route.name != 'view-all' &&
      this.toggleMobileHeader(!this.mobileDevice)
  },
  methods: {
    ...mountComplexComponent.methods,

    toggleMobileHeader(value) {
      this.$commit('UPDATE_', {
        path: 'header',
        value: {
          ...this.$store.state.header,
          showOnMobile: value,
        },
      })
    },
  },
  render(h) {
    const intersection = (d, c) => h('ui-intersection', d, c)

    const header = this.$store.state.header

    const showOnMobile = header.showOnMobile

    return intersection({
      props: {
        config: {
          threshold: 0,
        },
      },
      scopedSlots: {
        default: (p) => {
          if (p.entries.boundingClientRect && this.$store.state.appLoaded) {
            this.$nextTick(() => {
              if (!p.isIntersecting && !showOnMobile) {
                this.toggleMobileHeader(true)
              } else if (p.isIntersecting && showOnMobile) {
                this.toggleMobileHeader(false)
              }
            })
          }

          return h(this.tag, this.$slots.default)
        },
      },
    })
  },
}
</script>

<style></style>
