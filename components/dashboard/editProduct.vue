<template>
    <ProductForm :key="id + `${loading}`" :fields="fields" @update-parent="formUpdated">
        <ui-btn
            class="gap-x-2 w-8/12 h-[48px] mx-auto"
            :class="{
                'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 dark:bg-blue-500 dark:text-black dark:hover:bg-blue-600 dark:hover:bg-opacity-70 dark:active:bg-blue-700 dark:active:bg-opacity-60': !disableUpdate
            }"
            :disabled="disableUpdate"
            @click="updateProduct"
        >
            <ui-icon name="update" />Update product
        </ui-btn>

        <ui-btn
            class="gap-x-2 w-8/12 h-[48px] mx-auto mt-8 mb-3 text-bg-red-800 hover:bg-red-800 hover:text-white active:bg-red-900 active:text-white dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:hover:bg-opacity-70 dark:active:bg-red-700 dark:active:text-white dark:active:bg-opacity-60"
            outlined
            @click="deleteProduct"
        >
            <ui-icon name="delete" />Delete this product
        </ui-btn>
    </ProductForm>
</template>

<script>
import ProductForm from "./productForm.vue";
export default {
    components: { ProductForm },
    data: () => ({
        loading: true,
        product: {
            productName: 'Loading title',
            caption: null,
            description: null,
            type: null,
            cost: null,
            amountAvailable: null
        },

        detailsValidity: {
            caption: true,
            description: true
        },

        form: {
            type: null, cost: null, inventory: null
        },

        selectedType: ''
    }),
    head() {
        return {
            title: this.loading ? 'Loading product' : `Editing ${this.title}`
        }
    },

    computed: {
        disableUpdate() {
            const invalidDetail = Object.values(this.detailsValidity).includes(false);

            const { type, cost, inventory, } = this.form;

            return invalidDetail || !type || !cost || !inventory
        },
        id() {
            return this.$route.query.edit
        },

        fields() {
            return {
                name: {
                    value: this.product.productName || 'Loading...',
                    disabled: true
                },
                caption: {
                    value: this.product.caption
                },
                description: {
                    value: this.product.description
                },
                type: {
                    value: this.product.type || 'Loading...',
                    disabled: true,
                },
                cost: {
                    value: parseFloat(this.product.cost) || 'Loading'
                },
                inventory: {
                    value: parseFloat(this.product.amountAvailable || -1)
                }
            }
        }
    },

    async created() {
        const { data } = await this.$apiCall(`product?id=${this.id}`)

        if (data) {
            this.product = { ...data };

            this.loading = false

            this.$commit('UPDATE_', {
                path: 'productName',
                value: data.productName
            })
        }
    },

    methods: {
        formUpdated(e) {
            this.form = e.form;

            const { caption, description } = e.detailsValidity
            this.detailsValidity = {
                caption, description
            }

            this.selectedType = e.selectedType
        },
        async updateProduct() {
            if (this.disableUpdate) {
                return null
            }

            this.$commit('UPDATE_', {
                path: 'processingDone',
                value: null
            })

            await this.$nextTick()

            this.$commit('UPDATE_', {
                path: 'dashboardProcessing',
                value: true
            })

            const {
                caption,
                description,
                cost,
                inventory,
            } = this.form;


            const productForm = {
                id: this.id,
                amountAvailable: inventory,
                cost,
                type: this.selectedType.toLowerCase(),
            }

            caption && (productForm.caption = caption);

            description && (productForm.description = description);

            const { error } = await this.$apiCall('product', 'PATCH', productForm)

            this.$commit('UPDATE_', {
                path: 'processingDone',
                value: {
                    title: error ? 'An error occured' : 'Product updated',
                    subtitle: error ? '' : 'Your product has been successfully updated!'
                }
            })

            await this.$sleep(100);

            this.$router.push('/dashboard/my-products')
        },
        deleteProduct() {
            this.$commit('UPDATE_', {
                path: 'notify',
                value: {
                    message: 'Are you sure you want to delete this product? This action cannot be reversed.',
                    error: true,
                    closeText: 'Delete product',
                    callback: async () => {

                        await this.$apiCall(`product?id=${this.id}`, 'DELETE')

                        await this.$sleep(100);

                        this.$commit('UPDATE_', {
                            path: 'notify',
                            value: {
                                key: Date.now(),
                                message: 'Product successfully deleted!',
                                timeout: 2000
                            }
                        })

                        await this.$sleep(100);

                        this.$router.replace('/dashboard/my-products')
                    },
                    key: Date.now()
                }
            })

        }
    }
}
</script>

<style>
</style>