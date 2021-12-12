<script>
export default {
    name: 'UiTab',

    computed: {
        pageTab() {
            return this.$route.query.tab || 'general'
        },

        tabItems() {
            const items = [
                {
                    title: 'General',
                    selected: this.pageTab == 'general',
                    id: 'general-ctrl',
                },
                {
                    title: 'Preference',
                    selected: this.pageTab == 'preference',
                    control: 'preference',
                    id: 'preference-ctrl',
                },
                {
                    title: 'Change password',
                    selected: this.pageTab == 'change-password',
                    control: 'change-password',
                    id: 'change-password-ctrl',
                    warn: true
                },
                {
                    title: 'Delete account',
                    selected: this.pageTab == 'delete-account',
                    control: 'delete-account',
                    id: 'delete-account-ctrl',
                    isDelete: true
                },
            ].map((tab, index) => ({
                ...tab,
                tabindex: this.tabFocus == index ? '0' : '-1'
            }))

            if (!items.find(item => item.selected)) {
                items[0].selected = true
            }

            return items
        },
        activeTabIndex() {
            const tabIndex = this.tabItems.findIndex(tab => tab.selected)

            return tabIndex > -1 ? tabIndex : 0
        },
        hasActive() {
            return this.activeTabIndex
        },
    },

    watch: {
        activeTabIndex(n) {
            this.tabFocus = n
        },
    },

    methods: {
        updateTab({ value, type = 'replace' }) {
            this.$router[type]({
                query: {
                    ...this.$route.query,
                    tab: value,
                },
            })
        },
    },

    render(h) {
        const scoping = { 'data-sape': '' }

        const div = (d, c) => h('div', d, c)

        const btn = (d, c) => h('ui-btn', d, c)

        const tabControls = () => {

            const getTo = (tab) => {
                const route = this.$route

                let to = route.path

                Object.entries({
                    ...route.query,
                    tab,
                }).forEach((item, key) => {
                    if (!item[1]) {
                        return
                    }
                    to += `${key == 0 ? '?' : '&'}${item[0]}=${item[1]}`
                })

                to += route.hash || ''

                return to
            }

            return [
                div(
                    {
                        attrs: {
                            ...scoping,
                            role: 'tablist',
                            'aria-label':
                                'account tab',
                        },
                        staticClass: 'tablist fill-after max-w-[calc(100vw-3rem)] overflow-x-auto overflow-y-hidden',
                    },
                    this.tabItems.map((item, key) => {
                        return btn(
                            {
                                ref: `tabctrl-${key}`,
                                key,
                                props: {
                                    text: true,
                                },
                                attrs: {
                                    ...scoping,
                                    role: 'tab',
                                    'aria-selected': item.selected,
                                    'aria-controls': item.control,
                                    id: item.id,
                                    // tabindex: item.tabindex,
                                    to: !item.selected ? getTo(item.control) : undefined
                                },
                                staticClass: 'tabctrl h-[48px] px-0 mr-4 rounded-none min-w-[fit-content]',
                                class: [{
                                    '__selected': item.selected,
                                    'text-blue-600 dark:text-blue-400': item.selected && !item.isDelete && !item.warn,
                                    'text-red-600 dark:text-red-400': item.selected && item.isDelete,
                                    'text-yellow-600 dark:text-yellow-200': item.selected && item.warn
                                }],
                            },
                            [
                                div(
                                    {
                                        attrs: { ...scoping },
                                        staticClass: 'tabctrl-text',
                                        class: [{ __selected: item.selected }],
                                    },
                                    item.title
                                ),

                                item.selected ? div({
                                    staticClass: 'fade-appear absolute w-full h-[2px] bottom-0 rounded-t-md',
                                    class: {
                                        'bg-blue-700 dark:bg-blue-500': !item.isDelete && !item.warn,

                                        'bg-yellow-500 dark:bg-yellow-300': item.warn,

                                        'bg-red-700 dark:bg-red-500': item.isDelete,
                                    }
                                }) : null
                            ]
                        )
                    })
                ),
            ]
        }

        return div(
            {
                attrs: { ...scoping, 'aria-label': 'tabs' },
                staticClass: 'root px-6 grid grid-rows-[auto,1fr]',
            },
            [
                tabControls(),

                this.$slots.default.filter(vnode => vnode.tag)

                [this.activeTabIndex]
            ]
        )
    },
}
// eslint-disable-next-line vue/comment-directive
</script>

<style>
.root[data-sape] {
    --header-height: 64px;
}

.lg-up .root[data-sape] {
    --header-height: 80px;
}

.root[data-sape] {
    min-height: calc(100vh - var(--header-height));
    isolation: isolate;
}

.tablist[data-sape] {
    --height: 56px;
    height: var(--height);
    display: flex;
    background: var(--theme-background);
    position: sticky;
    isolation: isolate;
    contain: content;
    z-index: 10;
}

.md-up .tablist[data-sape] {
    --height: 48px;
}

.tablist[data-sape]::before {
    height: 2.5px;
    width: 50%;
    bottom: 0;
    top: auto;
    border-radius: 4px;
    transition: 0.25s transform ease-in-out;
    transform: translate3d(var(--transform), 0, 0);
    z-index: 1;
}

.tablist[data-sape]::after {
    opacity: 0.1;
    border-bottom: 0.75px solid currentColor;
}

.tabctrl[data-sape] {
    transform: scale3d(0.875, 0.875, 1);
}

.tabctrl[data-sape].__selected {
    transform: scale3d(1, 1, 1);
}

.tabctrl-text[data-sape] {
    font-weight: normal;
    opacity: 0.8;
    transition: 0.15s opacity linear;
    font-size: 1rem;
}

.tabctrl-text[data-sape].__selected {
    opacity: 1;
    font-weight: 500;
}
</style>
