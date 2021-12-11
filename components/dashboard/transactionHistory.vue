<template>
    <div class="card mx-6 shadow-md dark:shadow-none">
        <div
            class="subtitle uppercase text-[0.8rem] px-6"
        >Total {{ userInfo.isBuyer ? 'deposit' : 'income' }}</div>

        <!-- header -->
        <div
            class="title lead-title fill-before grid md:flex md:justify-between items-center px-6 pb-6 before:border-dotted relative"
        >
            <div>
                <span :key="showBalanceIcon" class="fade-appear inline-block">{{ availableAmount }}</span>

                <ui-btn
                    class="ml-1 min-h-[38px]"
                    :title="showBalance ? 'hide balance' : 'show balance'"
                    @click="$toggleShowBalance"
                >
                    <ui-icon :name="showBalanceIcon" size="18" />
                </ui-btn>
            </div>

            <div
                class="grid gap-3 grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:grid-cols-[initial] md:grid-flow-col flex-grow justify-end mt-6 md:mt-0"
            >
                <ui-btn
                    class="rounded-sm px-5 h-[48px] bg-opacity-100 dark:bg-opacity-20 hover:bg-opacity-35 dark:hover:bg-opacity-35 gap-x-1 hover:bg-opacity-100 dark:hover:bg-opacity-80 hover:text-white hover:bg-opacity-35 dark:hover:bg-opacity-35 w-full text-md"
                    :class="{
                        'bg-blue-800 dark:bg-blue-400 text-white': !disableWithdraw,
                        'opacity-60': disableWithdraw
                    }"
                    :title="isBuyer ? 'deposit coin(s)' : 'withdraw your income'"
                    :to="isBuyer ? `/dashboard/deposit` : '/dashboard'"
                    :disabled="disableWithdraw"
                >
                    <ui-icon :name="isBuyer ? 'deposit' : 'withdraw'" size="28px"></ui-icon>
                    {{ isBuyer ? 'Deposit coins' : 'Instant withdrawal' }}
                </ui-btn>

                <ui-btn
                    v-if="showResetButton"
                    class="rounded-sm px-5 h-[48px] bg-red-800 dark:bg-red-400 bg-opacity-20 dark:bg-opacity-10 hover:bg-opacity-100 dark:hover:bg-opacity-80 hover:bg-opacity-35 dark:hover:bg-opacity-35 gap-x-1 w-full opacity-80 text-red-900 dark:text-red-200 hover:opacity-100 hover:text-white text-md"
                    title="reset coin"
                    to="/dashboard/reset-deposit"
                    tag="nuxt-link"
                >
                    <ui-icon name="delete" size="28px"></ui-icon>Reset coins
                </ui-btn>
            </div>
        </div>
        <!-- header ends -->

        <p class="uppercase subtitle text-[0.75rem] mt-6 mb-3 px-6 text-center">{{ tableCaption }}</p>

        <div class="overflow-x-auto w-full">
            <div
                v-if="loading || errorFetching.message"
                class="card min-h-[128px] grid justify-center items-center mx-6"
                :class="{ 'bg-white shadow-sm': $theme.light }"
            >
                <div v-if="loading" class="spinner-border"></div>

                <div v-else class="grid justify-items-center">
                    <p class="mb-3">
                        {{
                            getErrorMessage
                        }}
                    </p>

                    <ui-btn
                        v-if="showRetryButton"
                        class="bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 dark:bg-blue-500 dark:text-black dark:hover:bg-blue-600 dark:hover:bg-opacity-70 dark:active:bg-blue-700 dark:active:bg-opacity-60"
                    >Retry</ui-btn>
                </div>
            </div>

            <table v-else class="w-full" :aria-label="tableCaption.toLowerCase()">
                <thead
                    class="bg-white dark:bg-blue-gray-900 dark:bg-opacity-80 border-t border-b border-solid border-black dark:border-white border-opacity-[0.05] dark:border-opacity-[0.05] w-full text-left"
                >
                    <tr class="min-h-[48px] h-[48px]">
                        <th v-for="(th, i) in tableHead" :key="i">
                            <div class="px-6">{{ th }}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(transaction, i) in transactionHistory"
                        :key="i"
                        class="fade-appear bg-white dark:bg-blue-gray-900 bg-opacity-0 dark:bg-opacity-0 hover:odd:bg-opacity-20 dark:hover:odd:bg-opacity-20 hover:even:bg-opacity-80 dark:hover:even:bg-opacity-70 even:bg-opacity-60 dark:even:bg-opacity-50"
                    >
                        <td>
                            <div class="grid grid-flow-col gap-x-3 py-4 px-6 justify-start">
                                <div>{{ getDate(transaction.timestamp) }}</div>
                            </div>
                        </td>

                        <td>
                            <div class="py-4 px-6 capitalize">
                                <span
                                    class="rounded-full bg-opacity-75 dark:bg-opacity-75 text-[0.8rem] py-1 px-2 whitespace-nowrap"
                                    :class="{
                                        'bg-green-800 text-white': transaction.type == 'deposit',
                                        'bg-yellow-500 text-black': transaction.type == 'purchase',
                                        'bg-red-800 text-white': transaction.type == 'reset'
                                    }"
                                >{{ transaction.type }}</span>
                            </div>
                        </td>

                        <td>
                            <div class="py-4 px-6">{{ transaction.amount }}</div>
                        </td>

                        <td>
                            <div
                                class="opacity-80 text-[0.875rem] py-4 px-6 whitespace-nowrap"
                            >{{ transaction.quantity }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import UiIcon from '~/components/uiIcon.vue';

export default {
    components: { UiIcon },

    data: () => ({
        tableHead: [
            'Date',
            'Type',
            'amount',
            'Quantity',
        ],
        transactionHistory: [],
        loading: true,
        errorFetching: {
            message: '',
            status: null
        },
    }),
    computed: {
        tableCaption() {
            return `Recent ${this.isBuyer ? 'transaction' : 'purchase'}${this.transactionHistory.length > 1 ? 's' : ''}`
        },
        showBalance() {
            return this.$store.state.showBalance
        },
        showBalanceIcon() {
            return this.showBalance ? 'eyeOff' : 'eye'
        },
        showResetButton() {
            return !/^¢0/.test(this.availableAmount) && this.isBuyer
        },
        userInfo() {
            return this.$store.getters.userInfo
        },
        isBuyer() {
            return this.userInfo.isBuyer
        },
        availableAmount() {
            const userInfo = this.userInfo;

            const availableAmount = (userInfo[userInfo.isBuyer ? 'depositTotal' : 'incomeTotal'] || 0)

            if (!this.showBalance) {
                return '*'.repeat(5)
            }

            return availableAmount
        },
        availableCoins() {
            const userInfo = this.userInfo
            return Object.entries(userInfo[userInfo.isBuyer ? 'deposit' : 'income'] || {}).reverse().map(entry => {
                const coin = entry[0];
                const qty = entry[1]

                const value = ((coin * qty));

                return value > 99 ? `$${(value / 100).toFixed(2)}` : `¢${value}`
            })
        },
        disableWithdraw() {
            return !this.isBuyer && !parseFloat(this.userInfo.income || 0)
        },
        // notFound() {
        //     return this.errorFetching.status == 404
        // },
        getErrorMessage() {
            return this.errorFetching.message;
        },
        showRetryButton() {
            return parseFloat(this.errorFetching.status || 0) >= 500
        }
    },
    async created() {
        await this.getTransactions();
    },
    async activated() {
        await this.getTransactions()
    },

    methods: {
        async getTransactions() {
            this.loading = true;

            const { data } = await this.$apiCall('transaction?limit=5')

            if (data?.length) {
                this.transactionHistory = data;
            } else if (data && !data.length) {
                this.errorFetching = {
                    message: 'You have no recent transaction',
                    status: 404
                }
            } else {
                this.errorFetching.message = 'An error occured'
            }

            this.loading = false;
        },
        getDate(timestamp) {
            return new Date(parseFloat(timestamp)).toLocaleDateString()
        }
    }
}
</script>

<style>
</style>