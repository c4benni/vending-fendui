import { promiser } from '../main'

export default async function ({ min }) {
  if (!this.$store.state.exploreBuilt) {
    return promiser([])
  }

  const supabase = this.$store.getters.supabase

  const { data, error } = await supabase.rpc('get_cuisines', {
    min_items: parseFloat(min)
  })

  if (error || !data?.length) {
    return promiser({ error })
  }

  this.$commit('UPDATE_', {
    path: 'area',
    innerPath: 'explore',
    value: data
  })

  this.$commit('UPDATE_', {
    path: 'expanded',
    innerPath: 'explore',
    value: {
      ...(this.$store.state.expanded || {}),
      area: true
    }
  })

  return promiser({ data })
}
