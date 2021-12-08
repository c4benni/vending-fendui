<template>
    <div class="card mx-auto w-full lg:max-w-[min(80%,660px)] relative mb-[64px] grid">
        <div>
            <p class="title mx-4 text-[1.25rem] leading-none mb-3">Product details</p>

            <p class="subtitle m-4 text-sm mt-0 leading-none">Required fields have * when empty</p>

            <div
                class="px-4 pb-12 mb-12 fill-before before-divide before:border-b before:w-[calc(100%-2rem)] before:left-[1rem] relative"
            >
                <ui-input
                    v-for="(input,i) in productDetails"
                    :key="i"
                    v-model="input.model"
                    :label="input.label"
                    :min="input.min"
                    :max="input.max"
                    :placeholder="input.placeholder"
                    :required="input.required"
                    :disabled="input.disabled"
                    :validate="input.validate"
                    :type="input.type"
                    :main-class="['rounded-md bg-white dark:bg-blue-gray-900 md:h-[64px] border border-black dark:border-white', {
                        'mt-4': i != 0,
                        'border-opacity-10 dark:border-opacity-10': !input.disabled,
                        'grayscale-[0.75] border-opacity-[0.05] dark:border-opacity-[0.05] pointer-events-none': input.disabled
                    }]"
                    @update:modelValue="input.onUpdate"
                    @input-validity="input.validity"
                />
            </div>
        </div>

        <div
            class="px-4 pb-12 mb-12 fill-before before-divide before:border-b before:w-[calc(100%-2rem)] before:left-[1rem] relative"
        >
            <p class="title text-[1.25rem] leading-none mb-3">Product type{{ addAsterisk('type') }}</p>

            <p class="subtitle text-sm mt-0 leading-none">Products must have a type</p>

            <ui-btn
                tag="label"
                role="button"
                for="prodcut-type"
                class="rounded-md bg-white dark:bg-blue-gray-900 md:h-[64px] mt-6 w-full justify-between h-[56px] cursor-pointer font-lg min-w-full font-medium"
                outlined
                :outlined-opacity="typeSelectActive ? '0.4' : '0.1'"
            >
                <ui-select
                    id="prodcut-type"
                    v-model="form.type"
                    :title="'choose type'"
                    :items="typeSelectOptions"
                    class="absolute min-w-full h-full"
                    @update:modelValue="typeSelectUpdated"
                    @focus="typeSelectActive = true"
                    @blur="typeSelectActive = false"
                />
                {{
                    selectedType || 'Choose a type'
                }}
                <div class="opacity-75 flex">
                    <ui-icon name="menuSwap" />
                </div>
            </ui-btn>
        </div>

        <div
            class="px-4 pb-12 mb-12 fill-before before-divide before:border-b before:w-[calc(100%-2rem)] before:left-[1rem] relative"
        >
            <p class="title text-[1.25rem] leading-none mb-3">Product cost{{ addAsterisk('cost') }}</p>

            <p class="subtitle text-sm mt-0 leading-none">How much is this product worth?</p>

            <ui-btn
                tag="label"
                role="button"
                for="prodcut-cost"
                class="rounded-md bg-white dark:bg-blue-gray-900 md:h-[64px] mt-6 w-full min-w-full justify-between h-[56px] cursor-pointer font-lg font-medium"
                outlined
                :outlined-opacity="costSelectActive ? '0.4' : '0.1'"
            >
                <ui-select
                    id="prodcut-cost"
                    v-model="form.cost"
                    :title="'choose cost'"
                    :items="costSelectOptions"
                    class="absolute min-w-full h-full"
                    @update:modelValue="costSelectUpdated"
                    @focus="costSelectActive = true"
                    @blur="costSelectActive = false"
                />
                {{
                    selectedCost || 'Choose a price'
                }}
                <div class="opacity-75 flex">
                    <ui-icon name="menuSwap" />
                </div>
            </ui-btn>
        </div>

        <div
            class="px-4 pb-12 fill-before before-divide before:border-b before:w-[calc(100%-2rem)] before:left-[1rem] relative grid justify-start"
        >
            <p class="title text-[1.25rem] leading-none mb-3">Inventory</p>

            <label
                for="product-inventory"
                class="subtitle text-sm mt-0 leading-none"
            >How many items are available?</label>

            <order-quantity
                id="product-inventory"
                v-model="form.inventory"
                class="mt-6"
                max="1000"
                min="1"
            />
        </div>

        <!-- <p class="title mx-4 text-[1.25rem]">Add images{{ !form.files.length ? '*' : '' }}</p>
        <p class="subtitle m-4 mt-3 text-sm leading-none">At least an image is required</p>-->

        <!-- <upload-files :model-value="form.files" @update:modelValue="addFiles" /> -->

        <div class="mt-6 pt-6 pb-12 grid">
            <div class="px-6 pb-12">
                <p class="mb-3 title text-[1.25rem]">Required fields:</p>

                <div
                    v-for="(item, i) in requiredFields"
                    :key="i"
                    :class="{
                        'text-green-700 dark:text-green-500': item.passed,
                        'opacity-60': !item.passed
                    }"
                    class="grid grid-flow-col justify-start h-[32px] items-center gap-x-2 mb-2 text-[0.9rem]"
                >
                    <span
                        :class="{
                            'opacity-60': !item.passed
                        }"
                        class="flex"
                    >
                        <ui-icon
                            :name="item.passed ? 'circleCheckOutline' : 'circleBlankCheckbox'"
                            size="20px"
                        ></ui-icon>
                    </span>
                    {{ item.title }}
                </div>
            </div>

            <slot></slot>
        </div>
    </div>
