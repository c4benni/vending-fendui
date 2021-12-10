<template>
    <div class="grid gap-y-6">
        <TransactionHistory />

        <div
            v-if="products"
            class="card lg:mx-6 max-w-[100vw] lg:max-w-[calc(calc(min(100vw,1920px)-3rem)-280px)] lg:bg-opacity-100 bg-opacity-0 dark:bg-opacity-0 lg:dark:bg-opacity-50"
        >
            <div class="subtitle px-6">New products added</div>

            <div class="title lead-subtitle fill-before px-6">Peep the store</div>

            <div
                class="mt-6 grid gap-3 sm:gap-4 md:gap-6 overflow-x-scroll overflow-y-visible py-3 grid-cols-[repeat(10,auto),1px] w-full pl-6 pb-2 hide-scrollbar after:contents after:w-full"
            >
                <uiBtn
                    v-for="(product, i) in products"
                    :key="i"
                    class="w-[calc(100vw-3rem)] sm:w-[min(calc(100vw-3rem),350px)] bg-white dark:bg-blue-gray-900 bg-opacity-100 dark:bg-opacity-50 rounded-sm pb-6 cursor-pointer hover:bg-blue-gray-50 dark:hover:bg-opacity-90 grid-flow-row p-0 text-left justify-stretch font-normal transform-gpu transition-transform hover:translate-y-[-0.25rem]"
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
import TransactionHistory from '~/components/dashboard/transactionHistory.vue';
import AppRating from '~/components/appRating.vue';

export default {
    components: { TransactionHistory, AppRating },

    data: () => ({
        products: null,
    }),
    head() {
        return {
            title: 'Overview'
        }
    },

    async created() {
        const { data } = await this.$apiCall('product/all?limit=10')

        if (data) {
            this.products = data
        }
    }
}
</script>
