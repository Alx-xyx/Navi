<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import PostForm from './PostForm.vue';
import PostCard from './PostCard.vue';
import { listPosts, subscribeToPosts } from '../../services/posts.js';
import { subscribeToAuthState } from '../../services/auth.js';

//!! ---------- PROPS Y EMITS ---------- !/
const props = defineProps({
    userId: { type: String, default: null },
    showForm: { type: Boolean, default: false },
});

//** ---------- REFERENCIAS REACTIVAS ---------- */
const posts = ref([]);
const currentUser = ref({ id: null });
const loading = ref(false);
const error = ref(null);

//~~ ---------- FUNCIONES ---------- ~/
function perteneceAlListado(post) {
    return !props.userId || post.user_id === props.userId;
}

function agregarPost(post) {
    if (!perteneceAlListado(post)) return;
    if (posts.value.some(p => p.id === post.id)) return;
    posts.value.unshift(post);
}

function reemplazarPost(post) {
    const index = posts.value.findIndex(p => p.id === post.id);
    if (index !== -1) posts.value[index] = post;
}

function quitarPost(id) {
    posts.value = posts.value.filter(p => p.id !== id);
}

async function cargarPosts() {
    try {
        loading.value = true;
        error.value = null;
        posts.value = await listPosts({ userId: props.userId });
    } catch (e) {
        error.value = 'No se pudieron cargar las publicaciones.';
    } finally {
        loading.value = false;
    }
}

//?? ---------- MOUNTED || UNMOUNTED ---------- ?/
let unsubscribeAuth = () => {};
let unsubscribePosts = () => {};

onMounted(() => {
    unsubscribeAuth = subscribeToAuthState(userData => (currentUser.value = userData));
    unsubscribePosts = subscribeToPosts({
        onInsert: agregarPost,
        onUpdate: reemplazarPost,
        onDelete: quitarPost,
    });
});

watch(() => props.userId, cargarPosts, { immediate: true });

onUnmounted(() => {
    unsubscribeAuth();
    unsubscribePosts();
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <PostForm v-if="showForm && currentUser.id" :user-id="currentUser.id" @created="agregarPost" />

        <p v-if="loading" class="text-sm italic text-aero-text/70 text-center">Cargando publicaciones...</p>
        <p v-else-if="error" class="text-sm font-semibold text-center" role="alert">{{ error }}</p>
        <p v-else-if="posts.length === 0" class="text-sm italic text-aero-text/70 text-center">
            Todavía no hay publicaciones.
        </p>

        <PostCard v-for="post in posts" :key="post.id" :post="post" :current-user-id="currentUser.id"
            @updated="reemplazarPost" @deleted="quitarPost" />
    </div>
</template>