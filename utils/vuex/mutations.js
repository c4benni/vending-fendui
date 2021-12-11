import Vue from 'vue'
import { getObjectPath } from '../main'

export default {
  UPDATE(s, p) {
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
  }
}
