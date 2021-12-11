<template>
    <edit-product v-if="isEditing" />

    <div
        v-else-if="loading || errorFetching.message"
        class="card min-h-[128px] grid justify-center items-center mx-6"
    >
        <div v-if="!errorFetching.message" class="spinner-border"></div>

        <div v-else class="grid justify-items-center">
            <p class="mb-3">
                {{
                    getErrorMessage
                }}
            </p>

            <ui-btn
                class="bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 dark:bg-blue-500 dark:text-black dark:hover:bg-blue-600 dark:hover:bg-opacity-70 dark:active:bg-blue-700 dark:active:bg-opacity-60"
                :to="errorBtn.to"
            >{{ errorBtn.text }}</ui-btn>
        </div>
    </div>

    <div v-else>
        <div class="card p-0 mx-6 shadow-md dark:shadow-none overflow-x-auto fade-appear">
            <form
                action="."
                name="search-products"
                class="h-[64px] px-6 relative fill-before before-divide before:border-b isolate"
            >
                <div class="absolute left-6 top-[50%] translate-y-[-50%] w-[24px] h-[24px] z-10">
                    <ui-icon name="magnify" />
                </div>

                <input
                    id="search-products"
                    v-model="search"
                    title="search products"
                    type="search"
                    placeholder="Search by product name"
                    class="absolute w-full h-full rounded-t-md left-0 bg-[transparent] pl-[56px] appearance-none"
                />
            </form>

            <div v-if="!getProducts.length">
                <p class="text-center text-lg font-bold p-10">No item to match your search</p>
            </div>

            <table v-else class="w-full">
                <caption class="sr-only">Product list</caption>

                <thead
                    class="bg-white dark:bg-blue-gray-900 dark:bg-opacity-80 fill-before before-divide before:border-b h-14 w-full relative text-left"
                >
                    <tr>
                        <th v-for="(th, i) in tableHead" :key="i">
                            <div class="px-6">{{ th }}</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(product, i) in getProducts"
                        :key="i"
                        :class="{ 'border-b border-black dark:border-white border-opacity-10 dark:border-opacity-10': i != getProducts.length - 1 }"
                        class="fade-appear bg-white dark:bg-blue-gray-900 bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-30 dark:hover:bg-opacity-30"
                    >
                        <td>
                            <nuxt-link
                                class="grid grid-flow-col gap-x-3 py-4 px-6 justify-start group"
                                :to="`/dashboard/my-products?edit=${product.id}`"
                            >
                                <div
                                    class="h-[80px] w-[80px] rounded-sm isolate overflow-hidden transition-transform transform-gpu group-hover:translate-y-[-0.15rem] group-hover:shadow-md"
                                >
                                    <app-img
                                        :public-id="product.background"
                                        height="80px"
                                        width="80px"
                                        class="object-cover"
                                    ></app-img>
                                </div>

                                <div class="grid content-center">
                                    <p
                                        class="opacity-70 text-sm font-normal"
                                    >{{ capitalize(product.type) }}</p>

                                    <span>{{ capitalize(product.productName) }}</span>
                                </div>
                            </nuxt-link>
                        </td>

                        <td>
                            <div class="py-4 px-6">
                                <span
                                    class="rounded-full bg-opacity-75 dark:bg-opacity-75 text-[0.8rem] py-1 px-2 whitespace-nowrap"
                                    :class="{
                                        'bg-green-800 text-white': parseInt(product.amountAvailable) >= 10,
                                        'bg-yellow-500 text-black': parseInt(product.amountAvailable) < 10 && parseInt(product.amountAvailable) > 4,
                                        'bg-red-800 text-white': parseInt(product.amountAvailable) < 5
                                    }"
                                >{{ formatRemaining(product) }}</span>
                            </div>
                        </td>

                        <td>
                            <div class="py-4 px-6">¢{{ product.cost }}</div>
                        </td>

                        <td>
                            <div class="py-4 px-6">
                                <app-rating readonly />
                            </div>
                        </td>

                        <td>
                            <div
                                class="opacity-80 text-[0.875rem] py-4 px-6 whitespace-nowrap"
                            >{{ product.id }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="grid justify-center my-9">
            <ui-btn
                to="/dashboard/create-product"
                class="bg-blue-700 text-white hover:blue-800 dark:bg-blue-400 dark:text-black dark:hover:bg-blue-500 px-6"
            >Create a product</ui-btn>
        </div>
    </div>
</template>

<script>
import uiIcon from '../../components/uiIcon.vue'
import appRating from '../../components/appRating.vue'
import editProduct from '~/components/dashboard/editProduct.vue'
import { capitalize } from '~/utils/main'

export default {
    components: { uiIcon, appRating, editProduct },
    data: () => ({
        search: '',
        sortBy: '',
        loading: true,
        errorFetching: {
            message: '',
            status: null
        },
        products: [],
        tableHead: [
            'Name',
            'Stock',
            'Price',
            'Rating',
            'Id'
        ]
    }),
    head() {
        return {
            title: 'My products'
        }
    },

    computed: {
        isEditing() {
            return !!this.$route.query.edit
        },
        user() {
            return this.$store.state.user;
        },

        getProducts() {
            const regExp = new RegExp(`${this.search}`, 'i');

            return this.products.filter(product => regExp.test(product.productName))
        },

        notFound() {
            return this.errorFetching.status == 404
        },

        getErrorMessage() {
            if (this.notFound) {
                return `You have nothing to show`
            } else {
                return this.errorFetching.message;
            }
        },

        errorBtn() {
            const notFound = this.notFound;

            return {
                text: notFound ? 'Create product' : 'Retry',
                to: notFound ? '/dashboard/create-product' : undefined,
            }
        }
    },

    watch: {
        isEditing(n) {
            scrollTo(0, 0)
            if (!n) {
                this.fetchProducts()
            }
        }
    },

    async created() {
        await this.fetchProducts()
    },

    async activated() {
        await this.fetchProducts()
    },

    methods: {
        capitalize(str) {
            return capitalize(str)
        },
        parseInt(value) {
            return parseInt(value)
        },
        formatRemaining(product) {
            const available = parseInt(product.amountAvailable);

            return available ? `${available} item${available > 1 ? 's' : ''} left` : 'Sold out'
        },
        async fetchProducts() {
            this.products = [];

            const { data, error } = await this.$apiCall(`product/all?where={"sellerId":"${this.user.id}"}`);

            if (data?.length) {
                this.products = data;
            } else if (error) {
                this.errorFetching = error
            } else {
                this.errorFetching.message = 'An error occured'
            }

            this.loading = false;
        }
    },
}
</script>

<style>
</style>