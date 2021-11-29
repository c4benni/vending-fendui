import { getUid, promiser } from '../main'

export default async function ({ id }) {
  const supabase = this.$store.getters.supabase
  const uid = await getUid.call(this)

  if (!uid) {
    return promiser({ data: [] })
  }

  const { data, error } = await supabase.rpc('fetch_all', { _id: id, uid })

  if (error || !data) {
    return promiser({ error })
  }

  this.$commit('RECIPES', {
    path: id,
    value: { ...data[0] }
  })

  console.log(data)

  return promiser({ data })
}
