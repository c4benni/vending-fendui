<script>
import { mountComplexPage } from '~/components/utils/main'
export default {
  name: 'ProfilePage',
  data: () => ({
    selfName: 'ProfilePage',
    renderedComponents: ['UnderConstruction'],
  }),
  computed: {
    ...mountComplexPage.computed,
  },
  watch: {
    ...mountComplexPage.watch,
  },
  mounted() {
    mountComplexPage.mounted.call(this)
  },
  methods: {
    ...mountComplexPage.methods,
  },
  render(h) {
    const underConstruction = (d) => h('underConstruction', d)

    return underConstruction()
  },
}
</script>

<style></style>
