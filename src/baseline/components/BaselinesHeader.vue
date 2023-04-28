<template>
    <div class="bg-slate-50 border-b border-slate-300 table-header">
        <h1 class="text-2xl px-10 pt-5 text-slate-700">Baselines</h1>
        <div class="pt-2 px-7 flex">
            <router-link class="nav-item" :to="{name: 'baseline-table'}">
                <icon icon="table" class="mr-1 text-sm" />
                Baseline Table
            </router-link>
            <router-link class="nav-item" :to="{name: 'new-baseline'}">
                <icon icon="plus" class="mr-1 text-sm" />
                New Baseline
            </router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.table-header .nav-item {
    @apply px-4 py-3 block border-b -mb-[1px] border-transparent;
    &.router-link-active {
        @apply text-blue-700 border-b border-blue-700;
    }
}
</style>

