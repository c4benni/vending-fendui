import { getUid, nextAnimFrame, promiser } from '../main'

export default async function fetchGroup({
  array,
  fn,
  replace = true,
  save = () => ({})
}) {
  const arr = array
  let existingRecipes = []
  let nonExistingRequests = []

  if (!this.$store.state.idb?.uid || !array?.length) {
    return promiser({ data: [] })
  }

  const uid = await getUid.call(this)

  if (!replace) {
    existingRecipes = Object.keys(this.$store.state.recipes)

    nonExistingRequests = (arr || []).filter(
      (x) => !existingRecipes.includes(x)
    )
  }

  if (!nonExistingRequests.length && !replace) {
    return promiser({ data: [] })
  }

  const supabase = this.$store.getters.supabase

  await nextAnimFrame()

  const { data, error } = await supabase.rpc('fetch_group', {
    id_array: arr,
    fn,
    uid
  })

  if (error || !data?.length) {
    console.log({ error })
    return promiser({ error, data })
  }

  ;(data || [])[0].data.forEach((x) => {
    this.$commit('RECIPES', {
      path: x.id,
      value: {
        ...(this.$store.state.recipes?.[x.id] || {}),
        ...x,
        ...(save() || {})
      }
    })
  })

  this.$commit('UPDATE_', {
    path: 'recipes',
    value: {
      ...this.$store.state.recipes
    }
  })

  return promiser({ data: data[0] || [] })
}
