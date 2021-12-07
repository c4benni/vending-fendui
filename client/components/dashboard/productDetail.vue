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
                <app-img :public-id="product.background" class="h-full object-cover" />
            </div>
            <div class="grid lg:p-2 p-4 lg:pl-4 pt-6 lg:pt-6 pb-10 lg:pb-0 content-start">
                <p class="text-sm font-medium opacity-70 capitalize">{{ product.type }}</p>
                <p class="text-2xl font-bold py-1 capitalize">{{ product.productName }}</p>
                <p
                    v-if="product.caption"
                    class="text-[0.9rem] mb-2 font-light opacity-80"
                >{{ product.caption }}</p>
                <AppRating />
                <p
                    class="before-divide before:border-b fill-before pb-4 relative text-3xl font-bold mt-3"
                >¢{{ product.cost }}</p>

                <p class="text-sm font-medium opacity-70 mt-4">Choose quantity</p>

                <OrderQuantity
                    v-model="quantity"
                    :disabled="disableQuantity"
                    class="justify-self-start mb-12"
                />

                <ui-btn
                    class="min-w-[200px] h-[48px] mx-auto grid w-[min(70%,300px)]"
                    :class="{
                        'bg-blue-800 text-white dark:bg-blue-400 dark:text-black': !disablePurchase
                    }"
                    :disabled="disablePurchase"
                    @click="purchase"
                >
                    {{ purchaseText }}
                    <div v-if="purchasing" class="spinner-border"></div>
                </ui-btn>

                <p
                    class="text-sm font-light mt-2 text-center opacity-70"
                >You spend {{ getTotalCost }} in total</p>
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

    data: () => ({
        purchasing: false,
        loading: true,
        quantity: 1,
        product: {}
    }),

    head() {
        return {
            title: this.loading ? 'Loading product' : `Product name`
        }
    },

    computed: {
        getTotalCost() {
            const cents = this.product.cost * this.quantity

            const toFixed = val => val.toFixed(2)

            return cents > 99 ? `$${toFixed(cents / 100)}` : `¢${cents}`
        },
        id() {
            return this.$route.query.id
        },
        user() {
            return this.$store.state.user || {};
        },
        requiredCoin() {
            return this.user.deposit?.[this.product.cost] || 0;

        },
        disableQuantity() {
            return !this.requiredCoin
        },

        disablePurchase() {
            return this.disableQuantity || this.quantity > this.requiredCoin
        },
        purchaseText() {
            const text = this.disableQuantity ? `¢${this.product.cost} coin required` : this.disablePurchase ? `Insufficient coins` : 'Purchase'
            return this.purchasing ? '' : text
        }
    },

    async created() {
        const { data } = await this.$apiCall(`product?id=${this.id}`)

        if (data) {
            this.product = data;

            this.loading = false

            this.$commit('UPDATE_', {
                path: 'productName',
                value: data.productName
            })
        }
    },

    methods: {
        async purchase() {
            console.log(this.id);
            const { data, error } = await this.$apiCall('buy', {
                id: this.id,
                amount: this.quantity
            })

            console.log({ data, error });
        }
    }

}
</script>

<style>
</style>