<template>
  <div
    v-if="!user"
    class="root min-h-full grid grid-flow-col grid-cols-1 lg:grid-cols-[min(100%,464px),1fr] relative max-w-[1350px] w-full mx-auto"
  >
    <div
      class="hidden lg:block w-[100%] max-w-[464px] pb-12 pt-6 sticky top-4 h-[fit-content] mt-14 ml-6 rounded-md dark:bg-blue-gray-800 bg-blue-gray-50 dark:text-white text-blue-gray-900 shadow-xl px-4 mb-8"
    >
      <div class="h-[420px] w-full px-4 pt-2">
        <app-img :public-id="storedMedia.register" class="object-contain h-full mx-auto" />
      </div>

      <h1 class="text-3xl font-bold p-4 leading-normal">
        Buy and sell easily
        <br />with Vending.
      </h1>
    </div>

    <onboard />
  </div>

  <div v-else class="w-[100%] h-[100%] grid place-items-center">
    <div class="spinner-border" style="--size:2rem" />
  </div>
</template>

<script>
import onboard from '~/components/onboard.vue'
export default {
  name: 'IndexPage',

  components: { onboard },

  head() {
    return {
      title: 'Welcome'
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    },
    storedMedia() {
      return this.$store.state.media
    },
    loginPage() {
      return this.$route.query.login == 'true'
    }
  },

  beforeCreate() {
    // close dahsboard dialog and notifications;
    // this is usefull when an error was thrown
    // and user was kicked out.
    // upon login, notifications might still be active;

    this.$commit('UPDATE', {
      path: 'dashboardProcessing',
      value: false
    })

    this.$commit('UPDATE', {
      path: 'processingDone',
      value: null
    })

    this.$commit('UPDATE', {
      path: 'notify',
      value: { message: null }
    })
  }

}
</script>

