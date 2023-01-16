<template>
    <div class="relative w-72 h-full">
        <div class="h-full bg-slate-100 border-r border-slate-300 w-72 fixed">
            <router-link class="logo" to="/">POWER TAC</router-link>
            <router-link class="nav-item" to="/game/new">New Game</router-link>
            <router-link class="nav-item" to="/game/table">Game Table</router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.logo {
    @apply block px-5 py-2;
    @apply text-center text-blue-700 uppercase font-extrabold;
}
.nav-item { @apply block }
</style>
