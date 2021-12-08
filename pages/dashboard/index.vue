<template>
    <div class="grid gap-y-6">
        <div class="card mx-6 px-6">
            <div
                class="subtitle uppercase text-[0.8rem]"
            >Total {{ userInfo.isBuyer ? 'deposit' : 'income' }}</div>
            <div
                class="title lead-title fill-before flex justify-between items-end"
            >{{ availableAmount }}</div>

            <div class="uppercase subtitle text-[0.8rem] mt-6">Available Coins</div>

            <div
                v-for="(item, i) in coins"
                :key="i"
                class="grid grid-flow-col grid-cols-[auto,1fr,auto] gap-x-3 items-center"
                :class="[
                {
                    'mt-6': i == 0,
                    'mb-6': i != 4,
                    'pb-7 relative fill-before before:border-b before:border-black dark:before:border-white before:opacity-10': i == 4 && isBuyer,
                }]"
            >
                <div :class="[item.color]" class="flex">
                    <ui-icon name="ring" />
                </div>

                <div
                    class="font-medium text-lg bg-opacity-80"
                    :class="[
                        { 'line-through opacity-60': availableCoins[i] == '¢0' }
                    ]"
                >{{ item.title }}</div>

                <div class="subtitle text-sm">{{ availableCoins[i] }}</div>
            </div>

            <div
                v-if="isBuyer"
                class="grid gap-3 mt-7 grid-cols-[repeat(auto-fill,minmax(170px,1fr))]"
            >
                <ui-btn
                    class="rounded-sm px-5 h-[48px] bg-blue-800 dark:bg-blue-400 text-white bg-opacity-100 dark:bg-opacity-20 hover:bg-opacity-35 dark:hover:bg-opacity-35 gap-x-1 hover:bg-opacity-100 dark:hover:bg-opacity-80 hover:text-white hover:bg-opacity-35 dark:hover:bg-opacity-35 w-full text-md"
                    title="deposit"
                    to="/dashboard/deposit"
                    tag="nuxt-link"
                >
                    <ui-icon name="plus" size="28px"></ui-icon>Deposit coins
                </ui-btn>

                <ui-btn
                    v-if="showClearBtn"
                    class="rounded-sm px-5 h-[48px] bg-red-800 dark:bg-red-400 bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-100 dark:hover:bg-opacity-80 hover:bg-opacity-35 dark:hover:bg-opacity-35 gap-x-1 w-full opacity-80 text-red-900 dark:text-red-200 hover:opacity-100 hover:text-white text-md"
                    title="clear"
                    to="/dashboard/reset-deposit"
                    tag="nuxt-link"
                >
                    <ui-icon name="delete" size="28px"></ui-icon>Clear coins
                </ui-btn>
            </div>
        </div>

        <div
            v-if="products"
            class="card lg:mx-6 max-w-[100vw] lg:max-w-[calc(calc(min(100vw,1920px)-3rem)-280px)] lg:bg-opacity-100 bg-opacity-0 dark:bg-opacity-0 lg:dark:bg-opacity-50"
        >
            <div class="subtitle px-6">New products added</div>

            <div class="title lead-subtitle fill-before px-6">Peep the store</div>

            <div
                class="mt-6 grid gap-3 sm:gap-4 md:gap-6 overflow-x-scroll overflow-y-hidden grid-cols-[repeat(10,auto),1px] w-full pl-6 pb-2 hide-scrollbar after:contents after:w-full"
            >
                <uiBtn
                    v-for="(product, i) in products"
                    :key="i"
                    class="w-[calc(100vw-3rem)] sm:w-[min(calc(100vw-3rem),350px)] bg-white dark:bg-blue-gray-900 bg-opacity-100 dark:bg-opacity-50 rounded-sm pb-6 cursor-pointer hover:bg-blue-gray-50 dark:hover:bg-opacity-90 grid-flow-row p-0 text-left justify-stretch font-normal"
                    :class="{ 'mr-6': i == products.length - 1 }"
                    tag="nuxt-link"
                    :to="`/dashboard/shop?id=${product.id}`"
                    outlined
                    :outlined-opacity="$theme.dark ? '0.075' : '0.1'"
                    :outlined-stroke="$theme.dark ? '.75px' : '1px'"
                >
                    <div
                        class="h-[300px] w-full hover:scale-[1.01] transform-gpu transition-transform"
                    >
                        <app-img
                            :public-id="product.background"
                            class="h-full object-cover w-full"
                        />
                    </div>

                    <div class="px-4 pt-2">
                        <div class="flex justify-between items-center">
                            <div
                                class="text-opacity-70 text-black dark:text-opacity-70 dark:text-white text-sm capitalize"
                            >{{ product.type }}</div>

                            <div class="font-semibold">¢{{ product.cost }}</div>
                        </div>
                    </div>

                    <div
                        class="font-bold text-xl px-4 mt-1 truncate capitalize"
                    >{{ product.productName }}</div>

                    <app-rating class="mx-3 mt-2" readonly />
                </uiBtn>
            </div>
        </div>
    </div>
</template>

<script>
import UiIcon from '~/components/uiIcon.vue';
import AppRating from '~/components/appRating.vue';

export default {
    components: { UiIcon, AppRating },

    data: () => ({
        coins: [
            {
                title: '100 Cents',
                color: 'text-amber-600 dark:text-amber-500'
            },
            {
                title: '50 Cents',
                color: 'text-pink-700 dark:text-pink-600'
            },
            {
                title: '20 Cents',
                color: 'text-blue-600 dark:text-blue-500'
            },
            {
                title: '10 Cents',
                color: 'text-red-600 dark:text-red-500'
            },
            {
                title: '5 Cents',
                color: 'text-teal-600 dark:text-teal-500'
            }
        ],
        products: null,
    }),
    head() {
        return {
            title: 'Overview'
        }
    },
    computed: {
        showClearBtn() {
            return !/^¢0/.test(this.availableAmount)
        },
        userInfo() {
            return this.$store.getters.userInfo
        },
        isBuyer() {
            return this.userInfo.isBuyer
        },
        availableAmount() {
            const userInfo = this.userInfo;

            return (userInfo[userInfo.isBuyer ? 'depositTotal' : 'incomeTotal'] || 0)
        },
        availableCoins() {
            const userInfo = this.userInfo
            return Object.entries(userInfo[userInfo.isBuyer ? 'deposit' : 'income'] || {}).reverse().map(entry => {
                const coin = entry[0];
                const qty = entry[1]

                const value = ((coin * qty));

                return value > 99 ? `$${(value / 100).toFixed(2)}` : `¢${value}`
            })
        }
    },
    async created() {
        const { data } = await this.$apiCall('product/all?limit=10', 'GET')

        if (data) {
            this.products = data
        }
    }
}
</script>


<style>
</style>