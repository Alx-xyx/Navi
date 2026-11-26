<script>
import TitleH1 from '../components/TitleH1.vue';
import { updateAvatarUrl } from '../services/auth.js';
export default {
    name: 'EditProfileAvatar',
    components: { TitleH1 },
    data() {
        return {
            photo: {
                file: null,
                preview: null,
            },
            loading: false,
        };
    },
    methods: {
        handlePhotoChange(event) {
            if (this.photo.preview) {
                URL.revokeObjectURL(this.photo.preview);
            }
            this.photo.file = event.target.files[0];
            this.photo.preview = URL.createObjectURL(this.photo.file);
        },
        async handleSubmit() {
            try {
                this.loading = true;
                await updateAvatarUrl(this.photo.file);
            } catch (error) {
                throw new Error('Error al actualizar el avatar: ' + error.message);
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
    },
    unmounted() {
        if (this.photo.preview) {
            URL.revokeObjectURL(this.photo.preview);
        }
    },
};
</script>

<template>
    <div class="edit-profile-avatar">
        <TitleH1>Editar avatar</TitleH1>
        <form action="#" @submit.prevent="handleSubmit"
            class="glass rounded-3xl p-6 max-w-xl mx-auto flex flex-col gap-6">
            <div class="flex flex-col gap-1">
                <label for="file" class="text-sm font-semibold px-2">Foto de perfil</label>
                <input type="file" id="file" accept="image/*" @change="handlePhotoChange" class="rounded-full px-4 py-2 bg-white/25 border border-white/50
                            shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                            placeholder:text-aero-text/60
                            focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35">
            </div>
            <div v-if="photo.preview" class="flex justify-center">
                <img :src="photo.preview" alt="Avatar Preview" class="w-32 h-32 rounded-full object-cover">
            </div>
            <button type="submit" class="btn-aero text-aero-text rounded-full px-8 py-2 font-bold self-end
                hover:brightness-110 active:translate-y-px transition">
                Guardar cambios
            </button>

        </form>
    </div>
</template>