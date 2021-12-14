export default async function (payload) {
  try {
    const { data: response } = await this.$axios.post(`buy`, payload)

    console.log({ response, payload })

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
