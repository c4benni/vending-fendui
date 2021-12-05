<template>
    <ui-btn
        v-if="noFile"
        class="grid-flow-row text-center justify-center lg:grid-flow-col lg:text-left lg:justify-start border border-dashed border-blue-gray-900 border-opacity-10 dark:border-blue-gray-100 dark:border-opacity-10 gap-y-2 lg:gap-y-0 lg:gap-x-2 p-6 lg:pl-6 lg:pr-10 whitespace-normal hover:before:opacity-20 before:bg-blue-700 dark:before:bg-blue-500 focus-within:border-opacity-30 focus-within:border-[2px] dark:focus-within:border-opacity-30 after:invisible"
    >
        <input
            id="browse-files"
            type="file"
            accept="image/*"
            multiple="multiple"
            autocomplete="off"
            tabindex="-1"
            class="absolute opacity-0 text-[transparent] appearance-none w-full h-full left-0 top-0 cursor-pointer"
            @input="handleInput"
        />
        <div class="h-[128px] w-[132px] justify-self-center">
            <app-img :public-id="$store.state.media.upload" height="128px" width="132px" />
        </div>
        <div>
            <p class="title text-2xl font-semibold mb-2 lg:mb-3">Select files</p>
            <p class="body-text opacity-70">
                Drop files or
                <label for="browse-files" class="cursor-pointer/">Click</label> to browse through your device.
            </p>
        </div>
    </ui-btn>
</template>

<script>
export default {
    name: 'UploadFiles',

    model: {
        event: 'update:modelValue',
        prop: 'modelValue'
    },

    props: {
        modelValue: {
            type: Array,
            default: () => []
        }
    },

    computed: {
        noFile() {
            return !this.modelValue.length
        }
    },

    methods: {
        handleInput(e) {
            console.log(e);
        }
    }
}
</script>

<style>
</style>