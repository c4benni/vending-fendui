<template>
    <ui-btn
        v-if="noFile"
        class="grid-flow-row text-center justify-center lg:grid-flow-col lg:text-left lg:justify-start border border-dashed border-blue-gray-900 border-opacity-20 dark:border-blue-gray-100 dark:border-opacity-20 gap-y-2 lg:gap-y-0 lg:gap-x-2 p-4 lg:pl-4 lg:pr-10 whitespace-normal hover:before:opacity-20 before:bg-blue-700 dark:before:bg-blue-500 focus-within:border-opacity-30 focus-within:borer-[1px] dark:focus-within:border-opacity-30 after:invisible w-[calc(100%-2rem)] mx-auto mt-3 rounded-sm"
    >
        <div class="h-[128px] w-[132px] justify-self-center">
            <app-img :public-id="$store.state.media.upload" height="128px" width="132px" />
        </div>
        <div>
            <p class="title text-xl font-semibold mb-2">Upload images</p>
            <p class="body-text opacity-70">
                Drop images or
                <label for="browse-files" class="cursor-pointer/">Click</label> to browse through your device.
            </p>
        </div>
        <input
            id="browse-files"
            type="file"
            accept="image/*"
            multiple="multiple"
            autocomplete="off"
            maxlength="10"
            minlength="1"
            tabindex="-1"
            class="absolute opacity-0 text-[transparent] appearance-none w-full h-full left-0 top-0 cursor-pointer"
            required
            @input="handleInput"
        />
    </ui-btn>

    <div v-else-if="selectedFile" class="mt-3">
        <div :key="selectedIndex" class="fade-appear h-[280px] w-full isolate overflow-hidden">
            <img :src="selectedFile.src" :alt="selectedFile.alt" class="img h-[280px] w-full" />
        </div>

        <p
            v-if="displayFiles.length > 1"
            class="opacity-70 text-sm my-2 mx-[0.75rem]"
        >Choose a cover image</p>

        <div
            class="before:w-[calc(100%-1.5rem)] before:left-[0.75rem] after:w-[calc(100%-1.5rem)] after:left-[0.75rem] before:border-t before:border-black before:opacity-[0.075] after:border-b after:border-black after:opacity-[0.075] dark:before:border-t dark:before:border-white dark:before:opacity-[0.075] dark:after:border-b dark:after:border-white dark:after:opacity-[0.075] relative fill-before-after"
        >
            <div
                class="grid grid-flow-col gap-x-3 py-6 px-4 overflow-x-auto overflow-y-hidden justify-start max-w-[calc(100vw-3rem)] :lg-max-w-[660px] after:w-3 after:h-full after:block"
            >
                <ui-btn
                    v-for="(file,i) in displayFiles"
                    :key="i"
                    class="h-[72px] w-[72px] rounded-md overflow-hidden isolate relative cursor-pointer transition-transform p-0 fade-appear"
                    :class="{
                        'scale-[1.05]': i == (selectedIndex || 0),
                        'scale-[0.995]': i != (selectedIndex || 0)
                    }"
                    :outlined="i == (selectedIndex || 0)"
                    @click="selectedIndex = i"
                >
                    <img
                        :src="file.src"
                        :alt="file.alt"
                        height="72"
                        width="72"
                        class="img"
                        decoding="async"
                    />

                    <div
                        v-if="i == (selectedIndex || 0)"
                        class="fade-appear absolute w-full h-full top-0 left-0 z-[1] bg-blue-700 bg-opacity-60 grid items-center justify-center"
                    >
                        <div
                            class="h-[32px] w-[32px] rounded-full bg-green-700 text-white flex justify-center items-center"
                        >
                            <UiIcon name="check" :size="'24px'" />
                        </div>
                    </div>
                </ui-btn>
            </div>
        </div>

        <div class="mt-6 mx-4 flex items-center justify-end">
            <ui-btn
                class="text-blue-700 dark:text-blue-500 bg-blue-700 dark:bg-blue-500 bg-opacity-0 dark:bg-opacity-0"
                @click="removeImages"
            >Remove image{{ displayFiles.length > 1 ? 's' : '' }}</ui-btn>

            <ui-btn
                tag="label"
                for="add-files"
                role="button"
                class="text-blue-700 dark:text-blue-500 bg-blue-700 dark:bg-blue-500 bg-opacity-5 dark:bg-opacity-5 hover:bg-opacity-[0.15] dark:hover:bg-opacity-[0.15] rounded-sm cursor-pointer"
                outlined
                outlined-opacity=".2"
            >
                <input
                    id="add-files"
                    type="file"
                    accept="image/*"
                    multiple="multiple"
                    autocomplete="off"
                    :maxlength="`${10 - displayFiles.length}`"
                    :minlength="displayFiles.length > 9 ? undefined : '1'"
                    tabindex="-1"
                    class="absolute opacity-0 text-[transparent] appearance-none w-full h-full left-0 top-0 cursor-pointer"
                    required
                    @input="handleInput"
                />
                Add images
            </ui-btn>
        </div>
    </div>
</template>

<script>
import UiIcon from "./uiIcon.vue"
export default {
    name: "UploadFiles",
    components: { UiIcon },
    model: {
        event: "update:modelValue",
        prop: "modelValue"
    },
    props: {
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        displayFiles: [],
        selectedIndex: 0
    }),
    computed: {
        noFile() {
            return !this.displayFiles.length;
        },
        selectedFile() {
            return this.displayFiles[this.selectedIndex || 0];
        }
    },
    methods: {
        removeImages() {
            this.displayFiles = []

            this.$emit('update:modelValue', [])
        },
        getURL(file) {
            return URL.createObjectURL(file);
        },
        handleInput(e) {
            this.buildDisplay(e.currentTarget.files);

            this.$emit('update:modelValue', this.displayFiles)

            console.log(this.displayFiles);
        },
        buildDisplay(files) {
            for (const file of files) {
                /^image\//.test(file.type) &&
                    this.displayFiles.push({
                        file,
                        src: this.getURL(file),
                        alt: file.name
                    });
            }

            this.displayFiles = this.displayFiles.slice(0, 9)
        }
    },
}
</script>

<style scoped>
.img {
    object-fit: cover;
}
</style>