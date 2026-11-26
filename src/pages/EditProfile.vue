<script>
import TitleH1 from '../components/TitleH1.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { updateProfile } from '../services/auth.js';
import ChangePasswordForm from '../components/ChangePasswordForm.vue';

    export default {
        name: 'EditProfile',
        components: {
            TitleH1,
            ChangePasswordForm
        },
        data(){
            return {
                user: {
                    bio: '',
                    display_name: '',
                    file_name: null,
                },
                loading: false,
                error: null,
                saved: false,
            }
        },
        methods:{
            async handleSubmit(){
                try {
                    this.loading = true;
                    this.error = null;
                    this.saved = false;
                    await updateProfile({
                        display_name: this.user.display_name,
                        bio: this.user.bio,
                    });
                    this.saved = true;
                } catch (error) {
                    this.error = 'No se pudo guardar: ' + error.message;
                } finally {
                    this.loading = false;
                }
            }
        },
        mounted() {
            subscribeToAuthState(userData => this.user={
                bio: userData.bio,
                display_name: userData.display_name,
                file_name: userData.file_name
            });
        }
    }
</script>

<template>
    <section class="max-w-xl w-full mx-auto px-4 py-10 flex flex-col gap-8">
        <header class="flex flex-col gap-2 text-center">
            <TitleH1 class="text-3xl font-bold text-aero-text text-shadow-aero">Editar perfil</TitleH1>
            <p class="text-aero-text/80 text-shadow-aero">
                Cambiá tu foto, tu nombre de usuario y tu biografía.
            </p>
        </header>
        <form action="#" @submit.prevent="handleSubmit" class="glass rounded-3xl p-6 flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-shadow-aero">Tu perfil</h2>
            <div class="flex items-center gap-4">
                <img v-if="user.file_name" :src="user.file_name" alt="Foto de perfil"
                    class="size-20 shrink-0 rounded-full object-cover ring-4 ring-white/70
                    shadow-[0_8px_24px_rgb(0_0_0/0.25)] bg-white/25">
                <div v-else class="size-20 shrink-0 rounded-full btn-aero grid place-items-center
                    text-3xl font-bold ring-4 ring-white/70 shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
                    {{ (user.display_name || '?').charAt(0).toUpperCase() }}
                </div>
                <div class="flex flex-col items-start gap-1">
                    <p class="text-sm font-semibold">Foto de perfil</p>
                    <router-link to="/editProfile/avatar" class="btn-aero text-aero-text rounded-full px-5 py-1 text-sm font-bold
                        hover:brightness-110 active:translate-y-px transition">
                        Cambiar foto
                    </router-link>
                </div>
            </div>
            <div class="flex flex-col gap-1">
                <label for="display_name" class="text-sm font-semibold px-2">Nombre de usuario</label>
                <input type="text" id="display_name" v-model="user.display_name" required
                    maxlength="30" pattern="[A-Za-z0-9_]+"
                    title="Solo letras, números y guion bajo (sin espacios)"
                    placeholder="Ingresá tu nombre de usuario" class="rounded-full px-4 py-2 bg-white/25 border border-white/50
                            shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                            placeholder:text-aero-text/60
                            focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35">
                <p class="text-xs text-aero-text/70 px-2">
                    Único, sin espacios ni caracteres especiales. Se permiten letras, números y _.
                </p>
            </div>
            <div class="flex flex-col gap-1">
                <label for="bio" class="text-sm font-semibold px-2">Biografía</label>
                <textarea id="bio" v-model="user.bio" rows="4" maxlength="280"
                    placeholder="Contanos un poco sobre vos..." class="rounded-2xl px-4 py-3 bg-white/25 border border-white/50 resize-none
                            shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                            placeholder:text-aero-text/60
                            focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35"></textarea>
                <p class="text-xs text-aero-text/70 px-2 text-right">
                    {{ (user.bio ?? '').length }}/280
                </p>
            </div>
            <p v-if="error" class="text-sm font-semibold px-2" role="alert">{{ error }}</p>
            <p v-if="saved" class="text-sm font-semibold px-2" role="status">¡Cambios guardados!</p>
            <button type="submit" :disabled="loading" class="btn-aero text-aero-text rounded-full px-8 py-2 font-bold self-end
                        hover:brightness-110 active:translate-y-px transition
                        disabled:opacity-60 disabled:cursor-not-allowed">
                {{ loading ? 'Guardando...' : 'Guardar cambios' }}
            </button>
        </form>
        <ChangePasswordForm />
    </section>
</template>