<template>
    <header
        class="h-[64px] lg:h-[80px] w-full lg:w-[calc(100vw-280px)] lg:left-[280px] grid gap-x-1 justify-between pl-4 pr-6 grid-flow-col items-center fill-before before:border-b before:border-black before:border-opacity-10 dark:before:border-white dark:before:border-opacity-10 before:transition-opacity"
        :class="{
            'before:opacity-0': !raise,
            'before:opacity-100': raise,
        }"
        style="background: var(--theme-background);"
    >
        <div>
            <ui-btn
                v-if="mobileHeader"
                title="search"
                class="p-0 w-[48px] h-[48px] rounded-full mr-1"
                @click="openMobileNav"
            >
                <ui-icon name="menu" size="20px"></ui-icon>
            </ui-btn>

            <ui-btn title="search" class="p-0 w-[48px] h-[48px] rounded-full">
                <ui-icon name="magnify" size="20px"></ui-icon>
            </ui-btn>
        </div>

        <div class="flex items-center">
            <ui-btn
                title="toggle theme"
                class="p-0 w-[48px] h-[48px] rounded-full"
                @click="$theme.light = !$theme.light"
            >
                <ui-icon :name="$theme.light ? 'lightMode' : 'darkMode'" size="20px"></ui-icon>
            </ui-btn>

            <ui-btn
                v-for="(item, i) in icons"
                :key="i"
                :title="item.title"
                class="p-0 w-[48px] h-[48px] rounded-full"
            >
                <ui-icon
                    size="20px"
                    :name="item.name"
                    @click="() => $commit('UPDATE_', { path: 'mobileNav', value: true })"
                ></ui-icon>
            </ui-btn>

            <ui-btn title="profile" class="p-0 w-[32px] h-[32px] min-h-[32px] rounded-full">
                <app-img
                    :public-id="$store.state.media.favIco"
                    height="32px"
                    width="32px"
                    class="object-contain"
                ></app-img>
            </ui-btn>
        </div>
    </header>
</template>

<script>
import uiIcon from '../uiIcon.vue'
export default {
    name: 'DashboardHeader',
    components: { uiIcon },
    props: {
        raise: Boolean
    },
    data: () => ({
        icons: [
            {
                name: 'bell',
                title: 'notifications'
            },
            {
                name: 'accountMultiple',
                title: 'contact'
            }
        ]
    }),
    computed: {
        mobileHeader() {
            return /xxs|xs|sm|md/.test(this.$store.state.breakpoints.is)
        }
    },
    methods: {
        openMobileNav() {
            if (this.mobileHeader) {
                this.$commit('UPDATE_', {
                    path: 'mobileNav',
                    value: true
                })
            }
        }
    }
}
</script>

<style>
</style>