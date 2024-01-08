<template>
    <div class="bg-slate-50 border-b border-slate-300 table-header">
        <h1 class="text-2xl px-10 pt-5 text-slate-700">Users</h1>
        <div class="pt-2 px-7 flex">
            <router-link class="nav-item" :to="{name: 'user-table'}">
                <icon icon="table" class="mr-1 text-sm" />
                Users
            </router-link>
            <router-link class="nav-item" :to="{name: 'registration-table'}">
                <icon icon="table" class="mr-1 text-sm" />
                Registrations
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
<script setup lang="ts">
</script>