<script>
export default {
    name: 'AppImg',

    render(h) {
        const attrs = this.$attrs;

        const href = `${attrs.src || attrs.publicId || attrs['public-id'] || attrs.href}`

        if (!this.$c4.mounted) {
            return h('a', {
                attrs: {
                    href,
                    rel: 'noopener noreferrer',
                    title: 'image loading'
                },
                style: {
                    height: attrs.height,
                    width: attrs.width,
                }
            })
        }

        const cloudinary = (d, c) => h('cld-image', d, c)

        return cloudinary({
            props: {
                publicId: href,
                // loading: 'lazy',
                ...attrs,
            },
            attrs: {
                height: attrs.height,
                width: attrs.width,
            },

            style: {
                height: attrs.height,
                width: attrs.width,
            },
        })
    }
}
</script>