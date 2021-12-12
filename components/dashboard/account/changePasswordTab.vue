<template>
    <div
        class="card mt-6 md:m-6 fill-before before-divide before:border relative max-w-[600px] mx-auto self-start justify-self-center pt-10 w-full"
    >
        <h2
            class="text-xl px-6 font-bold fill-before before-divide before:border-b relative pb-4"
        >Update password</h2>

        <ui-form name="password-form" class="mt-10 mb-6 px-6" :show-submit="false">
            <input :value="user.username" autocomplete="username" class="sr-only" />
            <ui-input
                id="current-password"
                :model-value="form.oldPassword"
                type="password"
                label="Current password"
                autocomplete="current-password"
                placeholder="6+ characters"
                :validate="validatePassword"
                :pattern="passwordPattern"
                :main-class="['rounded-md bg-blue-gray-50 dark:bg-blue-gray-900 md:h-[64px] rounded-md bg-white dark:bg-blue-gray-900 md:h-[64px] border border-black dark:border-white border-opacity-10 dark:border-opacity-10',]"
                @update:modelValue="updateOldPassword"
                @input-validity="validateOldPassword"
            />

            <div class="h-[1px] relative w-full my-10 fill-before before-divide before:border-t"></div>

            <ui-input
                v-for="(input,i) in newPasswordInputs"
                :id="input.id"
                :key="i"
                :model-value="input.model"
                type="password"
                :label="input.label"
                :autocomplete="input.autocomplete"
                :placeholder="input.placeholder"
                :validate="input.validate"
                :pattern="passwordPattern"
                :disabled="input.disabled"
                :main-class="['rounded-md bg-blue-gray-50 dark:bg-blue-gray-900 md:h-[64px] rounded-md bg-white dark:bg-blue-gray-900 md:h-[64px] border border-black dark:border-white border-opacity-10 dark:border-opacity-10', {
                    'mt-4': i == 1
                }]"
                @input-validity="input.inputValidity"
                @update:modelValue="input.onUpdate"
            />

            <div class="w-full pt-4">
                <div class="flex justify-between items-center mt-8 mx-2">
                    <label
                        for="end-sessions"
                        class="flex-grow cursor-pointer"
                    >End all other active sessions</label>

                    <ui-switch id="end-sessions" v-model="form.endSessions" />
                </div>

                <p class="text-sm opacity-70 mt-1 mx-2">
                    {{
                        form.endSessions ? 'This account will be logged out from all other devices.' : ''
                    }}
                </p>
            </div>
        </ui-form>

        <tab-footer full-bleed>
            <div class="mt-6 flex w-full justify-center">
                <ui-btn
                    class="gap-x-2 px-6 h-[48px]"
                    :class="{
                        'bg-green-700 text-white dark:bg-green-400 dark:text-blue-gray-900 hover:bg-green-800 dark:hover:bg-green-500': !disableSubmit
                    }"
                    :disabled="disableSubmit"
                >
                    <ui-icon name="save" />Update password
                </ui-btn>
            </div>
        </tab-footer>
    </div>
</template>

<script>
import tabFooter from './tabFooter.vue';
import uiSwitch from '~/components/uiSwitch.vue';


const passwordRegExpStr = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,32}$'

const passwordRegExp = new RegExp(`${passwordRegExpStr}`)

export default {
    name: 'ChanePasswordTab',

    components: { uiSwitch, tabFooter },

    data: () => ({
        passwordPattern: passwordRegExpStr,
        form: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            endSessions: false
        },

        validatePasswords: {
            oldPassword: false,
            newPassword: false,
            confirmPassword: false
        }
    }),

    computed: {

        user() {
            return this.$store.getters.userInfo;
        },

        newPasswordInputs() {
            return [

                {
                    model: this.form.newPassword,
                    label: 'New password',
                    placeholder: '6+ characters',
                    id: 'new-password-input',
                    autocomplete: 'new-password',
                    validate: e => {
                        const validatePassword = this.validatePassword(e);

                        if (typeof validatePassword == 'string') {
                            return validatePassword
                        }

                        if (this.form.newPassword == this.form.oldPassword) {
                            return 'New password must be different'
                        }

                        return true
                    },
                    inputValidity: e => {
                        if (this.form.newPassword) {
                            this.validatePasswords.newPassword = e
                        }
                    },
                    onUpdate: e => {
                        this.form.newPassword = e
                    },
                    disabled: !this.validatePasswords.oldPassword
                },

                {
                    model: this.form.confirmPassword,
                    label: 'Confirm password',
                    placeholder: 'Must match new password',
                    id: 'confirm-password-input',
                    autocomplete: 'new-password',
                    validate: e => {
                        const validatePassword = this.validatePassword(e);

                        if (typeof validatePassword == 'string') {
                            return validatePassword
                        }

                        if (this.form.newPassword != this.form.confirmPassword) {
                            return 'Password must match'
                        }

                        return true
                    },
                    inputValidity: e => {
                        if (this.form.confirmPassword) {
                            this.validatePasswords.confirmPassword = e
                        }
                    },
                    onUpdate: e => {
                        this.form.confirmPassword = e
                    },
                    disabled: !this.validatePasswords.oldPassword || !this.validatePasswords.newPassword
                },

            ]
        },

        disableSubmit() {
            return !this.validatePasswords.oldPassword || !this.validatePasswords.newPassword || !this.validatePasswords.confirmPassword
        }
    },

    methods: {
        validateOldPassword(e) {
            this.validatePasswords.oldPassword = e
        },
        updateOldPassword(val) {
            this.form.oldPassword = val
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
        }
    }
}
</script>

<style>
</style>