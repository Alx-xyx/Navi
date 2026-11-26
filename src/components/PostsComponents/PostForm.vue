<script setup>
import { onUnmounted, ref } from 'vue';
import { createPost } from '../../services/posts.js';

//!! ---------- PROPS Y EMITS ---------- !/
const props = defineProps({
    userId: { type: String, required: true },
});
const emit = defineEmits(['created']);

//** ---------- REFERENCIAS REACTIVAS ---------- */
const body = ref('');
const file = ref(null);
const preview = ref(null);
const fileInput = ref(null);
const loading = ref(false);
const error = ref(null);

//~~ ---------- FUNCIONES ---------- ~/
function limpiarImagen() {
    if (preview.value) URL.revokeObjectURL(preview.value);
    file.value = null;
    preview.value = null;
    if (fileInput.value) fileInput.value.value = '';
}

function handleFileChange(event) {
    const selected = event.target.files[0];
    if (!selected) return limpiarImagen();

    if (!selected.type.startsWith('image/')) {
        error.value = 'El archivo tiene que ser una imagen.';
        return limpiarImagen();
    }

    error.value = null;
    if (preview.value) URL.revokeObjectURL(preview.value);
    file.value = selected;
    preview.value = URL.createObjectURL(selected);
}

async function handleSubmit() {
    const text = body.value.trim();
    if (!text || loading.value) return;

    try {
        loading.value = true;
        error.value = null;
        const post = await createPost({ userId: props.userId, body: text, file: file.value });
        emit('created', post);
        body.value = '';
        limpiarImagen();
    } catch (e) {
        error.value = 'No se pudo publicar: ' + e.message;
    } finally {
        loading.value = false;
    }
}

onUnmounted(() => {
    if (preview.value) URL.revokeObjectURL(preview.value);
});
</script>

<template>
    <form class="glass rounded-3xl p-6 flex flex-col gap-4" action="#" @submit.prevent="handleSubmit">
        <h2 class="text-2xl font-bold text-shadow-aero">Nueva publicación</h2>
        <div class="flex flex-col gap-1">
            <label for="post-body" class="text-sm font-semibold px-2">¿Qué estás pensando?</label>
            <textarea id="post-body" v-model="body" rows="3" placeholder="Escribí tu publicación..." class="rounded-2xl px-4 py-3 bg-white/25 border border-white/50 resize-none
                shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                placeholder:text-aero-text/60
                focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35"></textarea>
        </div>
        <div v-if="preview" class="relative self-start">
            <img :src="preview" alt="Vista previa" class="max-h-64 rounded-2xl border border-white/50 object-cover">
            <button type="button" @click="limpiarImagen" title="Quitar imagen" class="absolute top-2 right-2 size-8 rounded-full btn-aero grid place-items-center
                hover:brightness-110 active:translate-y-px transition">
                ✕
            </button>
        </div>
        <p v-if="error" class="text-sm font-semibold px-2" role="alert">{{ error }}</p>
        <div class="flex flex-wrap items-center justify-between gap-3">
            <label class="btn-aero rounded-full px-5 py-2 font-bold cursor-pointer text-sm
                hover:brightness-110 active:translate-y-px transition">
                Agregar imagen
                <input ref="fileInput" type="file" accept="image/*" class="sr-only" @change="handleFileChange">
            </label>
            <button type="submit" :disabled="loading || !body.trim()" class="btn-aero rounded-full px-8 py-2 font-bold
                hover:brightness-110 active:brightness-95 active:translate-y-px transition
                disabled:opacity-60 disabled:cursor-not-allowed">
                {{ loading ? 'Publicando...' : 'Publicar' }}
            </button>
        </div>
    </form>
</template>