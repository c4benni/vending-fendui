export default {
  async getProducts(query = '') {
    try {
      const { data: response } = await this.$axios.get(`product/all${query}`)

      return { data: response.data, error: null }
    } catch (err) {
      const errResponse = err.response.data
      return {
        error: errResponse.error,
        data: null
      }
    }
  },

  async getProduct(id) {
    try {
      const { data: response } = await this.$axios.get(`product?id=${id}`)

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
