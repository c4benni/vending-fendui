export default async function () {
  try {
    const { data: response } = await this.$axios.post(`reset`)

    await this.$refreshUser()

    return { data: response.data, error: null }
  } catch (err) {
    const errResponse = err.response.data
    return {
      error: errResponse.error,
      data: null
    }
  }
}
