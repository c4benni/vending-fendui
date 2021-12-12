<template>
    <div
        class="card mt-6 md:m-6 fill-before before-divide before:border relative max-w-[660px] mx-auto self-start justify-self-center pt-10 w-full"
    >
        <h2
            class="text-xl px-6 font-bold fill-before before-divide before:border-b relative pb-4"
        >App preference</h2>
        <div class="px-6">
            <div class="w-full">
                <div class="flex justify-between items-center mx-2 mt-4">
                    <label for="show-balance" class="flex-grow cursor-pointer">Show balance</label>

                    <ui-switch id="show-balance" v-model="form.showBalance" />
                </div>

                <p class="text-[0.85rem] opacity-50 mt-1 mx-2">
                    {{
                        form.showBalance ? 'Your balance will be visible when displayed on your dashboard.' : 'You balance will be hidden when displayed.'
                    }}
                </p>
            </div>

            <div class="w-full">
                <div class="flex justify-between items-center mt-8 mx-2">
                    <label
                        for="show-balance-on-account"
                        class="flex-grow cursor-pointer"
                    >Only show balance from account page</label>

                    <ui-switch
                        id="show-balance-on-account"
                        v-model="form.showBalanceFromAccountPage"
                    />
                </div>

                <p class="text-[0.85rem] opacity-50 mt-1 mx-2">
                    {{
                        form.showBalanceFromAccountPage ? 'Toggle show balance from your account setting alone.' : 'Toggle show balance from anywhere in the app.'
                    }}
                </p>
            </div>

            <div class="w-full">
                <div class="flex justify-between items-center mt-8 mx-2">
                    <label
                        for="remember-me"
                        class="flex-grow cursor-pointer"
                    >Remember me on this device</label>

                    <ui-switch id="remember-me" v-model="form.rememberMe" />
                </div>

                <p class="text-[0.85rem] opacity-50 mt-1 mx-2">
                    {{
                        form.rememberMe ? 'You will be automatically logged in when you refresh the app in less than an hour.' : 'You will always need to log in.'
                    }}
                </p>
            </div>

            <div class="w-full">
                <div class="flex justify-between items-center mt-8 mx-2">
                    <label
                        for="logout-sessions"
                        class="flex-grow cursor-pointer"
                    >Logout all other sessions</label>

                    <ui-switch id="logout-sessions" v-model="form.logoutOtherSessions" />
                </div>

                <p class="text-[0.85rem] opacity-50 mt-1 mx-2">
                    {{
                        form.logoutOtherSessions ? 'End all sessions when you login.' : 'Keep multiple sessions'
                    }}
                </p>
            </div>
        </div>

        <tab-footer full-bleed />
    </div>
</template>

<script>
import tabFooter from './tabFooter.vue';
import uiSwitch from '~/components/uiSwitch.vue';

export default {
    name: 'PreferenceTab',

    components: { uiSwitch, tabFooter },

    data: () => ({
        form: {
            showBalance: false,
            showBalanceFromAccountPage: false,
            rememberMe: true,
            logoutOtherSessions: false

        }
    }),

    computed: {
        user() {
            return this.$store.getters.userInfo;
        },
    },

    created() {
        this.form.showBalance = this.user.showBalance
        this.form.showBalanceFromAccountPage = this.user.showBalanceFromAccountPage
        this.form.rememberMe = this.user.rememberMe
        this.form.logoutOtherSessions = this.user.logoutOtherSessions

    },
}
</script>

<style>
</style>