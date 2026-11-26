<script>
import { logout, subscribeToAuthState } from '../services/auth';

export default {
    name: 'Navbar',
    data() {
        return {
            links: [
                { to: '/aboutNavi', label: 'Navi' },
                { to: '/publicChat', label: 'Public Chat' },
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Register' },
            ],
            user: {
                id: null,
                email: null,
            }
        };
    },
    methods: {
        handleLogout() {
            try {
                logout();
                this.$router.push('/login');
            } catch (error) {
                console.error("Error al cerrar sesion: ", error);
            }
        }
    },
    mounted() {
        subscribeToAuthState(userData => this.user=userData);
    }
};
</script>

<template>
    <nav class="glass rounded-full flex items-center gap-8 px-6 py-3 mx-4 mt-4 text-aero-text">
        <RouterLink class="font-bold text-xl text-shadow-aero" to="/">Social Navi</RouterLink>

        <ul class="flex gap-3">
            <li>
                <RouterLink to="/aboutNavi" class="btn-aero text-aero-text rounded-full px-5 py-1 font-bold text-sm block
            hover:brightness-110 active:translate-y-px transition" exact-active-class="ring-2 ring-white/80">Navi
                </RouterLink>
            </li>

            <template v-if="user.id !== null">
                <li>
                    <RouterLink to="/publicChat" class="btn-aero text-aero-text rounded-full px-5 py-1 font-bold text-sm block
                hover:brightness-110 active:translate-y-px transition" exact-active-class="ring-2 ring-white/80">Public
                        Chat</RouterLink>
                </li>
                <li>
                    <RouterLink to="/profile" class="btn-aero text-aero-text rounded-full px-5 py-1 font-bold text-sm block
                hover:brightness-110 active:translate-y-px transition" exact-active-class="ring-2 ring-white/80">
                        Mi perfil</RouterLink>
                </li>
                <li>
                    <button type="button" @click="handleLogout" class="btn-aero text-aero-text rounded-full px-5 py-1 font-bold text-sm block
                hover:brightness-110 active:translate-y-px transition">Cerrar sesión</button>
                </li>
            </template>

            <template v-else>
                <li>
                    <RouterLink to="/login" class="btn-aero text-aero-text rounded-full px-5 py-1 font-bold text-sm block
                hover:brightness-110 active:translate-y-px transition" exact-active-class="ring-2 ring-white/80">Login
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/register" class="btn-aero text-aero-text rounded-full px-5 py-1 font-bold text-sm block
                hover:brightness-110 active:translate-y-px transition" exact-active-class="ring-2 ring-white/80">
                        Register</RouterLink>
                </li>
            </template>
        </ul>
    </nav>
</template>
