<template>
    <nav
        ref="root"
        class="root fill-before before:border-r-[1px] before:border-black dark:before:border-white before:opacity-[.1] h-full fixed left-0 dark:bg-blue-gray-900 lg:dark:bg-opacity-40 bg-white outline-none"
        :class="isMiniDevice ? ['transition-transform transform-gpu left-0 pb-[64px] top-0 z-20', {
            'translate-x-[-100%]': !mobileNav,
            'translate-x-0': mobileNav
        }] : []"
        :tabindex="isMiniDevice && mobileNav ? '0' : undefined"
        @keydown="hackFocus"
        @keyup="closeOnEsc"
    >
        <div
            ref="scroll"
            class="w-[280px] pb-[64px] overscroll-contain max-h-[100vh] overflow-y-auto hide-scrollbar"
        >
            <div class="h-[96px] w-100 flex items-center justify-start px-4">
                <app-img :public-id="media.favIco" height="38px" width="38px" />

                <p class="ml-1 cursive-text">Vending app</p>
            </div>

            <ui-btn
                class="rounded-md h-[72px] w-[calc(100%-3rem)] bg-blue-gray-100 dark:bg-blue-gray-800 mx-auto grid grid-flow-col grid-cols-[60px,1fr] py-2 px-4 items-center cursor-pointer hover:bg-blue-gray-200 dark:hover:bg-blue-gray-800 justify-start text-left"
                :title="`${user.role} account`"
                to="/dashboard/account"
                outlined
                :outlined-opacity="0.05"
                :outlined-stroke="'0.5px'"
            >
                <div
                    class="h-[48px] w-[48px] rounded-full bg-blue-gray-400 overflow-hidden mr-[10%]"
                >
                    <app-img
                        :public-id="userImage"
                        height="48px"
                        width="48px"
                        radius="max"
                        fetch-format="auto"
                        quality="100"
                        class="object-cover"
                    />
                </div>

                <div class="overflow-hidden">
                    <h2
                        class="dark:text-white text-black font-semibold text-[0.9rem] capitalize truncate"
                    >{{ user.displayName || user.username }}</h2>
                    <h3
                        class="dark:text-white text-black font-normal text-sm text-opacity-50 dark:text-opacity-50 truncate"
                    >@{{ user.username }}</h3>
                </div>
            </ui-btn>

            <div
                class="fill-before before:border-t before:border-black dark:before:border-white before:opacity-10 w-full h-[fit-content] relative mt-8"
            >
                <div class="grid">
                    <h4
                        class="uppercase font-medium text-black dark:text-white text-opacity-50 dark:text-opacity-50 text-[0.75rem] mt-[32px] px-8 mb-2"
                    >General</h4>

                    <ui-btn
                        v-for="(item, i) in generalLinks"
                        :key="i"
                        class="h-[42px] w-10/12 mx-auto mb-1 justify-start gap-x-2 text-[0.9rem] rounded-sm bg-opacity-10 dark:bg-opacity-10 hover:before:bg-teal-500 dark:hover:before:bg-teal-300"
                        :class="{
                            'bg-teal-500 dark:bg-teal-300 text-teal-800 dark:text-teal-400 opacity-100': item.isActive,
                            'opacity-70': !item.isActive
                        }"
                        tag="nuxt-link"
                        :to="item.to"
                    >
                        <ui-icon :name="item.icon" size="20px" />
                        {{
                            item.title
                        }}
                    </ui-btn>
                </div>

                <div class="grid">
                    <h4
                        class="uppercase font-medium text-black dark:text-white text-opacity-50 dark:text-opacity-50 text-[0.75rem] mt-[32px] px-8 mb-2"
                    >Management</h4>

                    <div class="mx-auto mb-1 w-10/12">
                        <ui-btn
                            v-for="(item, i) in managementLinks.collapse"
                            :key="i"
                            class="h-[42px] w-full justify-start gap-x-2 text-[0.9rem] rounded-sm bg-opacity-10 dark:bg-opacity-10 grid-cols-[auto,1fr,auto] justify-items-start hover:before:bg-teal-500 dark:hover:before:bg-teal-300"
                            :class="{
                                'bg-teal-500 dark:bg-teal-300 text-teal-800 dark:text-teal-400 opacity-100': item.isActive,
                                'opacity-70': !item.isActive,
                            }"
                            @click="ordersState = !ordersState"
                        >
                            <ui-icon :name="item.icon" size="20px" />
                            {{
                                item.title
                            }}
                            <ui-icon
                                :key="ordersState"
                                :name="ordersState ? 'chevronUp' : 'chevronDown'"
                                size="20px"
                            />
                        </ui-btn>

                        <div
                            class="grid overflow-hidden justify-items-end"
                            :style="{
                                height: ordersState ? '135px' : '0',
                                transition: '0.15s ease-in-out height, 0.15s linear opacity',
                                opacity: ordersState ? '1' : '0'
                            }"
                        >
                            <ui-btn
                                v-for="(item, i) in 
                            managementLinks.collapse[0].children"
                                :key="i"
                                class="h-[42px] w-11/12 justify-start gap-x-2 text-[0.9rem] rounded-sm bg-opacity-10 dark:bg-opacity-10 hover:before:bg-teal-500 dark:hover:before:bg-teal-300 pl-6"
                                :class="{
                                    'bg-teal-500 dark:bg-teal-300 text-teal-800 dark:text-teal-400 opacity-100': item.isActive,
                                    'opacity-70': !item.isActive,
                                    'grid-cols-[auto,1fr,auto] justify-items-start': item.collapse,
                                    'mt-[8px]': i == 0
                                }"
                                tag="nuxt-link"
                                :to="item.to"
                                :disabled="!ordersState"
                            >{{ item.title }}</ui-btn>
                        </div>
                    </div>

                    <ui-btn
                        v-for="(item, i) in managementLinks.generic"
                        :key="i"
                        class="h-[42px] w-10/12 mx-auto mb-1 justify-start gap-x-2 text-[0.9rem] rounded-sm bg-opacity-10 dark:bg-opacity-10 hover:before:bg-teal-500 dark:hover:before:bg-teal-300"
                        :class="{
                            'bg-teal-500 dark:bg-teal-300 text-teal-800 dark:text-teal-400 opacity-100': item.isActive,
                            'opacity-70': !item.isActive,
                            'grid-cols-[auto,1fr,auto] justify-items-start': item.collapse
                        }"
                        tag="nuxt-link"
                        :to="item.to"
                    >
                        <ui-icon :name="item.icon" size="20px" />
                        {{
                            item.title
                        }}
                    </ui-btn>
                </div>

                <div
                    class="grid mt-[32px] relative fill-before before:border-t before:border-black dark:before:border-white before:opacity-10"
                >
                    <ui-btn
                        class="h-[42px] w-10/12 mx-auto mb-1 justify-start gap-x-2 text-[0.9rem] rounded-sm hover:before:bg-red-900 dark:hover:before:bg-red-700 mt-[32px] border border-red-600 dark:border-red-400 bg-red-700 dark:bg-red-600 bg-opacity-40 hover:text-white hover:bg-opacity-100 dark:bg-opacity-25"
                        tag="nuxt-link"
                        @click.native="logout"
                    >
                        <ui-icon name="powerOff" size="20px" />Logout
                    </ui-btn>
                </div>
            </div>
        </div>

        <ui-btn
            v-if="isMiniDevice"
            class="absolute mt-6 mr-3 mb-[64px] bg-red-700 dark:bg-red-600 bg-opacity-10 dark:bg-opacity-10 hover:bg-opacity-80 dark:hover:bg-opacity-60 top-0 right-0 z-[2] rounded-full w-[42px] h-[42px] p-0"
            title="close nav"
            @click="closeNav"
        >
            <ui-icon name="windowClose" />
        </ui-btn>
    </nav>
