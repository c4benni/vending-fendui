import { serviceCall } from '~/utils/main'

export default {
  async getProducts(query = '') {
    return await serviceCall(
      async () => await this.$axios.get(`product/all${query}`)
    )
  },

  async getProduct(id) {
    return await serviceCall(
      async () => await this.$axios.get(`product?id=${id}`)
    )
  },

  async updateProduct(payload) {
    return await serviceCall(
      async () => await this.$axios.patch('product', payload)
    )
  },

  async deleteProduct(id) {
    return await serviceCall(
      async () => await this.$axios.delete(`product?id=${id}`)
    )
  }
}
