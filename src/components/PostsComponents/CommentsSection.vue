<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import {createComment,deleteComment,listComments,subscribeToComments,} from '../../services/comments.js';

//!! ---------- PROPS ---------- !/
const props = defineProps({
    postId: { type: String, required: true },
    currentUserId: { type: String, default: null },
});

//** ---------- REFERENCIAS REACTIVAS ---------- */
const comments = ref([]);
const newBody = ref('');
const loading = ref(false);
const sending = ref(false);
const error = ref(null);

//~~ ---------- FUNCIONES ---------- ~/
function agregarComentario(comment) {
    if (comments.value.some(c => c.id === comment.id)) return;
    comments.value.push(comment);
}

function quitarComentario(id) {
    comments.value = comments.value.filter(c => c.id !== id);
}

async function enviarComentario() {
    const body = newBody.value.trim();
    if (!body || sending.value) return;

    try {
        sending.value = true;
        error.value = null;
        const comment = await createComment({ postId: props.postId, body });
        agregarComentario(comment);
        newBody.value = '';
    } catch (e) {
        error.value = 'No se pudo comentar: ' + e.message;
    } finally {
        sending.value = false;
    }
}

async function borrarComentario(id) {
    try {
        error.value = null;
        await deleteComment(id);
        quitarComentario(id);
    } catch (e) {
        error.value = 'No se pudo borrar el comentario: ' + e.message;
    }
}

function autorDe(comment) {
    return comment.author?.display_name ?? comment.author?.email ?? 'Usuario';
}

//?? ---------- MOUNTED || UNMOUNTED ---------- ?/
let unsubscribe = () => {};

onMounted(async () => {
    unsubscribe = subscribeToComments(props.postId, {
        onInsert: agregarComentario,
        onDelete: quitarComentario,
    });

    try {
        loading.value = true;
        const existentes = await listComments(props.postId);
        // Mezclamos con lo que haya llegado por realtime durante la carga
        const llegados = comments.value;
        comments.value = existentes;
        llegados.forEach(agregarComentario);
    } catch (e) {
        error.value = 'No se pudieron cargar los comentarios.';
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => unsubscribe());
</script>

<template>
    <div class="flex flex-col gap-3 pt-3 border-t border-white/30">
        <p v-if="loading" class="text-sm italic text-aero-text/70 px-2">Cargando comentarios...</p>
        <p v-else-if="comments.length === 0" class="text-sm italic text-aero-text/70 px-2">
            Todavía no hay comentarios. ¡Sé el primero!
        </p>
        <ul class="flex flex-col gap-2">
            <li v-for="comment in comments" :key="comment.id"
                class="rounded-2xl px-4 py-2 bg-white/25 border border-white/40
                shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] flex flex-col gap-0.5">
                <div class="flex items-center justify-between gap-2">
                    <RouterLink :to="`/usuario/${comment.user_id}`" class="text-sm font-bold hover:underline truncate">
                        {{ autorDe(comment) }}
                    </RouterLink>
                    <div class="flex items-center gap-2 shrink-0">
                        <span class="text-[11px] text-aero-text/70">
                            {{ new Date(comment.created_at).toLocaleString('es-AR') }}
                        </span>
                        <button v-if="comment.user_id === currentUserId" type="button" title="Borrar comentario"
                            @click="borrarComentario(comment.id)"
                            class="text-xs font-bold hover:brightness-110 active:translate-y-px transition">
                            ✕
                        </button>
                    </div>
                </div>
                <p class="text-sm wrap-break-word whitespace-pre-line">{{ comment.body }}</p>
            </li>
        </ul>
        <p v-if="error" class="text-sm font-semibold px-2" role="alert">{{ error }}</p>
        <form class="flex items-end gap-2" action="#" @submit.prevent="enviarComentario">
            <textarea v-model="newBody" rows="1" placeholder="Escribí un comentario..." class="flex-1 resize-none max-h-32 field-sizing-content rounded-2xl px-4 py-2
                bg-white/25 border border-white/50
                shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                placeholder:text-aero-text/60
                focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35"
                @keydown.enter.exact.prevent="enviarComentario"></textarea>
            <button type="submit" :disabled="sending || !newBody.trim()" class="btn-aero rounded-full px-5 py-2 font-bold text-sm
                hover:brightness-110 active:translate-y-px transition
                disabled:opacity-60 disabled:cursor-not-allowed">
                Comentar
            </button>
        </form>
    </div>
</template>