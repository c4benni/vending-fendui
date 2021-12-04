<template>
    <product-detail v-if="queryId" :query-id="queryId" />

    <div
        v-else
        class="grid grid-cols-[repeat(auto-fill,minmax(40%,180px))] lg:grid-cols-[repeat(auto-fill,minmax(30%,200px))] justify-center lg:gap-4 gap-2 lg:p-3 py-3 lg:w-[calc(100vw-280px)] xl:w-[calc(calc(min(100vw,1920px)-3rem)-280px)] w-full"
    >
        <ui-btn
            v-for="i  in 40"
            :key="i"
            tag="nuxt-link"
            :to="`/dashboard/shop?id=${i}`"
            class="grid-flow-row text-left bg-white dark:bg-blue-gray-900 dark:bg-opacity-50 w-full shadow-md p-0"
        >
            <div class="h-[128px] lg:h-[224px] w-full mb-4">
                <app-img :public-id="$store.state.media.register" />
            </div>

            <p class="p-2 lg:px-3">Product name</p>

            <p class="px-2 lg:px-3 text-sm opacity-80 mb-6">$100</p>
        </ui-btn>
    </div>
</template>

<script>
import productDetail from '~/components/dashboard/productDetail.vue'
export default {
    components: { productDetail },

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
    }
}
</script>

<style>
</style>