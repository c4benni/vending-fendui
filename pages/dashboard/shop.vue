<template>
    <product-detail v-if="queryId" :query-id="queryId" />

    <div
        v-else
        class="grid grid-cols-[repeat(auto-fill,minmax(40%,180px))] lg:grid-cols-[repeat(auto-fill,minmax(30%,200px))] justify-center lg:gap-4 gap-2 lg:p-3 py-3 lg:w-[calc(100vw-280px)] xl:w-[calc(calc(min(100vw,1920px)-3rem)-280px)] w-full"
    >
        <ui-btn
            v-for="(product, i) in products"
            :key="i"
            tag="nuxt-link"
            :to="`/dashboard/shop?id=${product.id}`"
            class="grid-flow-row text-left bg-white dark:bg-blue-gray-900 dark:bg-opacity-50 w-full shadow-md p-0"
        >
            <div class="h-[128px] lg:h-[224px] w-full mb-4">
                <app-img :public-id="product.background" class="h-full object-cover" />
            </div>

            <p class="p-2 lg:px-3">{{ product.productName }}</p>

            <p class="px-2 lg:px-3 text-sm opacity-80 mb-6">¢{{ product.cost }}</p>
        </ui-btn>
    </div>
</template>

<script>
import productDetail from '~/components/dashboard/productDetail.vue'
export default {
    components: { productDetail },

    data: () => ({
        products: []
    }),

    head() {
        return {
            title: 'Shop products'
        }
    },

    computed: {
        queryId() {
            return this.$route.query.id;
        }
    },

    watch: {
        queryId() {
            scrollTo(0, 0)
        }
    },

    async created() {
        const { data } = await this.$apiCall('product/all', 'GET')

        if (data) {
            this.products = data
        }
    }
}
</script>

<style>
</style>