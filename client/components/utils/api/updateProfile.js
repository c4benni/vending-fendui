import { getUid, promiser } from '../main'

export default async function () {
  const supabase = this.$store.getters.supabase

  const id = await getUid.call(this)

  const { data, error } = await supabase.rpc('get_profile', {
    id
  })

  if (error || !data?.length) {
    return promiser({
      error,
      notFound: true
    })
  }

  this.$commit('UPDATE_', {
    path: 'savedItems',
    value: data[0].saved || []
  })

  this.$commit('UPDATE_', {
    path: 'recentlyViewed',
    value: data[0].recently_viewed || []
  })

  this.$commit('UPDATE_', {
    path: 'fetchTimeStamps',
    value: {
      ...this.$store.state.fetchTimeStamps,
      updateProfile: Date.now()
    }
  })

  return promiser({
    data
  })
}
