<template>
    <div
        class="mt-10 relative fill-before before-divide before:border-t"
        :class="{ 'py-6': !fullBleed, 'pt-6': fullBleed }"
    >
        <slot></slot>

        <div v-if="showActions" class="flex justify-between w-full mt-[24px]">
            <ui-btn
                v-for="(action, i) in actions"
                :key="i"
                :text="action.text"
                :disabled="action.disabled"
                :class="action.classList"
                @click="action.onClick"
            >{{ action.title }}</ui-btn>
        </div>

        <div class="relative fill-before before-divide before:border-t mt-[48px] pt-6">
            <!-- alert -->
            <div
                class="rounded-sm md:mx-auto p-3 fill-before relative before-divide before:border flex justify-start bg-blue-700 dark:bg-blue-400 items-start w-[fit-content] bg-opacity-30 dark:bg-opacity-30"
                :class="{ 'mx-6': fullBleed }"
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
                    :component-props="{ replace: true }"
                    class="font-normal text-blue-700 dark:text-blue-500 px-0"
                    :class="{ invisible: !leftPaddel.text, 'ml-6': fullBleed }"
                >
                    <ui-icon name="chevron-left" />
                    {{ leftPaddel.text }}
                </ui-btn>

                <ui-btn
                    :to="rightPaddel.to"
                    :component-props="{ replace: true }"
                    class="font-normal px-0"
                    :class="{
                        invisible: !rightPaddel.text, 'mr-6': fullBleed,
                        'text-blue-700 dark:text-blue-500': !rightPaddel.warn,
                        'text-red-700 dark:text-red-500': rightPaddel.warn,
                    }"
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
    props: {
        fullBleed: Boolean,
        disableRevert: Boolean,
        disableSave: Boolean
    },
    computed: {
        showActions() {
            return !this.$slots.default?.length
        },
        actions() {
            return [
                {
                    title: 'Revert changes',
                    text: true,
                    onClick: () => {
                        this.$emit('revert-changes')
                    },
                    classList: [
                        'pl-0 font-normal',
                        {
                            'text-red-700 dark:text-red-500': !this.disableRevert,
                            'opacity-40': this.disableRevert,
                            'ml-6': this.fullBleed
                        }
                    ],
                    disabled: this.disableRevert
                },
                {
                    title: 'Save changes',
                    onClick: () => {
                        this.$emit('save-changes')
                    },
                    classList: [
                        {
                            'bg-green-700 text-white dark:bg-green-400 dark:text-blue-gray-900 hover:bg-green-800 dark:hover:bg-green-500': !this.disableSave,
                            'opacity-60': this.disableSave,
                            'mr-6': this.fullBleed
                        }
                    ],
                    disabled: this.disableSave
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
                to: {
                    query: {
                        ...this.$route.query,
                        tab: previousTitle,
                    }
                }
            }
        },

        rightPaddel() {

            if (this.activeTab == 'delete-account') {
                return {}
            }

            const nextTitle = (this.activeTab == 'general' || !this.activeTab || !/preference|change-password|delete-account/.test(this.activeTab)) ? 'preference' : this.activeTab == 'preference' ? 'change-password' : 'delete-account'

            return {
                text: capitalize(nextTitle).replace(/-/g, '   '),
                to: {
                    query: {
                        ...this.$route.query,
                        tab: nextTitle,
                    }
                },
                warn: nextTitle == 'delete-account'
            }
        }
    },

}
</script>