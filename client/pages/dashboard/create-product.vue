<template>
    <div class="card mx-auto w-full lg:max-w-[min(80%,660px)] relative mb-[64px]">
        <p class="title">Add images</p>

        <upload-files v-model="form.files" />
    </div>
</template>

<script>
import uploadFiles from '~/components/uploadFiles.vue'
export default {
    name: 'CreateProductPage',
    components: { uploadFiles },
    data: () => ({
        form: {
            files: []
        }
    }),
    head() {
        return {
            title: 'Create product'
        }
    }
}
</script>

<style>
</style>