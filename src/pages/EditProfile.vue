<script>
import TitleH1 from '../components/TitleH1.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { updateProfile } from '../services/auth.js';

    export default {
        name: 'EditProfile',
        components: {
            TitleH1
        },
        data(){
            return {
                user: {
                    bio: '',
                    display_name: ''
                },
                loading: false,
            }
        },
        methods:{
            async handleSubmit(){
                try {
                    this.loading=true;
                    await updateProfile(this.user);
                    this.loading=false;
                } catch (error) {
                    console.error('Error al actualizar el perfil: ', error);
                }
            }
        },
        mounted() {
            subscribeToAuthState(userData => this.user={
                bio: userData.bio,
                display_name: userData.display_name
            });
        }
    }
</script>

<template>
    <section class="max-w-2xl px-4 py-10 flex flex-col gap-6">
        <TitleH1 class="text-3xl font-bold text-aero-text text-shadow-aero">Editar perfil</TitleH1>

        <div class="flex flex-col gap-2 text-lg text-shadow-aero">
            <p>En esta sección podés cambiar tu nombre de usuario y tu foto de perfil.</p>
            <p>Recordá que el nombre de usuario debe ser único y no puede contener espacios ni caracteres especiales.</p>
        </div>

        <form action="#" @submit.prevent="handleSubmit" class="glass rounded-3xl p-6 max-w-xl mx-auto flex flex-col gap-6">
            <div class="flex flex-col gap-1">
                <label for="display_name" class="text-sm font-semibold px-2">Nombre de usuario</label>
                <input type="text" id="display_name" v-model="user.display_name" required
                    placeholder="Ingresá tu nombre de usuario" class="rounded-full px-4 py-2 bg-white/25 border border-white/50
                            shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                            placeholder:text-aero-text/60
                            focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35">
            </div>
            <div class="flex flex-col gap-1">
                <label for="bio" class="text-sm font-semibold px-2">Biografía</label>
                <textarea id="bio" v-model="user.bio" rows="4"
                    placeholder="Contanos un poco sobre vos..." class="rounded-xl px-4 py-2 bg-white/25 border border-white/50
                            shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                            placeholder:text-aero-text/60
                            focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35"></textarea>
            </div>
            <button type="submit" class="btn-aero text-aero-text rounded-full px-8 py-2 font-bold self-end
                        hover:brightness-110 active:translate-y-px transition">
                Guardar cambios
            </button>
        </form>
    </section>
</template>