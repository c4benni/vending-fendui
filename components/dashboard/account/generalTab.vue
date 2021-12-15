<template>
    <div
        class="card p-0 mt-6 md:m-6 fill-before before-divide before:border relative max-w-[660px] mx-auto self-start justify-self-center"
        :class="{
            'invisible': !pageActive
        }"
    >
        <!-- header image -->
        <div class="h-[200px] md:h-[250px] relative">
            <div
                class="h-full rounded-t-md overflow-hidden fill-before relative before-divide before:border-b isolate"
            >
                <app-img alt="header image" :public-id="media.header" />

                <div
                    class="absolute bg-black bg-opacity-50 w-full h-full grid items-center justify-center text-white transition-opacity opacity-0 hover:opacity-100 z-10 top-0"
                >
                    <ui-btn class="w-[48px] h-[48px] rounded-full">
                        <ui-icon name="upload" size="32" />
                    </ui-btn>
                </div>
            </div>

            <ui-btn
                class="w-[96px] h-[96px] md:w-[128px] md:h-[128px] rounded-full absolute md:bottom-[-64px] bottom-[-48px] left-3 md:left-6 p-0"
                outlined
                outlined-opacity="0.1"
            >
                <app-img
                    alt="account image"
                    :public-id="userImage"
                    class="w-full h-full absolute rounded-full object-cover"
                    radius="max"
                    fetch-format="auto"
                    quality="100"
                />

                <div
                    class="absolute bg-black bg-opacity-50 w-full h-full grid items-center justify-center text-white transition-opacity opacity-0 hover:opacity-100"
                >
                    <ui-icon name="upload" size="32" />
                </div>
            </ui-btn>
        </div>
        <!-- header ends -->

        <p class="text-right opacity-70 text-sm mt-2 right-6 absolute w-full">{{ getBalance }}</p>

        <div class="md:mt-[64px] mt-[48px] px-6 pt-6">
            <h2 class="text-lg font-bold">Profile information</h2>

            <ui-form name="profile-information" class="mt-3 mb-6" :show-submit="false">
                <ui-input
                    v-for="(input, i) in informationInput"
                    :id="input.id"
                    :key="i"
                    :model-value="input.model"
                    :type="input.type"
                    :disabled="input.disabled"
                    :label="input.label"
                    :autocomplete="input.autocomplete"
                    :placeholder="input.placeholder"
                    :validate="input.validate"
                    :main-class="['rounded-md bg-blue-gray-50 dark:bg-blue-gray-900 md:h-[64px] rounded-md bg-white dark:bg-blue-gray-900 md:h-[64px] border border-black dark:border-white border-opacity-10 dark:border-opacity-10', { 'mt-4': i != 0 }]"
                    @update:modelValue="input.onUpdate"
                    @input-validity="input.inputValidity"
                />

                <div class="w-full">
                    <div class="flex justify-between items-center mt-8 mx-2">
                        <label
                            for="public-profile"
                            class="flex-grow cursor-pointer"
                        >Make profile information public</label>

                        <ui-switch id="public-profile" v-model="form.publicProfile" />
                    </div>

                    <p class="text-sm opacity-70 mt-1 mx-2">
                        {{
                            form.publicProfile ? 'Your profile information will be visible to all registered users.' : 'Your profile information will be kept hidden.'
                        }}
                    </p>
                </div>
            </ui-form>
            <tab-footer
                :disable-revert="!formUpdated"
                :disable-save="disableSave"
                @save-changes="submit"
                @revert-changes="resetForm"
            />
        </div>
    </div>
</template>

<script>
import tabFooter from './tabFooter.vue';
import appImg from '~/components/appImg.vue'
import uiSwitch from '~/components/uiSwitch.vue';

