import { serviceCall } from '~/utils/main'

export default {
  async register(credentials) {
    return await serviceCall(
      async () => await this.$axios.post('user/register', credentials)
    )
  },

  async login(credentials) {
    return await serviceCall(
      async () => await this.$axios.post('user/login', credentials)
    )
  },

  async logout() {
    return await serviceCall(async () => await this.$axios.post('/user/logout'))
  },

  async logoutAll({ notCurrent = true }) {
    return await serviceCall(
      async () =>
        await this.$axios.post('/user/logout/all', {
          notCurrent
        })
    )
  },

  async updateUser(payload) {
    return await serviceCall(
      async () => await this.$axios.patch('user', payload)
    )
  },

  async deleteUser(payload) {
    return await serviceCall(
      async () =>
        await this.$axios.delete('user', {
          data: payload
        })
    )
  }
}
