<template>
    <div
        :key="isLogin + fetchKey"
        class="root w-[100%] h-[100%] grid justify-items-center items-center grid-cols-[1fr] grid-rows-[auto,1fr] fade-slide-x-appear"
    >
        <div
            v-if="message"
            role="alert"
            class="p-4 min-h-[72px] min-w-[calc(100%-3rem)] lg:min-w-[70%] mx-auto mt-6 grid grid-flow-col grid-cols-[36px,1fr] m-4"
            :class="[
            {
                'bg-red-800 dark:bg-red-500 rounded-md border-[1px] border-red-600 dark:border-red-400 text-white': message.error,
                'bg-green-800 dark:bg-green-500 rounded-md border-[1px] border-green-600 dark:border-green-400 text-white dark:text-black': !message.error
            }]"
            style="animation-direction: reverse;"
        >
            <ui-icon :name="message.error ? 'alert' : 'check'" class="text-[inherit]" />
            {{ message.text }}
        </div>

        <div
            class="max-w-[660px] xl:max-w-[780px] w-[100%] h-[100%] p-6"
            :class="[{
                'mt-[72px]': !message,
                'mt-[48px]': !message,
            }]"
        >
            <div aria-label="already have an account" class="my-4 hidden lg:block">
                <h2
                    class="text-base font-normal text-right text-blue-gray-900 dark:text-blue-gray-100"
                >
                    {{ loginText.h2 }}
                    <nuxt-link :to="loginText.to" class="text-blue-400 hover:underline">
                        {{
                            loginText.nuxtLink
                        }}
                    </nuxt-link>
                </h2>
            </div>

            <h3
                class="text-2xl font-bold tracking-tighter mb-2 text-blue-gray-800 dark:text-blue-gray-100"
            >
                {{
                    loginText.h3
                }}
            </h3>
            <h4
                class="font-normal text-base text-blue-gray-600 dark:text-blue-gray-200 text-opacity-70 dark:text-opacity-50"
            >{{ loginText.h4 }}</h4>

            <ui-form
                name="sign-up"
                action="/register"
                method="post"
                class="my-8 grid"
                :submit-class="[
                    'text-white w-full h-[48px] mx-auto md:max-w-[580px] xl:max-w-[620px] form-action hover:shadow-none hover:bg-blue-900 dark:hover:bg-blue-700',
                    {
                        'bg-blue-800 dark:bg-blue-600': !disableSubmit,
                        'mt-[96px]': !isLogin,
                        'mt-[64px]': isLogin
                    }
                ]"
                :submit-data="{
                    attrs: {
                        'data-onboard': disableSubmit ? undefined : ''
                    },
                    props: {
                        disabled: disableSubmit
                    }
                }"
                @submit-form="submitForm"
            >
                <template #submitText>
                    {{ loginText.formBtn }}
                    <div v-if="isLoading" class="spinner-border"></div>
                </template>

                <ui-input
                    v-for="(item, i) in inputConfig"
                    :id="item.id"
                    :key="i"
                    :model-value="item.model"
                    :label="item.label"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    :pattern="item.pattern"
                    :validate="item.validate"
                    :main-class="['rounded-md bg-blue-gray-50 dark:bg-blue-gray-900 md:h-[64px] rounded-md bg-white dark:bg-blue-gray-900 md:h-[64px] border border-black dark:border-white border-opacity-10 dark:border-opacity-10', { 'mt-4': i == 1 }]"
                    required
                    :autocomplete="item.autocomplete"
                    @update:modelValue="item.onUpdate"
                    @input-validity="item.validity"
                />

                <h5
                    v-if="!isLogin"
                    class="text-normal font-bold mt-8 dark:text-gray-50 text-gray-600 opacity-70"
                >Choose type of account</h5>

                <div
                    v-if="!isLogin"
                    class="grid items-center justify-flex-start mt-2 w-full gap-x-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
                >
                    <ui-btn
                        v-for="(item, i) in accountRole"
                        :key="i"
                        tag="div"
                        outlined
                        :outlined-opacity="form.role == item.title ? '.35' : '.1'"
                        :outlined-stroke="form.role == item.title ? '2px' : '1.5px'"
                        :outlined-class="form.role == item.title ? 'border-blue-600 dark:border-blue-400' : ''"
                        size="lg"
                        class="px-6 dark:hover:bg-blue-gray-800 hover:bg-blue-gray-100 hover:bg-opacity-70 dark:hover:text-white hover:text-black w-full justify-start my-1 grid-cols-1 h-[96px] content-center rounded-sm"
                        :class="[{
                            'dark:bg-blue-gray-800 dark:text-white bg-blue-gray-300 text-black': form.role == item.title,
                        }]"
                        @click="() => form.role = item.title"
                    >
                        <div class="grid h-full w-full text-left">
                            <div
                                class="capitalize text-left relative grid items-center text-blue-gray-900 dark:text-blue-gray-50"
                            >
                                {{ item.title }}
                                <ui-icon
                                    v-if="form.role == item.title"
                                    name="check"
                                    size="24px"
                                    class="absolute right-0 rounded-full bg-blue-800 dark:bg-blue-600 w-[28px] h-[28px] opacity-100 text-white"
                                />
                            </div>

                            <div
                                class="font-light text-sm text-opacity-80 dark:text-opacity-50 dark:text-blue-gray-50 text-blue-gray-900"
                            >{{ item.subtitle }}</div>
                        </div>
                    </ui-btn>
                </div>

                <div v-if="!isLogin" class="grid gap-x-2 justify-start grid-flow-col mt-8">
                    <div>
                        <input
                            id="terms-conditions"
                            v-model="form.termsAndConditions"
                            type="checkbox"
                            class="h-[24px] w-[24px] opacity-0 absolute cursor-pointer"
                            required="required"
                        />
                        <ui-icon
                            :key="form.termsAndConditions"
                            :name="form.termsAndConditions ? 'checkboxChecked' : 'blankCheckboxOutline'"
                            class="fade-appear pointer-events-none"
                            :svg-class="[{
                                'bg-blue-800 dark:bg-blue-600 text-white': form.termsAndConditions
                            }]"
                        />
                    </div>

                    <label
                        for="terms-conditions"
                        class="cursor-pointer active:scale-[0.99] transition-transform text-opacity-70 text-blue-gray-900 dark:text-cool-gray-50"
                        :class="[{
                            'text-opacity-80': form.termsAndConditions
                        }]"
                    >Agree to terms and conditions</label>
                </div>
            </ui-form>
            <div aria-label="already have an account" class="my-4 lg:hidden">
                <h5
                    class="text-base font-normal text-left text-blue-gray-900 dark:text-blue-gray-100"
                >
                    {{ loginText.h2 }}
                    <nuxt-link :to="loginText.to" class="text-blue-400">
                        {{
                            loginText.nuxtLink
                        }}
                    </nuxt-link>
                </h5>
            </div>
        </div>
    </div>
