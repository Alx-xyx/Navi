<script setup>
import { computed, ref } from 'vue';
import CommentsSection from './CommentsSection.vue';
import { deletePost, updatePost } from '../../services/posts.js';

//!! ---------- PROPS Y EMITS ---------- !/
const props = defineProps({
    post: { type: Object, required: true },
    currentUserId: { type: String, default: null },
});
const emit = defineEmits(['updated', 'deleted']);

//** ---------- REFERENCIAS REACTIVAS ---------- */
const editing = ref(false);
const editBody = ref('');
const showComments = ref(false);
const saving = ref(false);
const error = ref(null);

//^^ ---------- COMPUTED ---------- ^^/
const isOwner = computed(() => props.post.user_id === props.currentUserId);
const authorName = computed(
    () => props.post.author?.display_name ?? props.post.author?.email ?? 'Usuario'
);
const authorInitial = computed(() => authorName.value.charAt(0).toUpperCase());
const wasEdited = computed(() => !!props.post.updated_at);

//~~ ---------- FUNCIONES ---------- ~/
function empezarEdicion() {
    editBody.value = props.post.body;
    error.value = null;
    editing.value = true;
}

function cancelarEdicion() {
    editing.value = false;
    error.value = null;
}

async function guardarEdicion() {
    const body = editBody.value.trim();
    if (!body || saving.value) return;

    try {
        saving.value = true;
        error.value = null;
        const post = await updatePost(props.post.id, { body });
        emit('updated', post);
        editing.value = false;
    } catch (e) {
        error.value = 'No se pudo guardar: ' + e.message;
    } finally {
        saving.value = false;
    }
}

async function borrar() {
    if (!window.confirm('¿Seguro que querés eliminar esta publicación?')) return;

    try {
        error.value = null;
        await deletePost(props.post);
        emit('deleted', props.post.id);
    } catch (e) {
        error.value = 'No se pudo eliminar: ' + e.message;
    }
}
</script>

<template>
    <article class="glass rounded-3xl p-5 flex flex-col gap-3">
        <header class="flex items-center gap-3">
            <RouterLink :to="`/usuario/${post.user_id}`" class="shrink-0">
                <img v-if="post.author?.file_name" :src="post.author.file_name" alt="Foto de perfil"
                    class="size-11 rounded-full object-cover ring-2 ring-white/70 bg-white/25">
                <div v-else
                    class="size-11 rounded-full btn-aero grid place-items-center font-bold ring-2 ring-white/70">
                    {{ authorInitial }}
                </div>
            </RouterLink>
            <div class="min-w-0 flex-1">
                <RouterLink :to="`/usuario/${post.user_id}`"
                    class="font-bold truncate block hover:underline text-shadow-aero">
                    {{ authorName }}
                </RouterLink>
                <p class="text-[11px] text-aero-text/70">
                    {{ new Date(post.created_at).toLocaleString('es-AR') }}
                    <span v-if="wasEdited"> · editada</span>
                </p>
            </div>
            <div v-if="isOwner && !editing" class="flex gap-2 shrink-0">
                <button type="button" @click="empezarEdicion" class="btn-aero rounded-full px-4 py-1 text-sm font-bold
                    hover:brightness-110 active:translate-y-px transition">
                    Editar
                </button>
                <button type="button" @click="borrar" class="btn-aero rounded-full px-4 py-1 text-sm font-bold
                    hover:brightness-110 active:translate-y-px transition">
                    Eliminar
                </button>
            </div>
        </header>
        <form v-if="editing" class="flex flex-col gap-2" action="#" @submit.prevent="guardarEdicion">
            <textarea v-model="editBody" rows="3" class="rounded-2xl px-4 py-3 bg-white/25 border border-white/50 resize-none
                shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35"></textarea>
            <div class="flex justify-end gap-2">
                <button type="button" @click="cancelarEdicion" class="btn-aero rounded-full px-5 py-1 text-sm font-bold
                    hover:brightness-110 active:translate-y-px transition">
                    Cancelar
                </button>
                <button type="submit" :disabled="saving || !editBody.trim()"
                    class="btn-aero rounded-full px-5 py-1 text-sm font-bold
                    hover:brightness-110 active:translate-y-px transition disabled:opacity-60 disabled:cursor-not-allowed">
                    {{ saving ? 'Guardando...' : 'Guardar' }}
                </button>
            </div>
        </form>
        <p v-else class="wrap-break-word whitespace-pre-line">{{ post.body }}</p>
        <img v-if="post.image_url" :src="post.image_url" alt="Imagen de la publicación" loading="lazy"
            class="w-full max-h-[28rem] rounded-2xl object-cover border border-white/40">
        <p v-if="error" class="text-sm font-semibold px-2" role="alert">{{ error }}</p>
        <button type="button" @click="showComments = !showComments" class="self-start text-sm font-bold px-2
            hover:underline">
            {{ showComments ? 'Ocultar comentarios' : 'Ver / escribir comentarios' }}
        </button>
        <CommentsSection v-if="showComments" :post-id="post.id" :current-user-id="currentUserId" />
    </article>
</template>