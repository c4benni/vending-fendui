<script>
export default {
    name: 'AppRating',
    props: {
        readonly: Boolean
    },
    data: () => ({
        rating: 4
    }),
    render(h) {
        if (!this.$ui.mounted) {
            return null
        }
        const div = (d, c,) => h('div', d, c);
        const btn = (d, c,) => h('uiBtn', d, c);

        const UiIcon = (d, c) => h('uiIcon', d, c,)


        return div(
            {
                class: ['grid grid-flow-col items-center justify-start'],
                on: {
                    click: () => { },
                }
            },
            [1, 2, 3, 4, 5].map((item, key) => {
                const isActive = this?.rating && this.rating >= item;
                return btn(
                    {
                        key: key + "rating",
                        class: ["rating w-[32px] h-[32px] min-h-[32px] p-0 rounded-full before:bg-yellow-500 hover:bg-opacity-100", { "text-yellow-500": isActive }],
                        size: 'sm',
                        readonly: this.readonly,

                        on: {
                            'click': () => {
                                if (this.rating == item) {
                                    this.rating = null;
                                } else {
                                    this.rating = item;
                                }
                            },
                        }
                    },
                    [
                        div({
                            staticClass: 'flex',
                            class: [
                                {
                                    "fade-appear opacity-1": isActive,
                                    'opacity-[0.65]': !isActive
                                },
                            ],
                        }, [
                            UiIcon({
                                props: {
                                    name: isActive ? "star" : "starOutline",
                                    size: '16px'
                                }
                            })
                        ])
                    ]
                );
            })
        )
    }
}
</script>

<style>
</style>