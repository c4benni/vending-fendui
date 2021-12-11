<template>
    <header
        class="h-[64px] lg:h-[80px] w-full lg:w-[calc(100vw-280px)] lg:left-[280px] grid gap-x-1 justify-between pl-4 pr-6 grid-flow-col items-center fill-before-after before:border-b before:border-black before:border-opacity-10 dark:before:border-white dark:before:border-opacity-10 before:transition-opacity after"
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
                class="p-0 w-[48px] h-[48px] rounded-full mr-1 transform-gpu"
                :class="{
                    'scale-0 opacity-0 pointer-events-none': searching
                }"
                :tabindex="searching ? '-1' : undefined"
                @click="openMobileNav"
            >
                <ui-icon name="menu" size="20px"></ui-icon>
            </ui-btn>

            <ui-btn
                title="search"
                class="p-0 w-[48px] h-[48px] rounded-full transform-gpu"
                to="/dashboard/search"
                :class="{
                    'translate-x-[calc(0px-100%-1rem)]': searching && mobileHeader
                }"
                tabindex="-1"
            >
                <ui-icon name="magnify" size="20px"></ui-icon>
            </ui-btn>
        </div>

        <div class="flex items-center">
            <ui-btn
                title="toggle theme"
                class="p-0 w-[48px] h-[48px] rounded-full transform-gpu"
                :class="{
                    'scale-0 opacity-0 pointer-events-none': searching
                }"
                :style="{
                    'transition-delay': searching ? undefined : '60ms'
                }"
                :tabindex="searching ? '-1' : undefined"
                @click="$theme.light = !$theme.light"
            >
                <ui-icon :name="$theme.light ? 'lightMode' : 'darkMode'" size="20px"></ui-icon>
            </ui-btn>

            <ui-btn
                v-for="(item, i) in icons"
                :key="i"
                :title="item.title"
                class="p-0 w-[48px] h-[48px] rounded-full transform-gpu"
                :class="{
                    'scale-0 opacity-0 pointer-events-none': searching
                }"
                :style="{
                    'transition-delay': searching ? `${(i + 1) * 30}ms` : `${(icons.length - (i + 1)) * 30}ms`
                }"
                :tabindex="searching ? '-1' : undefined"
            >
                <ui-icon
                    size="20px"
                    :name="item.name"
                    @click="() => $commit('UPDATE', { path: 'mobileNav', value: true })"
                ></ui-icon>
            </ui-btn>

            <ui-btn
                title="profile"
                class="p-0 w-[32px] h-[32px] min-h-[32px] rounded-full transform-gpu"
                :class="{
                    'scale-0 opacity-0 pointer-events-none': searching
                }"
                :style="{
                    'transition-delay': searching ? '60ms' : undefined
                }"
                :tabindex="searching ? '-1' : undefined"
            >
                <app-img :public-id="user.image" height="32px" width="32px" class="object-contain"></app-img>
            </ui-btn>
        </div>

        <form v-if="showSearchInput" action="." name="search-app" class="absolute w-full h-full">
            <input
                :value="$route.query.query"
                type="search"
                autofocus
                class="w-full h-full pl-[calc(48px+1rem)] pr-3 bg-[transparent] rounded-none"
                @input="handleSearchInput"
                @blur="handleSearchBlur"
            />
        </form>
    </header>
</template>

<script>
import uiIcon from '../uiIcon.vue'
export default {
    name: 'DashboardHeader',
    components: { uiIcon },
    props: {
        raise: Boolean,
        searching: Boolean
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
        ],
        showSearchInput: false,
    }),
    computed: {
        mobileHeader() {
            return /xxs|xs|sm|md/.test(this.$store.state.breakpoints.is)
        },
        user() {
            return this.$store.state.user || {}
        }
    },
    watch: {
        searching(n) {
            if (n) {
                requestAnimationFrame(() => (this.showSearchInput = true))
            } else {
                this.showSearchInput = false
            }
        }
    },
    created() {
        this.showSearchInput = this.searching;
    },
    methods: {
        openMobileNav() {
            if (this.mobileHeader) {
                this.$commit('UPDATE', {
                    path: 'mobileNav',
                    value: true
                })
            }
        },

        handleSearchInput(e) {
            this.$router.replace({
                query: {
                    ...this.$route.query,
                    query: e.currentTarget.value
                }
            });
        },

        handleSearchBlur() {
            if (!this.$route.query.query) {
                this.$router.replace({
                    query: {
                        ...this.$route.query,
                        query: undefined
                    }
                })
            }
        }
    }
}
</script>

<style>
</style>