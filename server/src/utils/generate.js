
module.exports = {
    id: (prefix = 'p-') => {
        const strings = `${Date.now().toString(36)}`;

        const float = (Math.random() * 99)
            .toFixed(2)
            .replace(/^\d\./, x => `0${x}`)
        
        return `${prefix}${strings}${float}`
            .replace(/\./g, '-')
    },

    async cookies(cookie) {
        const splitCookie = cookie?.split?.(';') || []

        const output = {}

        splitCookie.forEach(item => {
            const entries = item.trim().split('=');

            if (entries.length == 2) {
                const key = entries[0];
                const value = entries[1];

                output[key] = value;
            }
        });

        return output;
    }
}