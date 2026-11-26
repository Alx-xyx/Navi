<script>
import { logout, subscribeToAuthState } from '../services/auth';

export default {
    name: 'Navbar',
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            linkClass: `btn-aero text-aero-text rounded-full px-3 py-1 font-bold text-xs whitespace-nowrap block
                hover:brightness-110 active:translate-y-px transition`,
        };
    },
    computed: {
        links() {
            if (this.user.id !== null) {
                return [
                    { to: '/publicaciones', label: 'Publicaciones' },
                    { to: '/publicChat', label: 'Chat' },
                    { to: '/profile', label: 'Mi perfil' },
                ];
            }
            return [
                { to: 'aboutNavi', label: 'Navi' },
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Register' },
            ];
        },
    },
    methods: {
        async handleLogout() {
            try {
                await logout();
                this.$router.push('/login');
            } catch (error) {
                console.error("Error al cerrar sesion: ", error);
            }
        },
    },
    mounted() {
        this.unsubscribeAuth = subscribeToAuthState(userData => (this.user = userData));
    },
    unmounted() {
        this.unsubscribeAuth?.();
    },
};
</script>

<template>
    <nav class="glass rounded-3xl flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 mx-4 mt-4 text-aero-text">
        <RouterLink class="font-bold text-lg text-shadow-aero whitespace-nowrap" to="/">Social Navi</RouterLink>

        <ul class="flex flex-wrap items-center gap-2 ml-auto">
            <li v-for="link in links" :key="link.to">
                <RouterLink :to="link.to" :class="linkClass" exact-active-class="ring-2 ring-white/80">
                    {{ link.label }}
                </RouterLink>
            </li>

            <li v-if="user.id !== null">
                <button type="button" :class="linkClass" @click="handleLogout">Salir</button>
            </li>
        </ul>
    </nav>
</template>