import { capitalize, computedBR } from '~/utils/main';
import user from '~/services/user';
export default {
    name: 'GeneralTab',

    components: { appImg, uiSwitch, tabFooter },

    data: () => ({
        form: {
            username: '',
            displayName: '',
            bio: '',
            publicProfile: false
        },

        validateFields: {
            username: true,
            displayName: true,
            bio: true
        }
    }),

    computed: {
        ...computedBR,
        activeTab() {
            return this.$route.query.tab
        },
        pageActive() {
            return this.activeTab == 'general' || !/preference|change-password|delete-account/.test(this.activeTab)
        },
        media() {
            return this.$store.state.media
        },
        user() {
            return this.$store.getters.userInfo;
        },
        isBuyer() {
            return this.user.isBuyer
        },
        isSeller() {
            return this.user.isSeller
        },
        getBalance() {
            if (!this.$store.state.showBalance) {
                return '*****'
            }

            const balancePath = this.isBuyer ? 'deposit' : 'income'

            return `Total ${balancePath}: ${this.user[
                `${balancePath}Total`
            ]}`
        },

        miniDevice() {
            return /xxs|xs|sm/.test(this.breakpoints.is)
        },

        userImage() {
            return this.user.image || '/samples/people/boy-snow-hoodie'
        },


        informationInput() {
            return [
                {
                    model: this.form.username,
                    placeholder: 'username',
                    label: 'Username',
                    id: 'username-input',
                    autocomplete: 'username',
                    validate: input => {
                        if (!input) {
                            return 'Required'
                        }

                        const e = input.trim()


                        if (e.length < 3) {
                            return 'Min length is 3'
                        }

                        if (e.length > 20) {
                            return 'Max length is 20'
                        }

                        return true
                    },
                    onUpdate: e => {
                        this.form.username = e
                    },
                    inputValidity: e => {
                        if (this.form.username) {
                            this.validateFields.username = e
                        }
                    },
                },
                {
                    disabled: true,
                    model: capitalize(this.user.role),
                    label: 'Account type',
                    id: 'role-input',
                    onUpdate: () => { },
                    inputValidity: () => { }
                },

                {
                    model: this.form.displayName,
                    label: 'Display name',
                    placeholder: 'David Mark',
                    id: 'display-name-input',
                    autocomplete: 'name',
                    pattern: '^([a-zA-Z0-9\\s]){3,99}$',
                    validate: input => {
                        if (input) {
                            const e = input.trim()

                            if (!/^([a-zA-Z0-9\s]){3,99}$/.test(e)) {
                                return 'Invalid character(s)'
                            }

                            if (e.length < 3) {
                                return 'Min length is 3'
                            }

                            if (e.length > 99) {
                                return 'Max length is 99'
                            }
                        }

                        return true
                    },
                    onUpdate: e => {
                        this.form.displayName = e
                    },
                    inputValidity: e => {
                        if (this.form.displayName) {
                            this.validateFields.displayName = e
                        }
                    },
                },

                {
                    model: this.form.bio,
                    label: 'Bio',
                    type: 'textarea',
                    placeholder: 'Something about you',
                    id: 'bio-input',
                    autocomplete: 'bio-input',
                    validate: input => {

                        if (input) {
                            const e = input.trim()

                            if (e.length < 3) {
                                return 'Min length is 3'
                            }
                        }

                        return true
                    },
                    onUpdate: e => {
                        this.form.bio = e
                    },
                    inputValidity: e => {
                        if (this.form.bio) {
                            this.validateFields.bio = e
                        }
                    },
                },

            ]
        },

        formUpdated() {
            const usernameUpdated =
                this.form.username !== this.user.username

            const displayNameUpdated =
                this.form.displayName !== this.user.displayName

            const bioUpdated =
                this.form.bio !== this.user.bio

            const publicProfileUpdated =
                this.form.publicProfile !== this.user.publicProfile

            return usernameUpdated || displayNameUpdated || bioUpdated || publicProfileUpdated
        },

        disableSave() {
            return !this.formUpdated
                || Object.values(this.validateFields).includes(false)
        },

        submitPayload() {

            const {
                username, displayName, bio, publicProfile
            } = this.form;

            const payload = {
                displayName, bio, publicProfile
            }


            if (username !== this.user.username) {
                payload.username = username
            }

            for (const key in payload) {
                if (!payload[key]) {
                    delete payload[key]
                }
            }

            return payload
        }
    },

    created() {
        this.resetForm()
    },

    methods: {
        resetForm() {
            this.form.username = this.user.username
            this.form.displayName = this.user.displayName
            this.form.bio = this.user.bio
            this.form.publicProfile = this.user.publicProfile
        },
        async submit() {
            if (this.disableSave) {
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
                    title: 'Updating information',
                    subtitle: 'Please wait while we update your profile information.',
                    key: Date.now()
                }
            })

            const payload = { ...this.submitPayload }

            const { data, error } = await user.updateUser.call(this, payload)

            this.$commit('UPDATE', {
                path: 'processingDone',
                value: {
                    title: error ? 'An error occured' : 'Profile updated!',
                    subtitle: error?.message || data?.message,
                    error: !!error,
                    key: Date.now()
                }
            })

            await this.$sleep()

            await this.$refreshUser()
        }
    }
}
</script>

<style>
</style>