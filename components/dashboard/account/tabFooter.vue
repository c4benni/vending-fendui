<template>
    <div
        class="mt-10 relative fill-before before-divide before:border-t"
        :class="{ 'py-6': !fullBleed, 'pt-6': fullBleed }"
    >
        <slot></slot>

        <div v-if="showActions" class="flex justify-between w-full">
            <ui-btn
                v-for="(action, i) in actions"
                :key="i"
                :class="action.classList"
                @click="action.onClick"
            >{{ action.title }}</ui-btn>
        </div>

        <div class="relative fill-before before-divide before:border-t mt-[48px] pt-6">
            <!-- alert -->
            <div
                class="rounded-sm mx-auto p-3 fill-before relative before-divide before:border flex justify-start bg-blue-700 dark:bg-blue-400 items-start w-[fit-content] bg-opacity-30 dark:bg-opacity-30"
            >
                <ui-icon name="info" />

                <p
                    class="text-sm opacity-90 ml-[0.5rem]"
                    :class="{ 'mx-6': fullBleed }"
                >Please note that leaving this tab will automatically revert unsaved changes.</p>
            </div>
            <!-- alert ends -->

            <div class="pt-6 flex w-full justify-between items-center">
                <ui-btn
                    :to="leftPaddel.to"
                    class="font-normal text-blue-700 dark:text-blue-500 px-0"
                    :class="{ invisible: !leftPaddel.text, 'ml-6': fullBleed }"
                >
                    <ui-icon name="chevron-left" />
                    {{ leftPaddel.text }}
                </ui-btn>

                <ui-btn
                    :to="rightPaddel.to"
                    class="font-normal text-blue-700 dark:text-blue-500 px-0"
                    :class="{ invisible: !rightPaddel.text, 'mr-6': fullBleed }"
                >
                    {{ rightPaddel.text }}
                    <ui-icon name="chevron-right" />
                </ui-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { capitalize } from '~/utils/main'
export default {
    name: 'TabFooter',
    props: { fullBleed: Boolean },
    computed: {
        showActions() {
            return !this.$slots.default?.length
        },
        actions() {
            return [
                {
                    title: 'Revert changes',
                    onClick: () => {
                        this.$emit('revert-changes')
                    },
                    classList: [
                        'text-red-700 dark:text-red-500 pl-0 font-normal',
                        {
                            'ml-6': this.fullBleed
                        }
                    ],
                },
                {
                    title: 'Save changes',
                    onClick: () => {
                        this.$emit('save-changes')
                    },
                    classList: [
                        'bg-green-700 text-white dark:bg-green-400 dark:text-blue-gray-900 hover:bg-green-800 dark:hover:bg-green-500',
                        {
                            'mr-6': this.fullBleed
                        }
                    ]
                }
            ]
        },

        activeTab() {
            return this.$route.query.tab;
        },
        leftPaddel() {

            if (!this.activeTab || this.activeTab == 'general') {
                return {}
            }

            const previousTitle = this.activeTab == 'preference' ? 'general' : this.activeTab == 'change-password' ? 'preference' : 'change-password'

            return {
                text: capitalize(previousTitle).replace(/-/g, ' '),
                to: this.getTo(previousTitle)
            }
        },

        rightPaddel() {

            if (this.activeTab == 'delete-account') {
                return {}
            }

            const nextTitle = (this.activeTab == 'general' || !this.activeTab || !/preference|change-password|delete-account/.test(this.activeTab)) ? 'preference' : this.activeTab == 'preference' ? 'change-password' : 'delete-account'

            return {
                text: capitalize(nextTitle).replace(/-/g, '   '),
                to: this.getTo(nextTitle)
            }
        }
    },

    methods: {
        getTo(tab) {
            const route = this.$route

            let to = route.path

            Object.entries({
                ...route.query,
                tab,
            }).forEach((item, key) => {
                if (!item[1]) {
                    return
                }
                to += `${key == 0 ? '?' : '&'}${item[0]}=${item[1]}`
            })

            to += route.hash || ''

            return to
        }
    }
}
</script>

<style>
</style>