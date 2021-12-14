export default {
  async getTransactions(query) {
    try {
      const { data: response } = await this.$axios.get(`transaction${query}`)

      return { data: response.data, error: null }
    } catch (err) {
      const errResponse = err.response.data
      return {
        error: errResponse.error,
        data: null
      }
    }
  }
}