</template>

<script>
// import uploadFiles from '~/components/uploadFiles.vue'
import UiSelect from '~/components/uiSelect.vue'
import { app } from '~/server-middleware/src/config/config'
import { capitalize } from '~/utils/main'
import OrderQuantity from '~/components/orderQuantity.vue'

export default {
    name: 'CreateProductPage',
    components: { UiSelect, OrderQuantity, },
    props: {
        fields: {
            type: Object,
            default: () => ({})
        }
    },
    data: () => ({
        form: {
            // files: [],
            name: '',
            caption: '',
            description: '',
            type: '',
            cost: '',
            inventory: 1,
        },
        selectedType: '',
        selectedCost: '',

        typeSelectActive: false,
        costSelectActive: false,

        detailsValidity: {
            name: false,
            caption: true,
            description: true
        },
    }),
    head() {
        return {
            title: 'Create product'
        }
    },
    computed: {
        requiredFields() {
            return [
                {
                    title: 'Unique Name',
                    passed: this.detailsValidity.name
                },
                {
                    title: 'Valid Type',
                    passed: !!this.form.type
                },
                {
                    title: 'Valid Cost',
                    passed: !!this.form.cost
                },
                // {
                //     title: 'At least an Image',
                //     passed: !!this.form.files.length
                // }
            ]
        },
        typeSelectOptions() {
            return app.validProductTypes.map(x => {
                return {
                    title: capitalize(x),
                    value: x.replace(/\s/g, '-')
                }
            })
        },

        costSelectOptions() {
            return app.validCost.map(x => {
                return {
                    title: `¢${x}`,
                    value: `${x}`
                }
            })
        },

        productDetails() {

            return [
                {
                    model: this.form.name,

                    disabled: (this.fields.name || {}).disabled,

                    onUpdate: e => {
                        this.form.name = e
                    },

                    validity: e => {
                        this.detailsValidity.name = (e === true || e === undefined)
                    },

                    label: `Name${!this.form.name ? '*' : ''}`,
                    required: true,
                    placeholder: 'Unique name',
                    min: 3,
                    max: 99,
                    validate: x => {
                        if (!x) {
                            return 'Required'
                        }

                        if (x.length < 3) {
                            return 'Min length is 3'
                        }

                        if (x.length > 99) {
                            return 'Max length is 99'
                        }

                        return true
                    }
                },
                {
                    model: this.form.caption,

                    onUpdate: e => {
                        this.form.caption = e
                    },

                    validity: e => {
                        this.detailsValidity.caption = (e === true || e === undefined)
                    },

                    label: 'Caption',
                    placeholder: 'Brief description',
                    min: 10,
                    max: 255,
                    type: 'textarea',
                    validate: x => {

                        if (x) {


                            if (x.length < 10) {
                                return 'Min length is 10'
                            }

                            if (x.length > 255) {
                                return 'Max length is 255'
                            }
                        }

                        return true
                    }
                },
                {
                    model: this.form.description,
                    onUpdate: e => {
                        this.form.description = e
                    },

                    validity: e => {
                        this.detailsValidity.description = (e === true || e === undefined)
                    },

                    label: 'Description',
                    placeholder: 'Verbose description',
                    min: 10,
                    type: 'textarea',
                    validate: x => {

                        if (x) {
                            if (x.length < 10) {
                                return 'Min length is 10'
                            }
                        }
                        return true
                    }
                },
            ]
        },


    },

    watch: {
        form() { this.updateParent() },
        detailsValidity() { this.updateParent() },
        selectedType() { this.updateParent() }
    },

    created() {
        this.updateParent();

        Object.keys(this.form).forEach(key => {

            const initialValue = (this.fields[key] || {}).value;

            if (typeof initialValue != 'undefined' && initialValue != null) {

                if (key == 'type') {

                    return this.typeSelectUpdated(initialValue.replace(/\s/g, '-'), `${capitalize(initialValue)}`)
                }

                if (key == 'cost') {
                    return this.costSelectUpdated(initialValue, `¢${initialValue}`)
                }

                this.form = {
                    ...this.form,
                    [key]: initialValue
                }
            }
        })
    },

    methods: {
        updateParent() {
            this.$emit('update-parent', {
                detailsValidity: this.detailsValidity,
                form: this.form,
                selectedType: this.selectedType
            })
        },
        addAsterisk(path) {
            if (this.form[path]) {
                return ''
            } return '*'
        },
        // addFiles(e) {
        //     this.form.files = e
        // },

        typeSelectUpdated(value, title) {
            this.form.type = value.toLowerCase();

            this.selectedType = capitalize(title)
        },

        costSelectUpdated(value, title) {
            this.form.cost = (value);

            this.selectedCost = (title)
        },
    }
}
</script>
