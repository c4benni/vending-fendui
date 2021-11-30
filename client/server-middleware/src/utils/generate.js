
module.exports = {
    id: (prefix = 'p-') => {
        const strings = `${Date.now().toString(36)}`;

        const float = (Math.random() * 99)
            .toFixed(2)
            .replace(/^\d\./, x => `0${x}`)
        
        return `${prefix}${strings}${float}`
            .replace(/\./g, '-')
    },
}