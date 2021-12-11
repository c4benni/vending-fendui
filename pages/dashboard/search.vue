<template>
    <div
        class="lg:w-[calc(100vw-280px)] xl:w-[calc(calc(min(100vw,1920px)-3rem)-280px)] w-full pb-6 pt-3"
    >
        <div class="min-h-[200px] w-full grid justify-center">
            <app-img :public-id="searchIllustration" height="200px" width="100%" />
        </div>

        <p class="mt-6 font-semibold text-lg text-center">What are you looking for?</p>

        <p
            class="mt-2 font-normal text-sm text-center opacity-70"
        >Search for products by name or type and hit enter</p>
    </div>
</template>

<script>
export default {
    head() {
        return {
            title: 'Search'
        }
    },

    computed: {
        searchIllustration() {
            return this.$store.state.media.search
        }
    }
}
</script>

<style>
</style>