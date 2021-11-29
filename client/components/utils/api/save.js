import { distinctArray, getUid, promiser } from '../main'

export default async function ({ id, mode, group }) {
  const supabase = this.$store.getters.supabase

  const uid = await getUid.call(this)

  const { data, error } = await supabase.rpc(group ? 'save_group' : 'save', {
    _id: id,
    uid,
    mode
  })

  if (error || !data?.length) {
    return promiser({ error })
  }

  if (!group) {
    this.$commit('RECIPES', {
      path: id,
      value: {
        ...(this.$store.state.recipes?.[id] || {}),
        ...data[0]
      }
    })

    let savedItems = this.$store.state.savedItems

    const $id = data[0].id

    if (data[0].saved) {
      savedItems = distinctArray($id, savedItems)
    } else {
      savedItems = savedItems.filter((x) => x != $id)
    }

    this.$commit('UPDATE_', {
      path: 'savedItems',
      value: savedItems
    })
  }

  return promiser({
    data
  })
}
