<template>
    <div
        class="card min-h-[360px] lg:min-h-[510px] mx-auto w-full relative lg:p-2 p-0 grid lg:grid-flow-col lg:grid-cols-[auto,1fr]"
        :class="[
            {
                'before-divide before:border fill-before': $theme.dark
            }
        ]"
    >
        <div v-if="loading" class="h-full w-full absolute grid place-items-center top-0">
            <div class="spinner-border" style="--size: 2rem" />
        </div>

        <template v-else>
            <div
                class="w-[calc(100%-1rem)] h-[360px] lg:w-[490px] lg:h-[510px] rounded-md bg-white dark:bg-blue-gray-900 shadow-md justify-self-center mt-2 lg:mt-0"
            >
                <app-img :public-id="$store.state.media.register" />
            </div>
            <div class="grid lg:p-2 p-4 lg:pl-4 pt-6 lg:pt-6 pb-10 lg:pb-0 content-start">
                <p class="text-sm font-medium opacity-70">Entertainment</p>
                <p class="text-2xl font-bold py-1">Product name</p>
                <p
                    class="text-[0.9rem] mb-2 font-light opacity-80"
                >A brief, descriptive caption about this product</p>
                <AppRating />
                <p
                    class="before-divide before:border-b fill-before pb-4 relative text-3xl font-bold mt-3"
                >$100</p>

                <p class="text-sm font-medium opacity-70 mt-4">Choose quantity</p>

                <OrderQuantity v-model="quantity" class="justify-self-start mb-12" />

                <ui-btn
                    class="bg-blue-800 text-white dark:bg-blue-400 dark:text-black min-w-[200px] h-[48px] mx-auto grid w-[min(70%,300px)]"
                >
                    {{ purchasing ? '' : 'Purchase' }}
                    <div v-if="purchasing" class="spinner-border"></div>
                </ui-btn>

                <p class="text-sm font-light mt-2 text-center opacity-70">You spend $100 in total</p>
            </div>
        </template>
    </div>
</template>

<script>
import OrderQuantity from '../orderQuantity.vue';
import AppRating from '~/components/appRating.vue';

export default {
    name: 'ProductDetail',
    components: { AppRating, OrderQuantity },

    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data: () => ({
        purchasing: false,
        loading: false,
        quantity: 1
    }),

    head() {
        return {
            title: this.loading ? 'Loading product' : `Product name`
        }
    },
}
</script>

<style>
</style>