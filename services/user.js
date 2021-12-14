export default {
  async register(credentials) {
    try {
      const { data: response } = await this.$axios.post(
        'user/register',
        credentials
      )

      return { data: response.data, error: null }
    } catch (err) {
      const errResponse = err.response.data
      return {
        error: errResponse.error,
        data: null
      }
    }
  },

  async login(credentials) {
    try {
      const { data: response } = await this.$axios.post(
        'user/login',
        credentials
      )

      return { data: response.data, error: null }
    } catch (err) {
      const errResponse = err.response.data

      return {
        error: errResponse.error,
        data: null
      }
    }
  },

  async logout() {
    try {
      const { data: response } = await this.$axios.post('/user/logout')

      return { data: response.data, error: null }
    } catch (err) {
      const errResponse = err.response.data

      return {
        error: errResponse.error,
        data: null
      }
    }
  },

  async logoutAll({ notCurrent = true }) {
    try {
      const { data: response } = await this.$axios.post('/user/logout/all', {
        notCurrent
      })

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
