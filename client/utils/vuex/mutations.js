import Vue from 'vue'
import { distinctArray, getObjectPath, getType } from '../main'

export default {
  SHOP_SECTION(s, p) {
    if (!p.data || !p.components || !p.path) {
      throw new Error(
        'invalid SHOP_SECTION args. Missing p.data or p.components or p.path'
      )
    }

    const root = s.shopSection

    root.sections[p.path] = {
      ...p.data,
      sortBy: p.data.sortBy || 'default',
      filters: p.data.filters || {},
      filterBy: p.data.filterBy || {},
      initialFilter: p.data.initialFilter || {}
    }
    root.components = [...new Set([...root.components, ...p.components])]

    Vue.set(s, 'shopSection', { ...s.shopSection })
  },

  $STORE(s, p) {
    const callback = (i) => {
      let item = i

      if (getType(item) != 'object' && getType(item) == 'array') {
        item = item[0]
      }

      // debugging
      if (getType(item) != 'object') {
        throw new SyntaxError('$store value recieved a non object')
      }

      const root = s.$store.merch
      const path =
        item.product_code ||
        item.productCode ||
        item.path ||
        item.ref ||
        item.key

      if (!path) {
        return
      }

      let merch = root?.[path]

      if (!merch) {
        // root[path] = {}
        Vue.set(s.$store, 'merch', {})
      }

      merch = root?.[path]

      // root[path] = {
      //   ...merch,
      //   ...item
      // }

      // Vue.set(root, path, {
      //   ...merch,
      //   ...item
      // })

      const update = {
        ...root
      }

      update[path] = {
        ...merch,
        ...item
      }

      s.$store.merch = { ...update }
    }

    const value = p?.value

    // for debugging
    if (!Array.isArray(value)) {
      console.log(value)
      throw new SyntaxError('$store value must be an array')
    }

    if (!value?.length) {
      return
    }

    value.forEach(callback)
  },

  FETCHED(s, p) {
    const root = s.fetched
    const path = p.path
    const value = p.value
    const oldValue = root?.[path]

    if (oldValue && value) {
      Vue.set(root, path, [...new Set([...oldValue, value])])
    }
  },

  UPDATE_(s, p) {
    let root = getObjectPath({ obj: s, path: `${p.innerPath}` })
    const path = p?.name || p?.path
    let value = p.value

    if (typeof value == 'undefined') {
      Vue.delete(root, path)
    } else {
      Vue.set(root, path, value)
    }

    root = 0

    value = 0
  },

  V_MODEL(s, p) {
    const innerPath = getObjectPath({
      obj: s.vmodel,
      path: p.innerPath
    })

    Vue.set(
      innerPath,
      p.path,
      p.value == 'toggle' ? !innerPath[p.path] : p.value
    )

    Vue.set(s, 'vmodel', { ...s.vmodel })
  },

  SAVED_ITEMS(s, p) {
    if (typeof p?.type != 'string' || !/add|remove/i.test(p?.type)) {
      throw new Error('SAVED_ITEMS recieved an invalid payload!')
    }

    const type = p.type.toLowerCase()

    const path = p.id || p.path || p.value

    if (type == 'add') {
      // const now = performance.now()

      // s.savedItems[path] = now
      // s.savedItems = distinctArray(path, s.savedItems)

      Vue.set(s, 'savedItems', distinctArray(path, s.savedItems, true))
    } else if (type == 'remove') {
      // delete s.savedItems[path]

      // s.savedItems = [...s.savedItems].filter((x) => x != path)

      Vue.set(
        s,
        'savedItems',
        [...s.savedItems].filter((x) => x != path)
      )
    }
  },

  RECIPES(s, p) {
    const root = s.recipes

    const newValue = { ...root }

    const value = { ...(newValue?.[p.path] || {}), ...p.value }

    if (!value.area || /^unknown$/i.test(value.area)) {
      value.area = 'Unknown area'
    }

    newValue[p.path] = value

    Vue.set(s, 'recipes', { ...newValue })
  }
}