</template>
    
    <script>
import appImg from '../appImg.vue'
import UiBtn from '../UiBtn.vue';
import { eventKey, hackTabKey } from '~/utils/main';
import { ControlledFocus } from '~/utils/controlledFocus';
export default {
    components: { appImg, UiBtn },

    props: {
        miniDevice: Boolean,
        mobileNav: Boolean,
        closeNav: {
            type: Function,
            default: () => { }
        }
    },

    data: () => ({
        ordersState: false
    }),

    computed: {
        media() {
            return this.$store.state.media
        },
        isMiniDevice() {
            return this.miniDevice
        },

        userImage() {
            return this.user.image || '/samples/people/boy-snow-hoodie'
        },

        generalLinks() {
            const route = this.$route;

            const match = (path) => {
                const regExp = new RegExp(`^/dashboard/${path}/?`)

                return regExp.test(route.path);
            }

            const to = path => `/dashboard/${path}`

            return [
                {
                    title: 'Overview',
                    isActive: /^\/dashboard\/?$/.test(route.path),
                    icon: 'home',
                    to: `${to('')}`
                },
                {
                    title: 'Analytics',
                    isActive: match('analytics'),
                    icon: 'pieChart',
                    to: `${to('analytics')}`
                },
                this.isBuyer && {
                    title: 'Shop',
                    isActive: match('shop'),
                    icon: 'basket',
                    to: `${to('shop')}`
                },
                {
                    title: 'Finance',
                    isActive: match('finance'),
                    icon: 'finance',
                    to: `${to('finance')}`
                },
                {
                    title: 'Account',
                    isActive: match('account'),
                    icon: 'accountCircle',
                    to: `${to('account')}`
                }
            ].filter(Boolean)
        },

        managementLinks() {
            const route = this.$route;

            const match = (path) => {
                const regExp = new RegExp(`^/dashboard/${path}/?`)

                return regExp.test(route.path);
            }

            const to = path => `/dashboard/${path}`

            const buyerGeneric = [
                {
                    title: 'Deposit coins',
                    isActive: match('deposit'),
                    icon: 'deposit',
                    to: `${to('deposit')}`
                },
                {
                    title: 'Reset deposit',
                    isActive: match('reset-deposit'),
                    icon: 'timelineClock',
                    to: `${to('reset-deposit')}`
                },
            ]

            const sellerGeneric = [
                {
                    title: 'Create a product',
                    isActive: match('create-product'),
                    icon: 'deposit',
                    to: `${to('create-product')}`
                },
                {
                    title: 'My products',
                    isActive: match('my-products'),
                    icon: 'fileChart',
                    to: `${to('my-products')}`
                },
            ]

            return {
                collapse: [{
                    title: 'Orders',
                    isActive: this.ordersState,
                    icon: 'storeCog',
                    collapse: true,
                    children: [
                        {
                            title: 'List',
                            isActive: match('orders/list'),
                            to: `${to('orders/list')}`
                        },
                        {
                            title: 'Details',
                            isActive: match('orders/details'),
                            to: `${to('orders/details')}`
                        },
                        {
                            title: 'Clear orders',
                            isActive: match('orders/clear-orders'),
                            to: `${to('orders/clear-orders')}`
                        },

                    ]
                }],
                generic: [
                    {
                        title: 'Transactions',
                        isActive: match('transactions'),
                        icon: 'history',
                        to: `${to('transactions')}`
                    },

                    ...(this.user.role == 'buyer' ? buyerGeneric : sellerGeneric)
                ]
            }
        },

        user() {
            return this.$store.state.user || {}
        },

        isBuyer() { return this.user.role == 'buyer' }
    },

    watch: {
        async mobileNav(n) {
            if (n && this.miniDevice) {
                await this.$sleep(50)

                document.documentElement.classList.add('overlay-active')

                this.$refs.scroll.scrollTo(0, 0)

                this.$refs.root.focus()
            } else {
                document.documentElement.classList.remove('overlay-active')
            }
        },

    },

    methods: {
        async logout() {

            await this.$dispatch('logout')

            requestAnimationFrame(() => {
                this.$router.replace('/?login=true')
            })
        },

        hackFocus(e) {

            if (!this.miniDevice || !this.mobileNav) {
                return
            }

            const key = eventKey(e);

            if (key == "esc") {
                return e.preventDefault();
            }


            hackTabKey(e, (_, evtKey) => {
                let controlledFocus = new ControlledFocus({
                    root: e.currentTarget,
                    children: "*",
                    uid: this._uid,
                });

                controlledFocus[e.shiftKey ? "backward" : "forward"]();

                controlledFocus.destroy();

                controlledFocus = 0;
            });

        },

        closeOnEsc(e) {
            const key = eventKey(e);

            if (key == 'esc') {
                return this.closeNav()
            }
        }
    }


}
</script>

    
    <style>
.root:not(:hover)::-webkit-scrollbar-thumb {
    background-color: transparent;
}
</style>