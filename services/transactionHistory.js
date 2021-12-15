import { serviceCall } from '~/utils/main'

export default {
  async getTransactions(query) {
    return await serviceCall(
      async () => await this.$axios.get(`transaction${query}`)
    )
  }
}
