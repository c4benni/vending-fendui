<template>
  <div class="grid fade-appear">
    <div class="h-[400px] w-full mt-4">
      <app-img aria-label="error illustration" :public-id="publicId" height="400px" />
    </div>

    <h2 class="text-center font-semibold text-base my-8">
      {{
        message
      }}
    </h2>

    <ui-btn
      class="bg-blue-800 text-white hover:bg-opacity-75 hover:bg-blue-900 active:bg-opacity-100 active:bg-blue-900 dark:bg-blue-500 dark:text-black dark:hover:bg-opacity-75 dark:hover:bg-blue-400 dark:active:bg-opacity-100 dark:active:bg-blue-600 px-6 text-base font-bold rounded-sm justify-self-center"
      to="/"
      tag="nuxt-link"
    >Home Page</ui-btn>
  </div>
</template>

<script>
import appImg from '~/components/appImg.vue'
export default {
  name: 'ErrorPage',
  components: { appImg },
  data: () => ({
    publicId: null,
  }),
  head() {
    return {
      title: 'Error'
    }
  },

  computed: {
    message() {
      return this.unauthorized ? 'You are not permitted to access this page' : 'This page doesnt exist, or hasnt been implemented.'
    },

    unauthorized() {
      return this.$route.params.error == 'unauthorized'
    }
  },

  created() {

    const vuexPublicId = this.$store.state.media[this.unauthorized ? 'expired' : 'notFound']

    this.publicId = vuexPublicId[Math.floor(Math.random() * (vuexPublicId.length))]
  },



}
</script>

<style>
</style>