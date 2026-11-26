<script setup>
import { ref } from 'vue';
import { updatePassword } from '../services/auth.js';

const MIN_LENGTH = 6;

//** ---------- REFERENCIAS REACTIVAS ---------- */
const showPasswords = ref(false);
const form = ref({
    password: '',
    confirm: '',
});
const loading = ref(false);
const error = ref(null);
const success = ref(false);

//~~ ---------- FUNCIONES ---------- ~/
async function handleSubmit() {
    error.value = null;
    success.value = false;

    if (form.value.password.length < MIN_LENGTH) {
        error.value = `La contraseña debe tener al menos ${MIN_LENGTH} caracteres.`;
        return;
    }
    if (form.value.password !== form.value.confirm) {
        error.value = 'Las contraseñas no coinciden.';
        return;
    }

    try {
        loading.value = true;
        await updatePassword(form.value.password);
        form.value = { password: '', confirm: '' };
        success.value = true;
    } catch (e) {
        error.value = 'No se pudo cambiar la contraseña: ' + e.message;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <form action="#" @submit.prevent="handleSubmit" class="glass rounded-3xl p-6 flex flex-col gap-6">
        <div class="flex flex-col gap-1">
            <h2 class="text-2xl font-bold text-shadow-aero">Seguridad</h2>
            <p class="text-sm text-aero-text/70">
                Cambiá tu contraseña. Usá al menos 6 caracteres.
            </p>
        </div>

        <div class="flex flex-col gap-1">
            <label for="new-password" class="text-sm font-semibold px-2">Nueva contraseña</label>
            <input :type="showPasswords ? 'text' : 'password'" id="new-password" v-model="form.password" required
                minlength="6" autocomplete="new-password"
                placeholder="Mínimo 6 caracteres" class="rounded-full px-4 py-2 bg-white/25 border border-white/50
                    shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                    placeholder:text-aero-text/60
                    focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35">
        </div>

        <div class="flex flex-col gap-1">
            <label for="confirm-password" class="text-sm font-semibold px-2">Repetir contraseña</label>
            <input :type="showPasswords ? 'text' : 'password'" id="confirm-password" v-model="form.confirm" required
                autocomplete="new-password"
                placeholder="Repetí la contraseña" class="rounded-full px-4 py-2 bg-white/25 border border-white/50
                    shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                    placeholder:text-aero-text/60
                    focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35">
        </div>

        <label class="flex items-center gap-2 text-sm px-2 cursor-pointer select-none">
            <input type="checkbox" v-model="showPasswords" class="size-4 accent-aero-400">
            Mostrar contraseñas
        </label>

        <p v-if="error" class="text-sm font-semibold px-2" role="alert">{{ error }}</p>
        <p v-if="success" class="text-sm font-semibold px-2" role="status">
            ¡Contraseña actualizada!
        </p>

        <button type="submit" :disabled="loading" class="btn-aero text-aero-text rounded-full px-8 py-2 font-bold self-end
            hover:brightness-110 active:translate-y-px transition disabled:opacity-60 disabled:cursor-not-allowed">
            {{ loading ? 'Guardando...' : 'Cambiar contraseña' }}
        </button>
    </form>
</template>