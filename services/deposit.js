import { serviceCall } from '~/utils/main'

export default async function (payload) {
  const { data, error } = await serviceCall(
    async () => await this.$axios.post(`deposit`, payload)
  )

  if (!error) {
    await this.$refreshUser()
  }

  return { data, error }
}
