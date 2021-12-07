<script>
export default {
    name: 'SvgChecked',
    functional: true,

    render(h, c) {
        const scoping = { 'data-svg-cd': '' }
        const staticClass = c.data.staticClass ? ` ${c.data.staticClass}` : ''
        return h(
            'span',
            {
                ...c.data,
                attrs: {
                    ...c.data.attrs,
                    ...scoping,
                },
                staticClass: `root${staticClass}`,
            },
            [
                h(
                    'svg',
                    {
                        attrs: {
                            fill: 'none',
                            stroke: 'currentColor',
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round',
                            'stroke-width': '2',
                            version: '1.1',
                            viewBox: '0 0 24 24',
                            xmlns: 'http://www.w3.org/2000/svg',
                        },
                    },
                    [
                        h('path', {
                            attrs: {
                                d: 'M22 11.07V12a10 10 0 1 1-5.93-9.14',
                            },
                        }),
                        h('polyline', {
                            attrs: {
                                points: '23 3 12 14 9 11',
                            },
                        }),
                    ]
                ),
            ]
        )
    },
}
</script>

<style>
.root[data-svg-cd] svg {
    stroke-width: 1.25px;
}
</style>
