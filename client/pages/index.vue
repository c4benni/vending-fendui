<template>
  <div
    class="min-h-full bg-blue-gray-900 grid grid-flow-col grid-cols-1 md:grid-cols-[min(100%,464px),1fr]"
  >
    <div
      class="hidden md:block w-[100%] max-w-[464px] h-[100%] my-4 ml-4 rounded-md bg-blue-gray-800 shadow-xl"
    ></div>

    <div
      class="w-[100%] h-[100%] grid justify-items-center items-center grid-cols-[1fr] grid-rows-[1fr]"
    >
      <div class="max-w-[660px] w-[100%] h-[100%] p-6">
        <div aria-label="already have an account" class="my-4">
          <h2 class="text-base font-normal text-blue-gray-100 text-right">
            Already have an account?
            <nuxt-link to="/login" class="text-blue-400">Sign in</nuxt-link>
          </h2>
        </div>
        <h3 class="text-2xl font-bold tracking-tighter text-blue-50 mb-2">Get started for free</h3>
        <h4
          class="font-normal text-blue-gray-400 text-lg"
        >Start buying and selling for free with few steps</h4>

        <ui-form
          name="sign-up"
          action="/register"
          method="post"
          class="my-8 grid"
          :submit-class="[
            'bg-blue-800 text-white w-full h-[48px] mx-auto mt-12 md:max-w-[580px]'
          ]"
          submit-text="Register"
        >
          <ui-input id="input" label="Username" :main-class="['rounded-md bg-blue-gray-800']" />

          <ui-input
            id="input"
            label="Password"
            type="password"
            placeholder="6+ characters"
            :main-class="['rounded-md bg-blue-gray-800 mt-4']"
          />

          <h5 class="text-normal font-normal mt-8 text-gray-50">Choose type of account</h5>

          <div class="grid items-center justify-flex-start mt-2 justify-self-start">
            <ui-btn
              v-for="(item, i) in accountRole"
              :key="i"
              outlined
              outlined-opacity=".1"
              size="lg"
              class="px-6 hover:bg-blue-gray-800 hover:text-white w-full justify-start my-1 grid-cols-1"
              :class="[{
                'bg-blue-gray-700 text-white': selectedRole == item.title
              }]"
              @click="() => selectedRole = item.title"
            >
              <div class="grid h-full w-full text-left">
                <div class="capitalize text-left relative grid items-center">
                  {{ item.title }}
                  <ui-icon
                    v-if="selectedRole == item.title"
                    name="check"
                    size="20px"
                    class="absolute right-0 rounded-full bg-blue-800 p-1"
                  />
                </div>

                <div class="font-light text-sm text-opacity-60 text-white">{{ item.subtitle }}</div>
              </div>
            </ui-btn>
          </div>
        </ui-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',

  data: () => ({
    accountRole: [
      { title: 'buyer', subtitle: 'Deposit coins and buy items' },
      { title: 'seller', subtitle: 'Add products and monitor your profit' },
    ],
    selectedRole: '',
    form: {
      username: '',
      password: '',
      role: ''
    }
  })
}
</script>
