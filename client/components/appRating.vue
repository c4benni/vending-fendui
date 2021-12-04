<script>
export default {
    name: 'AppRating',
    data: () => ({
        rating: 4
    }),
    render(h) {
        if (!this.$c4.mounted) {
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

                        on: {
                            'click': () => {
                                console.log(33);
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
                                    size: '20px'
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