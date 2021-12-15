import { formatAmount } from '../utils/main'

export default {
  userInfo(s) {
    const user = s.user

    if (!user) {
      return {}
    }

    const output = {
      ...user,
      depositTotal: formatAmount(user.deposit),
      incomeTotal: formatAmount(user.income),
      isBuyer: user.role == 'buyer',
      isSeller: user.role == 'seller'
    }

    return output
  },

  renderToggleBalance(s) {
    const user = s.user

    if (!user) {
      return false
    }

    return !user.showBalanceFromAccountPage
  }
}
