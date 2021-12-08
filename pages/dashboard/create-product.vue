<template>
    <ProductForm @update-parent="formUpdated">
        <ui-btn
            class="gap-x-2 w-8/12 h-[48px] mx-auto"
            :class="{
                'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 dark:bg-blue-500 dark:text-black dark:hover:bg-blue-600 dark:hover:bg-opacity-70 dark:active:bg-blue-700 dark:active:bg-opacity-60': !disableSubmit
            }"
            :disabled="disableSubmit"
            @click="submit"
        >
            <ui-icon name="plus" />Create product
        </ui-btn>
    </ProductForm>
</template>

<script>
import ProductForm from '../../components/dashboard/productForm.vue';
export default {
    components: { ProductForm },

    data: () => ({
        detailsValidity: {
            name: false,
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
            title: 'Create product'
        }
    },

    computed: {
        disableSubmit() {

            const invalidDetail = Object.values(this.detailsValidity).includes(false);

            const { type, cost, inventory, } = this.form;


            return invalidDetail || !type || !cost || !inventory
        }
    },

    methods: {
        formUpdated(e) {
            this.form = e.form;
            this.detailsValidity = e.detailsValidity
            this.selectedType = e.selectedType
        },
        async submit() {
            if (this.disableSubmit) {
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
                // files,
                name,
                caption,
                description,
                cost,
                inventory,
            } = this.form;


            const productForm = {
                productName: name,
                amountAvailable: inventory,
                cost,
                type: this.selectedType.toLowerCase(),
                // images: files.map(file => file.src),
            }

            caption && (productForm.caption = caption);

            description && (productForm.description = description);

            const { data, error } = await this.$apiCall('product', 'POST', productForm)

            this.$commit('UPDATE_', {
                path: 'processingDone',
                value: {
                    title: error ? 'An error occured' : 'Product created',
                    subtitle: error?.message || data?.message,
                    error: !!error
                }
            })

            await this.$sleep(100);

            this.$router.push('/dashboard/my-products')
        }
    }
}
</script>

<style>
</style>