import { promiser } from '../main'

export async function cuisinesItems({ area }) {
  if (!this.$store.state.exploreBuilt) {
    return promiser([])
  }

  const supabase = this.$store.getters.supabase

  const { data, error } = await supabase.rpc('get_area_items', {
    _area: area
  })

  if (error || !data?.length) {
    return promiser({ error })
  }

  this.$commit('UPDATE_', {
    path: area,
    innerPath: 'exploreSections.cuisines',
    value: data
  })

  return promiser({ data })
}

export async function categoriesItems({ categories }) {
  if (!this.$store.state.exploreBuilt) {
    return promiser([])
  }

  const supabase = this.$store.getters.supabase

  const { data, error } = await supabase.rpc('get_category_items', {
    _category: categories
  })

  if (error || !data?.length) {
    return promiser({ error })
  }

  this.$commit('UPDATE_', {
    path: categories,
    innerPath: 'exploreSections.categories',
    value: data
  })

  return promiser({ data })
}

export async function collectionItems({ collection }) {
  if (!this.$store.state.exploreBuilt) {
    return promiser([])
  }

  const supabase = this.$store.getters.supabase

  const { data, error } = await supabase.rpc('get_collection_items', {
    _collection: collection
  })

  if (error || !data?.length) {
    return promiser({ error })
  }

  this.$commit('UPDATE_', {
    path: collection?.toLowerCase?.() || '',
    innerPath: 'exploreSections.collections',
    value: data
  })

  return promiser({ data })
}
