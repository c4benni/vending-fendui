<template>
    <product-detail v-if="queryId" :query-id="queryId" />

    <div
        v-else-if="loading"
        class="w-full py-[128px] grid justify-center justify-items-center items-center"
    >
        <div class="spinner-border" style="--size:1.75rem"></div>

        <p class="mt-2 text-sm opacity-60">LOADING...</p>
    </div>

    <div
        v-else-if="!productsLength"
        class="lg:w-[calc(100vw-280px)] xl:w-[calc(calc(min(100vw,1920px)-3rem)-280px)] w-full pb-6 min-h-screen"
    >
        <div class="min-h-[200px] grid justify-center">
            <app-img :public-id="media.empty" height="200px" />
        </div>

        <p class="mt-6 font-semibold text-lg text-center">The shop is empty!</p>
    </div>

    <div
        v-else
        class="grid grid-cols-[repeat(auto-fill,minmax(40%,180px))] lg:grid-cols-[repeat(auto-fill,minmax(30%,200px))] justify-center lg:gap-4 gap-2 lg:p-3 py-3 lg:w-[calc(100vw-280px)] xl:w-[calc(calc(min(100vw,1920px)-3rem)-280px)] w-full"
    >
        <ui-btn
            v-for="(product, i) in products"
            :key="i"
            tag="nuxt-link"
            :to="`/dashboard/shop?id=${product.id}`"
            class="grid-flow-row text-left bg-white dark:bg-blue-gray-900 dark:bg-opacity-50 w-full p-0 justify-stretch transform-gpu transition-transform hover:translate-y-[-0.25rem] hover:shadow-lg"
            outlined
            :outlined-storke="`${$theme.light ? '0.75px' : '0.5px'}`"
            :outlined-opacity="`${$theme.light ? '0.1' : '0.05'}`"
        >
            <div
                class="h-[128px] lg:h-[224px] w-full mb-4 relative fill-before before-divide before:border-b"
            >
                <app-img :public-id="product.background" class="h-full object-cover" />
            </div>

            <div class="px-2 pb-3 lg:px-3 overflow-hidden">
                <p
                    class="capitalize truncate opacity-70 mb-1 text-sm font-normal"
                >{{ product.type }}</p>
                <p class="truncate mb-2 capitalize">{{ product.productName }}</p>

                <p class="text-sm opacity-80">¢{{ product.cost }}</p>
            </div>
        </ui-btn>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import AppImg from '~/components/appImg.vue';
import productDetail from '~/components/dashboard/productDetail.vue'

export default {
    components: { productDetail, AppImg },

    data: () => ({
        loading: true,
        errorFetching: null
    }),

    head() {
        return {
            title: 'Shop products'
        }
    },

    computed: {
        ...mapState(['products']),

        productsLength() {
// console.log(Object.keys(this.products).length);

            return Object.keys(this.products).length
        },

        queryId() {
            return this.$route.query.id;
        },

        media() {
            return this.$store.state.media
        },

    },

    watch: {
        queryId() {
            scrollTo(0, 0)
        }
    },

    async created() {
        this.loading = !this.productsLength;

        await this.getItems();
    },

    methods: {
        ...mapActions(['getProducts']),

        async getItems() {

            await this.getProducts()

            this.loading = false;
        }
    }
}
</script>

<style>
</style>
