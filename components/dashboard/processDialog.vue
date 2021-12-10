<template>
    <div
        v-if="isProcessing"
        :key="processingDone.key"
        class="absolute w-full h-full grid justify-center"
        :class="{
            'items-start fade-appear': !isPurchasedDialog,
            'items-center anim-scale-enter-active': isPurchasedDialog
        }"
    >
        <div
            class="bg-white dark:bg-blue-gray-900 grid overflow-hidden isolate relative"
            :class="{
                'pt-4 rounded-b-sm grid-flow-col': !isPurchasedDialog,
                'p-6 rounded-md fill-before before-divide before:border min-w-[280px] sm:min-w-[320px] md:min-w-[350px]': isPurchasedDialog
            }"
        >
            <div
                class="grid start-center justify-center pl-6"
                :class="{
                    'text-green-700': !!processingDone && !processingDone.error,
                    'text-red-700': !!processingDone && processingDone.error,
                    'mb-3': isPurchasedDialog,
                    'mt-2': !isPurchasedDialog
                }"
            >
                <ui-icon
                    v-if="processingDone"
                    :name="processingDone.error ? 'close' : 'check'"
                    :size="isPurchasedDialog ? '56px' : undefined"
                ></ui-icon>
                <div v-else class="spinner-border"></div>
            </div>

            <div :class="{
                'text-center mb-1': isPurchasedDialog
            }">
                <p class="px-6 font-bold text-xl">
                    {{
                        processingDone.title
                    }}
                </p>
                <p
                    class="px-6 mb-6 opacity-80 text-sm mt-1"
                    :class="{
                        'pr-12': !!processingDone && !isPurchasedDialog
                    }"
                >
                    {{
                        processingDone.subtitle
                    }}
                </p>
            </div>

            <div
                v-if="isPurchasedDialog"
                style="background-color: var(--theme-background);"
                class="rounded-sm border-[1.5px] border-dashed border-blue-700 dark:border-blue-500 border-opacity-25 dark:border-opacity-25 mx-3 py-3"
            >
                <p v-if="changeTotal" class="font-bold px-3">Your change</p>

                <div v-if="changeTotal" class="my-3 px-4">
                    <div
                        v-for="(change, i) in purchasedChange"
                        :key="i"
                        class="grid grid-flow-col grid-cols-[auto,1fr,auto] items-center gap-x-2 text-sm opacity-75 mb-1"
                    >
                        <p>¢{{ change.key }}</p>

                        <span class="h-[1px] w-full border-t border-dotted dark:opacity-20"></span>

                        <p class="opacity-80">{{ change.value }}</p>
                    </div>
                </div>

                <p
                    class="text-[0.8rem] opacity-60"
                    :class="{
                        'fill-before before-divide before:border-t relative before:opacity-20 dark:before:10 py-3 px-4 pb-0 ': changeTotal,
                        'text-center': !changeTotal
                    }"
                >{{ totalChangeAlert }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { formatAmount } from '~/utils/main';

export default {
    computed: {
        totalChangeAlert() {
            const changeTotal = this.changeTotal

            if (!changeTotal) {
                return 'You have no change left.'
            }

            return `You have a total of ${this.formatCoin(changeTotal)} left`
        },
        changeTotal() {
            return parseFloat(this.processingDone.changeTotal)
        },
        purchasedChange() {
            const change = this.processingDone.change
            if (!Array.isArray(change)) {
                return {}
            }

            const output = {};

            // group coins
            change.forEach(coin => {
                if (!output[coin]) {
                    return (output[coin] = 1)
                }

                output[coin]++
            })

            // return product's entries, so it can be sorted from highest.
            const sortOutput = Object.entries(output).map((entry) => {
                const key = parseFloat(entry[0]);
                const entryValue = entry[1]
                const value = `${entryValue} piece${entryValue > 1 ? 's' : ''}`;

                return { key, value }
            }).sort((a, b) => {
                const first = a.key;

                const next = b.key;

                return first < next ? 1 : first > next ? -1 : 0
            })

            return sortOutput
        },

        processingDone() {
            return this.$store.state.processingDone || {}
        },

        isPurchasedDialog() {
            return !!this.processingDone.change
        },

        isProcessing() {
            return this.$store.state.dashboardProcessing
        },
    },

    methods: {
        formatCoin(int) {
            return formatAmount(int)
        },
    }
}
</script>

<style>
</style>