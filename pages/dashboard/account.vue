<template>
  <div class="min-h-[100vh] min-w-full">
    <ui-tab>
      <general-tab />
      <preference-tab />
      <change-password-tab />
      <delete-account-tab />
    </ui-tab>
  </div>
</template>

<script>
import ChangePasswordTab from '~/components/dashboard/account/changePasswordTab.vue'
import DeleteAccountTab from '~/components/dashboard/account/deleteAccountTab.vue'
import GeneralTab from '~/components/dashboard/account/generalTab.vue'
import PreferenceTab from '~/components/dashboard/account/preferenceTab.vue'
import UiTab from '~/components/UiTab.vue'
export default {
  components: {
    UiTab,
    GeneralTab,
    PreferenceTab,
    ChangePasswordTab,
    DeleteAccountTab
  },
  head() {
    return {
      title: 'Account'
    }
  }
}
</script>
