<template>
    <article class="w-100 grid grid-cols-1 fade-appear" :class="{ invisible: !user }">
        <div
            v-if="renderBackdrop"
            class="h-full w-full fixed top-0 left-0 bg-black transition-opacity z-20 fade-appear"
            :class="{
                'opacity-1': backdropValue,
                'opacity-0': !backdropValue,
                'pointer-events-none': !backdropValue,
                'bg-opacity-50': !isProcessing,
                'bg-opacity-70': isProcessing
            }"
            @click="hideBackdrop"
        >
            <process-dialog />
        </div>

        <sideNav
            :key="miniDevice"
            :mini-device="miniDevice"
            :mobile-nav="mobileNav"
            :close-nav="closeNav"
        />

        <div
            class="mr-0 mx-0 w-full xl:mr-auto lg:max-w-[calc(100%-280px)] lg:mr-0 lg:ml-[280px] grid justify-center relative"
        >
            <Header v-if="!errorPage || miniDevice" class="fixed top-0 z-10" :raise="raiseHeader" />

            <ui-intersection @on-update="intersectionUpdated">
                <div class="h-[1px] w-full absolute invisible" aria-hidden="true"></div>
            </ui-intersection>

            <div
                :key="$route.path"
                class="grid gap-y-6 w-screen content-start lg:w-[calc(100vw-280px)] xl:w-[calc(calc(min(100vw,1920px)-3rem)-280px)] max-w-full fade-appear pb-10"
                :class="{
                    'mt-[80px] lg:mt-[100px]': !errorPage,
                    'invisible': !authenticated
                }"
            >
                <div v-if="!errorPage" class="grid grid-flow-col justify-between px-6">
                    <h2 class="text-3xl font-bold tracking-tight">{{ pageTitle }}</h2>
                </div>

                <p
                    v-if="!showDeposit && !errorPage"
                    class="px-6 font-semibold opacity-70 text-sm flex items-center"
                >
                    Total deposit:
                    <span
                        :key="showBalanceIcon"
                        class="ml-2 fade-appear inline-block"
                    >{{ totalDeposit }}</span>

                    <ui-btn
                        class="ml-1 min-h-[38px]"
                        :title="showBalance ? 'hide balance' : 'show balance'"
                        @click="$toggleShowBalance"
                    >
                        <ui-icon :name="showBalanceIcon" size="18" />
                    </ui-btn>
                </p>

                <ul
                    v-if="breadcrumbs && showTitle && !errorPage"
                    class="grid grid-flow-col justify-start ml-6"
                >
                    <li
                        v-for="(path,i) in breadcrumbs"
                        :key="i"
                        class="flex justify-between items-center text-[0.925rem]"
                    >
                        <nuxt-link
                            :disabled="path.active"
                            :tabindex="path.active ? '-1' : undefined"
                            :to="path.to"
                            class="hover:underline"
                            :class="[
                            {
                                'font-light opacity-70 text-[0.8rem]': path.active
                            }]"
                        >{{ path.title }}</nuxt-link>
                        <div v-if="i < breadcrumbs.length - 1" class="mx-3 opacity-40">•</div>
                    </li>
                </ul>

                <!-- banner -->
                <div
                    v-if="showBanner"
                    class="rounded-md bg-gradient-to-b md:bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-600 text-white dark:text-blue-gray-900 p-8 grid md:grid-flow-col md:grid-cols-[auto 1fr] justify-start gap-x-4 mx-6 fade-slide-y-appear"
                    style="--slide-y:10px;--appear-duration:150ms;"
                >
                    <div class="w-[200px] h-[200px] mx-auto">
                        <app-img width="200px" height="200px" :public-id="media.welcome" />
                    </div>

                    <div>
                        <div
                            class="bg-teal-600 font-medium text-white dark:text-black rounded-lg h-[32px] px-[10px] inline-grid place-items-center text-sm mb-4"
                        >New</div>

                        <h3 class="text-lg font-bold mb-2">Welcome to the Vending app</h3>
                        <h4
                            class="mb-8 text-[0.95rem] font-medium text-opacity-70 dark:text-opacity-80 text-white dark:text-blue-gray-900"
                        >Your dashboard has been improved! Explore features like Orders, Account, Transactions and more.</h4>

                        <ui-btn
                            class="bg-teal-600 px-4 text-white dark:text-black rounded-sm"
                            @click="closeBanner"
                        >Dismiss banner</ui-btn>
                    </div>
                </div>
                <!-- banner end-->

                <nuxt-child :key="$route.fullPath" />

                <div
                    class="z-10 fixed h-full bottom-0 pointer-events-none grid items-end md:max-w-full mx-auto justify-center left-0 lg:left-[280px] w-full lg:w-[calc(100vw-280px)]"
                >
                    <transition name="anim-slide-y" type="animation" mode="out-in">
                        <div
                            v-if="notifyMessage"
                            :key="notify.key + $route.path"
                            class="border p-6 rounded-md my-6 mx-8 pointer-events-auto w-[min(calc(100vw-2rem),450px)] text-black text-opacity-80 shadow-lg grid grid-cols-[1fr,auto] gap-x-2"
                            :class="{
                                'transition-opacity opacity-0': !notifyMessage,
                                'border-green-400 dark:border-green-200 bg-green-500 dark:bg-green-300': !notify.error && !notify.warn,
                                'border-red-400 dark:border-red-200 bg-red-500 dark:bg-red-300': notify.error,
                                'border-amber-400 dark:border-amber-200 bg-amber-500 dark:bg-amber-300': notify.warn
                            }"
                        >
                            {{ caps(notifyMessage) }}
                            <div class="grid gap-y-2">
                                <ui-btn
                                    class="rounded-sm"
                                    :class="[{
                                        'p-0 w-[48px] h-[48px] rounded-full text-opacity-80': !notify.closeText,
                                        'text-sm': notify.closeText,
                                        'bg-amber-700 dark:bg-amber-500 bg-opacity-50 dark:bg-opacity-50': notify.closeText && notify.warn,
                                        'bg-red-700 dark:bg-red-500 bg-opacity-50 dark:bg-opacity-50': notify.closeText && notify.error
                                    }]"
                                    @click="notificationPrimaryAction"
                                >
                                    <ui-icon v-if="!notify.closeText" name="close" size="20px"></ui-icon>

                                    <template v-else>{{ notify.closeText }}</template>
                                </ui-btn>
                                <ui-btn
                                    v-if="notify.closeText"
                                    class="rounded-sm text-sm"
                                    @click="closeNotification"
                                >Cancel</ui-btn>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import SideNav from '~/components/dashboard/sideNav.vue'
