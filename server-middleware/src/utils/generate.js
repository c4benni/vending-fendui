const id = (prefix = 'p-') => {
  const strings = `${Date.now().toString(36)}`

  let float = (Math.random() * 99).toFixed(2).replace(/^\d\./, (x) => `0${x}`)

  while (/-00$/.test(float)) {
    float = (Math.random() * 99).toFixed(2).replace(/^\d\./, (x) => `0${x}`)
  }

  return `${prefix}${strings}${float}`.replace(/\./g, '-')
}

module.exports = {
  id,
  sessionId(prefix = 's-') {
    return `${id(prefix)}-${Date.now().toString(16)}`
  }
}
