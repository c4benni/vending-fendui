import product from '~/services/product'
import user from '~/services/user'
import transactionHistory from '~/services/transactionHistory'

export default {
  async getProduct({ commit, state }, id) {
    const { data } = await product.getProduct.call(this, id)

    if (data) {
      commit('UPDATE', {
        path: 'products',
        value: {
          ...state.products,
          [data.id]: data
        }
      })
    }

    return { data: !!data }
  },

  async getProducts({ commit, state }, query) {
    const { data } = await product.getProducts.call(this, query)

    if (data?.length) {
      data.forEach((product) => {
        commit('UPDATE', {
          path: 'products',
          value: {
            ...state.products,
            [product.id]: product
          }
        })
      })
    }

    return { data: !!data }
  },

  async login({ commit }, credentials) {
    const { data: value } = await user.login.call(this, credentials)

    if (value) {
      commit('UPDATE', {
        path: 'user',
        value
      })
    }

    commit('UPDATE', {
      path: 'products',
      value: {}
    })

    commit('UPDATE', {
      path: 'transactions',
      value: {}
    })
  },

  async logout({ commit }) {
    await user.logout.call(this)

    commit('UPDATE', {
      path: 'user',
      value: null
    })
  },

  async getTransactions({ commit, state }, query) {
    const { data } = await transactionHistory.getTransactions.call(this, query)

    if (data?.length) {
      data.forEach((product) => {
        commit('UPDATE', {
          path: 'transactions',
          value: {
            ...state.transactions,
            [product.id]: product
          }
        })
      })
    }

    return { length: data?.length || 0 }
  }
}
