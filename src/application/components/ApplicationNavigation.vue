<template>
    <div class="relative w-56 h-full">
        <div class="h-full bg-slate-50 w-56 fixed">
            <router-link class="logo" to="/">POWER TAC</router-link>
            <router-link class="nav-item" to="/game/new">New Game</router-link>
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