</template>

<script>
const defaultFields = () => ({
    username: '',
    password: '',
    role: '',
    termsAndConditions: false
})
export default {
    name: 'Onboard',

    data: () => ({
        fetchKey: null,
        message: null,
        isLoading: false,
        userDetail: {},
        form: defaultFields(),

        validFields: {
            username: false,
            password: false
        },

        accountRole: [
            { title: 'buyer', subtitle: 'Deposit coins and buy items' },
            { title: 'seller', subtitle: 'Add products and monitor your profit' },
        ],
    }),

    head() {
        return {
            title: this.isLogin ? 'Login' : 'Register'
        }
    },

    computed: {

        loginText() {
            return {
                to: !this.isLogin ? '/?login=true' : '/',
                nuxtLink: this.isLogin ? 'Register' : 'Sign in',
                h2: this.isLogin ? "Don't have an account?" : 'Already have an account?',
                h3: !this.isLogin ? `Get started, it's free.` : `Welcome back!`,
                h4: !this.isLogin ? `Start buying and selling easily anywhere you are` : `Login to view your activities`,
                formBtn: this.isLoading ? '' : (this.isLogin ? 'LOGIN' : 'REGISTER')
            }
        },
        isLogin() {
            return this.$route.query.login == 'true'
        },
        disableSubmit() {
            if (this.isLoading) {
                return true
            }

            const form = [
                ...Object.values(this.validFields),
                !this.isLogin && this.form.termsAndConditions
            ].filter(Boolean)

            if (!this.isLogin) {
                const fieldsValid = form.length == 3
                    && !form.includes(false)
                    && !!this.form.role

                return !fieldsValid
            }

            const fieldsValid = form.length == 2
                && !form.includes(false)

            return !fieldsValid
        },
        inputConfig() {
            const passwordRegExpStr = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,32}$'

            const passwordRegExp = new RegExp(`${passwordRegExpStr}`)
            return [
                {
                    id: 'username-field',
                    validity: e => {
                        console.log(e);
                        this.validFields.username = e
                    },
                    autocomplete: 'username',
                    onUpdate: e => {
                        this.form.username = e
                    },
                    label: 'Username',
                    model: this.form.username,
                    validate: val => {
                        const e = val?.trim()

                        if (!e) { return 'Required' }

                        if (e.length < 3) {
                            return 'Min length is 3'
                        }

                        if (e.length > 99) {
                            return 'Max length is 99'
                        }

                        return true;
                    },
                    pattern: '^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$',
                },

                {
                    id: 'password-field',
                    autocomplete: 'new password',
                    onUpdate: e => {
                        this.form.password = e
                    },
                    label: 'Password',
                    model: this.form.password,
                    placeholder: '6+ characters',
                    type: 'password',
                    validity: e => {
                        this.validFields.password = e
                    },
                    validate: val => {
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
                    pattern: passwordRegExpStr,
                }
            ]
        }
    },

    watch: {
        async isLogin() {
            this.message = null;

            await this.$sleep(50)

            scrollTo(0, 0)
        }
    },

    methods: {
        async submitForm() {
            this.message = null;
            this.isLoading = true;

            const { username, password, role } = this.form;

            const form = { username, password }

            if (!this.isLogin) {
                form.role = role
            }

            const res = await fetch(`api/v1/user/${this.isLogin ? 'login' : 'register'}`, {
                method: 'post',
                body: JSON.stringify(form),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            const { data, error } = await res.json()

            this.form.termsAndConditions = false

            this.fetchKey = Date.now()

            scrollTo(0, 0)

            if (error) {
                this.form.password = '';

                this.message = {
                    text: error.message,
                    error: true
                }
            }
            // don't show success message on login as we re-route immediately
            else if (!this.isLogin) {
                this.form = defaultFields();

                this.message = {
                    text: 'Account created successfully!',
                    error: false
                }

                await this.$sleep(1000)

                this.isLoading = false;

                await this.$sleep(7000)

                this.message = null

                return
            }

            this.isLoading = false;


            if (data) {

                this.$commit('UPDATE', {
                    path: 'user',
                    value: data
                })

                await this.$sleep();
                this.$router.replace('/dashboard')

                this.form = defaultFields()
            }
        }
    }
}
</script>


<style>
.dark-theme .form-action[data-onboard] {
    box-shadow: rgb(0 69 255 / 14%) 0px 8px 16px 0px;
}

.dark-theme .form-action[data-onboard] {
    box-shadow: rgb(0 69 255 / 14%) 0px 8px 16px 0px;
}

.root {
    animation-duration: 150ms;
}
</style>