import ProcessDialog from '~/components/dashboard/processDialog.vue'
import Header from '~/components/dashboard/header.vue';
import { capitalize } from '~/utils/main';
import UiIcon from '~/components/uiIcon.vue';

export default {
    name: 'DashboardPage',
    components: { SideNav, Header, UiIcon, ProcessDialog },

    data: () => ({
        authenticated: false,
        raiseHeader: false,
    }),

    computed: {
        showBalance() {
            return this.$store.state.showBalance
        },
        showBalanceIcon() {
            return this.showBalance ? 'eyeOff' : 'eye'
        },
        userInfo() {
            return this.$store.getters.userInfo
        },
        isBuyer() {
            return this.userInfo.isBuyer
        },
        totalDeposit() {
            const userInfo = this.userInfo;

            const availableAmount = (userInfo[userInfo.isBuyer ? 'depositTotal' : 'incomeTotal'] || 0)

            if (!this.showBalance) {
                return '*'.repeat(5)
            }

            return availableAmount
        },
        renderBackdrop() {
            return this.miniDevice || this.isProcessing
        },
        errorPage() {
            return this.$route.params.error
        },
        user() {
            return this.$store.state.user
        },
        showBanner() {
            if (!this.$store.state.bannerActive) { return false }

            return !/^\/dashboard\/(reset-deposit|shop|create-product)\/?$/.test(this.$route.path) && !this.errorPage
        },
        showDeposit() {
            return !/^\/dashboard\/(reset-deposit|shop)\/?$/.test(this.$route.path)
        },
        showTitle() {
            return !/^\/dashboard\/reset-deposit\/?$/.test(this.$route.path)
        },
        notify() {
            return this.$store.state.notify;
        },
        notifyMessage() {
            return this.notify.message
        },
        breadcrumbs() {
            const route = this.$route;

            if (/^\/dashboard\/?$/.test(route.path)) {
                return null
            }

            const output = []

            const splitPaths = route.fullPath.replace(/\?.+=|&.+=/g, '/').split('/').filter(Boolean)

            splitPaths.forEach((path, i, arr) => {

                let title = path;

                if (/^p-/.test(title)) {
                    title = this.$store.state.productName || 'loading title'
                } else {
                    title = title.replace(/-/g, ' ')
                }


                output.push({
                    title: capitalize(title),
                    active: i == arr.length - 1,
                    to: `/${splitPaths.filter((_, key) => key - 1 < i).join('/')}`
                })
            });

            return output;
        },
        miniDevice() {
            if (this.$c4.mounted)
                return /xxs|xs|sm|md/.test(this.$store.state.breakpoints.is);

            return false
        },
        mobileNav() {
            return this.$store.state.mobileNav && this.miniDevice
        },
        isProcessing() {
            return this.$store.state.dashboardProcessing
        },
        backdropValue() {
            if (this.mobileNav) {
                return 1
            }
            if (this.isProcessing) {
                return 1
            }
            return 0
        },
        media() {
            return this.$store.state.media
        },
        pageTitle() {
            const route = this.$route;

            const validRoutes = [
                {
                    active: /^\/dashboard\/?$/.test(route.path),
                    title: `Good ${this.$store.state.greeting}.`
                },
                {
                    active: /^\/dashboard\/deposit\/?$/.test(route.path),
                    title: `Deposit`
                },
                {
                    active: /^\/dashboard\/reset-deposit\/?$/.test(route.path),
                    title: `Reset deposit`
                },
                {
                    active: /^\/dashboard\/shop/.test(route.path),
                    title: `Shop`
                },
                {
                    active: /^\/dashboard\/create-product/.test(route.path),
                    title: `Create product`
                },
                {
                    active: /^\/dashboard\/my-products/.test(route.path) && !this.$route.query.edit,
                    title: `My products`
                },
                {
                    active: /^\/dashboard\/my-products/.test(route.path) && this.$route.query.edit,
                    title: `Edit product`
                }
            ]

            return validRoutes.find(x => x.active)?.title || 'Error'
        }
    },


    watch: {
        async notifyMessage(n) {
            const notify = this.notify;

            if (n && notify.timeout) {
                const key = notify.key;

                await this.$sleep(notify.timeout);

                if (key == this.notify.key) {
                    this.closeNotification()
                }
            }
        }
    },

    beforeMount() {
        this.redirectUnauthorized('buyer', ['create-product', 'my-products'])
        this.redirectUnauthorized('seller', ['deposit', 'reset',])

        this.$nextTick(() => {
            this.authenticated = true;
        })
    },

    async mounted() {

        await this.$sleep(500);

        if (this.user?.alert) {
            this.$commit('UPDATE_', {
                path: 'notify',
                value: {
                    message: this.user.alert,
                    warn: true,
                    closeText: 'End sessions',
                    callback: () => this.$logout(),
                    key: Date.now()

                }
            })
        }
    },

    methods: {
        async notificationPrimaryAction() {
            this.notify.closeText ? await this.notify.callback() : this.closeNotification()
        },

        hideBackdrop() {
            this.closeNav();

            this.$commit('UPDATE_', {
                path: 'dashboardProcessing',
                value: false
            })
        },
        intersectionUpdated(e) {
            this.raiseHeader = !e.isIntersecting
        },
        redirectUnauthorized(role, paths) {
            // redirect to 404 when user is accesses wrong routes;

            const route = this.$route

            if (this.user?.role == role) {
                const unauthorized = paths

                const isUnauthorized = unauthorized.find((x) => {
                    const regExp = new RegExp(`^/dashboard/${x}/?`)

                    return regExp.test(route.path)
                })

                if (isUnauthorized) {
                    return this.$router.replace('/dashboard/unauthorized')
                }
            }
        },
        caps(str) {
            return capitalize(str)
        },
        closeNav() {
            this.$commit('UPDATE_', { path: 'mobileNav', value: false })
        },
        async closeNotification() {
            await this.$sleep(200);

            this.$commit('UPDATE_', {
                path: 'notify',
                value: {
                    message: null,
                    key: Date.now()
                }
            })
        },
        closeBanner() {
            this.$commit('UPDATE_', {
                path: 'bannerActive',
                value: false
            })
        }
    }
}
</script>


