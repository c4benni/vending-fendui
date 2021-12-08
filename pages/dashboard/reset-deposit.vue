<template>
    <div
        class="lg:w-[calc(100vw-280px)] xl:w-[calc(calc(min(100vw,1920px)-3rem)-280px)] w-full pb-10 min-h-screen"
    >
        <div class="h-[250px] grid justify-center">
            <app-img :public-id="resetDeposit" height="250px" />

            <p class="mt-6 font-semibold text-lg opacity-80 text-center">
                {{
                    emptyDeposit ? 'You have nothing to clear' : 'Are you sure about this action?'
                }}
            </p>

            <div
                class="grid grid-flow-col grid-cols-[repeat(autofill,minmax(250px,1fr))] mt-8 justify-center gap-x-1"
            >
                <UiBtn
                    v-for="(item, i) in actions"
                    :key="i"
                    class="h-[48px] px-6"
                    :class="[
                        {
                            'bg-red-800 text-white dark:bg-red-400  dark:text-black': i == 1,
                            'bg-blue-800 text-white dark:bg-blue-400  dark:text-black': i == 0 && emptyDeposit
                        }
                    ]"
                    :to="item.to"
                    :tag="item.to ? 'nuxt-link' : undefined"
                    @click="() => !item.to && reset()"
                >{{ item.title }}</UiBtn>
            </div>
        </div>
    </div>
</template>

<script>
import UiBtn from "~/components/UiBtn.vue"
export default {
    components: { UiBtn },
    head() {
        return {
            title: 'Reset deposit'
        }
    },
    computed: {
        emptyDeposit() {
            return false
        },
        resetDeposit() {
            return this.$store.state.media[this.emptyDeposit ? 'empty' : 'alert'];
        },
        actions() {
            return !this.emptyDeposit ? [
                {
                    title: 'Cancel',
                    to: '/dashboard'
                },
                {
                    title: 'Reset deposit'
                }
            ] : [
                {
                    title: 'Deposit coins',
                    to: '/dashboard/deposit'
                }
            ]
        }
    },

    methods: {
        reset() {
            this.$commit('UPDATE_', {
                path: 'notify',
                value: {
                    message: 'This action will reset your deposit to zero. Are you sure about this?',
                    warn: true,
                    closeText: 'Clear deposit',
                    callback: async () => {
                        await this.$apiCall('/api/v1/reset', 'POST')

                        await this.$sleep(100);

                        this.$commit('UPDATE_', {
                            path: 'notify',
                            value: {
                                key: Date.now(),
                                message: null
                            }
                        })
                    },
                    key: Date.now()
                }
            })

        }
    }
}

</script>

<style>
</style>