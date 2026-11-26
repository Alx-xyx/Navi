<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TitleH1 from '../components/TitleH1.vue';
import { login } from '../services/auth.js';

//&& ---------- ROUTER ---------- &/

const router = useRouter();

//** ---------- REFERENCIAS REACTIVAS ---------- */

const user = ref({
    email: '',
    password: ''
})

const loading = ref(false);

//~~ ---------- FUNCIONES ---------- ~/

async function handleSubmit() {
    try {
        loading.value = true;
        await login({
            email: user.value.email,
            password: user.value.password,
        })
        router.push('/publicChat');
    } catch (error) {

    };
    loading.value = false;
}
</script>

<template>
    <TitleH1>Hola de nuevo Navi, ¿Querés conectarte y ver que hacen otros Navis?</TitleH1>
    <div class="glass rounded-3xl p-6 max-w-md mx-auto">
        <h2 class="text-2xl font-bold mb-4 text-shadow-aero">Iniciar sesion</h2>
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-1">
                <label for="email" class="text-sm font-semibold px-2">Email</label>
                <input type="email" id="email" v-model="user.email" autocomplete="email" required
                    placeholder="Ingresá tu email" class="rounded-full px-4 py-2 bg-white/25 border border-white/50
                            shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                            placeholder:text-aero-text/60
                            focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35">
            </div>
            <div class="flex flex-col gap-1">
                <label for="password" class="text-sm font-semibold px-2">Contraseña</label>
                <input type="password" id="password" v-model="user.password" autocomplete="new-password" required
                    placeholder="Ingresá una contraseña" class="rounded-full px-4 py-2 bg-white/25 border border-white/50
                            shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                            placeholder:text-aero-text/60
                            focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35">
            </div>
            <button type="submit" class="btn-aero text-aero-text rounded-full px-8 py-2 font-bold self-end
                        hover:brightness-110 active:brightness-95 active:translate-y-px transition">
                Ingresar
            </button>
        </form>
    </div>
</template>
