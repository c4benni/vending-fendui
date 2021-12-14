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
  },

  async updateProduct(payload) {
    try {
      const { data: response } = await this.$axios.patch('product', payload)

      return { data: response.data, error: null }
    } catch (err) {
      const errResponse = err.response.data

      return {
        error: errResponse.error,
        data: null
      }
    }
  },

  async deleteProduct(id) {
    try {
      const { data: response } = await this.$axios.delete(`product?id=${id}`)

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
