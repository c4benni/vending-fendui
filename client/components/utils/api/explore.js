import { distinctArray, minutes, promiser } from '../main'

export default async function () {
  const now = Date.now()

  const saved = this.$store.state.fetchTimeStamps.exploreBuilt || 0

  if (now - minutes(15) > saved) {
    const toggleExploreBuilt = (value) =>
      this.$commit('UPDATE_', {
        path: 'exploreBuilt',
        value
      })

    // toggleExploreBuilt(false)

    const supabase = this.$store.getters.supabase

    const { data, error } = await supabase.rpc('explore')

    if (error || !data?.length) {
      !error && toggleExploreBuilt(true)

      return promiser({
        error
      })
    }

    Object.entries(data[0]).forEach((x) => {
      const path = x[0]
      const value = x[1]

      this.$commit('UPDATE_', {
        path,
        innerPath: 'explore',
        value: distinctArray(
          value,
          this.$store.state.explore?.[path] || []
        ).filter(Boolean)
      })
    })

    this.$commit('UPDATE_', {
      path: 'explore',
      value: {
        ...this.$store.state.explore
      }
    })

    toggleExploreBuilt(true)

    if (data?.length) {
      this.$commit('UPDATE_', {
        path: 'fetchTimeStamps',
        value: {
          ...this.$store.state.fetchTimeStamps,
          exploreBuilt: now
        }
      })
    }

    return promiser({ data })
  }

  return promiser([])
}
