<template>
    <div
        class="card mt-6 md:m-6 fill-before before-divide before:border relative max-w-[600px] mx-auto self-start justify-self-center pt-10 w-full"
    >
        <h2
            class="text-xl px-6 font-bold fill-before before-divide before:border-b relative pb-4"
        >Enter password</h2>

        <ui-form :key="form.key" name="password-form" class="mt-10 mb-6 px-6" :show-submit="false">
            <input :value="user.username" autocomplete="username" class="sr-only" />
            <ui-input
                id="current-password"
                :model-value="form.password"
                type="password"
                label="Password"
                autocomplete="current-password"
                placeholder="6+ characters"
                :validate="validatePassword"
                :pattern="passwordPattern"
                :main-class="['rounded-md bg-blue-gray-50 dark:bg-blue-gray-900 md:h-[64px] rounded-md bg-white dark:bg-blue-gray-900 md:h-[64px] border border-black dark:border-white border-opacity-10 dark:border-opacity-10',]"
                @update:modelValue="updatePassword"
                @input-validity="validateCurrentPassword"
            />
        </ui-form>

        <tab-footer full-bleed>
            <div v-if="!showAlert" class="mt-6 flex w-full justify-center">
                <ui-btn
                    class="gap-x-2 px-6 h-[48px]"
                    :class="{
                        'bg-red-700 text-white dark:bg-red-400 dark:text-blue-gray-900 hover:bg-red-800 dark:hover:bg-red-500': !disableSubmit
                    }"
                    :disabled="disableSubmit"
                    @click="showAlert = !showAlert"
                >
                    <ui-icon name="delete" />Delete account
                </ui-btn>
            </div>

            <div v-else class="fade-appear px-6" style="--appear-duration:350ms">
                <div
                    class="rounded-sm mt-[32px] mx-auto p-3 fill-before relative before-divide before:border flex justify-start bg-red-700 dark:bg-red-500 items-start w-[fit-content] bg-opacity-30 dark:bg-opacity-30"
                >
                    <ui-icon name="alert" />

                    <p
                        class="text-sm opacity-90 ml-[0.5rem]"
                    >Are you sure about this? This action cannot be undone.</p>
                </div>

                <div class="flex justify-center w-full mt-6 px-6">
                    <ui-btn
                        v-for="(action, i) in confirmActions"
                        :key="i"
                        :class="action.classList"
                        @click="action.onClick"
                    >{{ action.title }}</ui-btn>
                </div>
            </div>
        </tab-footer>
    </div>
</template>

<script>
import tabFooter from './tabFooter.vue';

const passwordRegExpStr = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,32}$'

const passwordRegExp = new RegExp(`${passwordRegExpStr}`)

export default {
    name: 'DeleteAccountTab',

    components: { tabFooter },

    data: () => ({
        showAlert: false,
        passwordPattern: passwordRegExpStr,
        form: {
            password: '',
            key: Date.now()
        },

        passwordValid: false
    }),

    computed: {

        user() {
            return this.$store.getters.userInfo;
        },

        disableSubmit() {
            return !this.passwordValid
        },

        confirmActions() {
            return [
                {
                    title: 'Cancel',
                    onClick: () => {
                        this.$router.replace({
                            query: {
                                ...this.$route.query,
                                tab: 'general'
                            }
                        })
                    },
                    classList: [
                        'pl-0 font-normal'
                    ],
                },
                {
                    title: 'Delete account',
                    onClick: this.submit,
                    classList: [
                        'bg-red-700 text-white dark:bg-red-400 dark:text-blue-gray-900 hover:bg-red-800 dark:hover:bg-red-500 ml-6',
                    ]
                }
            ]
        },
    },

    methods: {
        validateCurrentPassword(e) {
            this.passwordValid = e
        },
        updatePassword(val) {
            this.form.password = val
        },
        validatePassword(val) {
            const e = val?.trim()

            if (!e) { return 'Required' }

            if (e.length < 6) {
                return 'Min length is 6'
            }

            if (e.length > 32) {
                return 'Max length is 32'
            }

            if (!/[a-z]/.test(e)) {
                return 'At least 1 lowercase'
            }

            if (!/[A-Z]/.test(e)) {
                return 'At least 1 uppercase'
            }

            if (!/\d/.test(e)) {
                return 'At least 1 number'
            }

            if (!/@|\$|!|%|\*|\?|&/.test(e)) {
                return 'Special character needed'
            }

            if (!passwordRegExp.test(e)) {
                return 'Invalid character(s)'
            }

            return true;
        },
        resetForm() {
            this.form.password = ''
            this.form.key = Date.now()
            this.showAlert = false
        },

        async submit() {
            if (this.disableSubmit) {
                return null
            }

            this.$commit('UPDATE', {
                path: 'processingDone',
                value: null
            })

            await this.$nextTick()

            this.$commit('UPDATE', {
                path: 'dashboardProcessing',
                value: true
            })

            this.$commit('UPDATE', {
                path: 'processingDone',
                value: {
                    title: 'Deleting profile',
                    subtitle: 'Please wait while we delete your profile.',
                    key: Date.now()
                }
            })

            const payload = {
                password: this.form.password
            }

            const { data, error } = await this.$apiCall('user', 'DELETE', payload)

            this.resetForm()

            this.$commit('UPDATE', {
                path: 'processingDone',
                value: {
                    title: error ? 'An error occured' : 'Your profile has been deleted!',
                    subtitle: error?.message || data?.message,
                    error: !!error,
                    key: Date.now()
                }
            })

            await this.$sleep()

            if (!error) {
                await this.$sleep(1500)

                await this.$refreshUser('/')
            }
        }
    }
}
</script>

<style>
</style>