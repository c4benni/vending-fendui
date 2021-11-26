
module.exports = {
    id: (prefix = 'p-') => `${prefix}${Date.now().toString(36)}${(Math.random() * 99).toFixed(2)}`.replace(/\./g,'-')
}