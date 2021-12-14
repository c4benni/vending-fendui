import { camelCase } from '~/utils/main'

export default function registerComponents(Vue) {
  const requireComponent = require.context(
    '~/components',
    true,
    /uiBtn|uiIcon|uiClickable|uiSheet|uiDialog|uiIntersection|uiInput|uiForm|appImg|uiTable|uiSelect\.(vue)$/i
  )

  requireComponent.keys().forEach((fileName) => {
    const componentConfig = requireComponent(fileName)

    const componentName = (val) => {
      val = fileName
        .replace(/^\.\/(\w+\/)?(\w+\W\w+\/)?/, '')
        .replace(/^(\w+\/)?/, '')
        .replace(/\.w+$/, '')
        .replace(/\.vue$/i, '')

      return camelCase(val)
    }

    const name = componentName()

    if (/\.vue$/i.test(name)) {
      return
    }

    Vue.component(name, componentConfig.default || componentConfig)
  })
}
