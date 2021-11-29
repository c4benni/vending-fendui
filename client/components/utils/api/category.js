import { promiser } from '../main'

export default async function ({ min }) {
  if (!this.$store.state.exploreBuilt) {
    return promiser([])
  }

  const supabase = this.$store.getters.supabase

  const { data, error } = await supabase.rpc('get_categories', {
    min_items: parseFloat(min)
  })

  if (error || !data?.length) {
    return promiser({ error })
  }

  console.log(data)

  this.$commit('UPDATE_', {
    path: 'categories',
    innerPath: 'explore',
    value: [...data]
  })

  this.$commit('UPDATE_', {
    path: 'explore',
    value: { ...this.$store.state.explore }
  })

  this.$commit('UPDATE_', {
    path: 'expanded',
    innerPath: 'explore',
    value: {
      ...(this.$store.state.expanded || {}),
      categories: true
    }
  })

  return promiser({ data })
}
