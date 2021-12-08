<template>
    <div
        v-if="loading || errorFetching"
        class="card min-h-[128px] grid justify-center items-center mx-6"
    >
        <div v-if="!errorFetching" class="spinner-border"></div>

        <div v-else class="grid justify-items-center">
            <p class="mb-3">Failed to fetch at this time</p>

            <ui-btn
                class="bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 dark:bg-blue-500 dark:text-black dark:hover:bg-blue-600 dark:hover:bg-opacity-70 dark:active:bg-blue-700 dark:active:bg-opacity-60"
            >Retry</ui-btn>
        </div>
    </div>

    <div v-else class="card p-0 mx-6 shadow-md dark:shadow-none overflow-x-auto">
        <form
            action="."
            name="search-products"
            class="h-[56px] px-6 relative fill-before before-divide before:border-b isolate"
        >
            <div class="absolute left-[12px] top-[50%] translate-y-[-50%] w-[24px] h-[24px] z-10">
                <ui-icon name="magnify" />
            </div>

            <input
                id="search-products"
                v-model="search"
                title="search products"
                type="search"
                placeholder="Search by product name"
                class="absolute w-full h-full rounded-t-md left-0 bg-[transparent] pl-[48px] appearance-none"
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
                    class="cursor-pointer fade-appear"
                >
                    <td>
                        <div class="grid grid-flow-col gap-x-3 py-4 px-6 justify-start">
                            <div class="h-[80px] w-[80px] rounded-sm isolate overflow-hidden">
                                <app-img
                                    :public-id="product.background"
                                    height="80px"
                                    width="80px"
                                    class="object-cover"
                                ></app-img>
                            </div>

                            <div class="grid content-center">
                                <p class="opacity-70 text-sm font-normal">{{ product.type }}</p>

                                <nuxt-link
                                    :to="`/dashboard/my-products?edit=${product.id}`"
                                >{{ product.productName }}</nuxt-link>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div
                            class="opacity-80 text-[0.875rem] py-4 px-6"
                        >{{ `${product.amountAvailable} product${product.amountAvailable > 1 ? 's' : ''}` }} remaining</div>
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
                        <div class="opacity-80 text-[0.875rem] py-4 px-6">{{ product.id }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import uiIcon from '~/client/components/uiIcon.vue'
import appRating from '~/client/components/appRating.vue'

export default {
    components: { uiIcon, appRating },
    data: () => ({
        search: '',
        sortBy: '',
        loading: false,
        errorFetching: false,
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
        user() {
            return this.$store.state.user;
        },

        getProducts() {
            const regExp = new RegExp(`${this.search}`, 'i');

            return this.products.filter(product => regExp.test(product.productName))
        }
    },

    async created() {
        const { data } = await this.$apiCall(`product/all?where={"sellerId":"${this.user.id}"}`);

        if (data?.length) {
            this.products = data;
        } else {
            this.errorFetching = true
        }

        this.loading = false;
    }
}
</script>

<style>
</style>