export default {
  userInfo(s) {
    const user = s.user

    if (!user) {
      return {}
    }

    const userData = {
      ...user,
      depositTotal: null,
      incomeTotal: null,
      isBuyer: user.role == 'buyer',
      isSeller: user.role == 'seller'
    }

    const amountPath = user.role == 'buyer' ? 'deposit' : 'income'

    const totalAmount = Object.entries(user[amountPath])
      .map((x) => x[0] * x[1])
      .reduce((a, b) => a + b, 0)

    userData[`${amountPath}Total`] =
      totalAmount > 99
        ? `$${(totalAmount / 100).toFixed(2)}`
        : `¢${totalAmount}`

    const output = {}

    Object.entries(userData)
      .filter((entry) => entry[1] != null && entry[1] !== undefined)
      .forEach((entry) => {
        const key = entry[0]
        const value = entry[1]

        output[key] = value
      })

    return output
  }
}
