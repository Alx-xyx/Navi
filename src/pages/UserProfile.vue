<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import TitleH1 from '../components/TitleH1.vue';
import { getUserById } from '../services/userProfiles.js';
import PostsFeed from '../components/PostsComponents/PostsFeed.vue';

//&& ---------- ROUTER ---------- &/
const route = useRoute();

//** ---------- REFERENCIAS REACTIVAS ---------- */
const user = ref({
    id: null,
    email: null,
    bio: null,
    display_name: null,
    file_name: null,
})

const loading = ref(false);

//^^ ---------- COMPUTED ---------- ^^/
const name = computed(() => {
    return user.value.display_name ?? user.value.email ?? 'Usuario';
});

const initial = computed(() => {
    return name.value.charAt(0).toUpperCase();
});

//?? ---------- MOUNTED || UNMOUNTED ---------- ?/
onMounted(async () => {
    try {
        loading.value = true;
        user.value = await getUserById(route.params.id);
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
    } finally {
        loading.value = false;
    }
})
</script>

<template>
    <TitleH1>Perfil de {{ name }}</TitleH1>
    <div class="glass rounded-3xl max-w-xl mx-auto overflow-hidden">
        <div class="h-32 bg-linear-to-br from-aero-400/80 via-white/30 to-aero-400/40"></div>
        <div class="px-6 pb-6 flex flex-col gap-6">
            <div class="-mt-16 flex flex-col items-center gap-3">
                <div class="relative">
                    <img v-if="user.file_name" :src="user.file_name" alt="Foto de perfil" class="size-32 rounded-full object-cover ring-4 ring-white/70
                        shadow-[0_8px_24px_rgb(0_0_0/0.25)] bg-white/25">
                    <div v-else class="size-32 rounded-full btn-aero grid place-items-center
                        text-5xl font-bold ring-4 ring-white/70 shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
                        {{ initial }}
                    </div>

                    <router-link to="/editProfile/avatar" title="Editar foto de perfil" class="absolute bottom-0 right-0 size-9 rounded-full btn-aero grid place-items-center
                        text-lg ring-2 ring-white/70 hover:brightness-110 active:translate-y-px transition">
                        ✎
                    </router-link>
                </div>

                <div class="text-center">
                    <h2 class="text-2xl font-bold text-shadow-aero">{{ name }}</h2>
                    <p class="text-sm text-aero-text/70 wrap-break-word">{{ user.email }}</p>
                </div>
            </div>

            <section>
                <h3 class="text-sm font-semibold px-2 mb-2 text-shadow-aero">Biografía</h3>
                <div class="rounded-2xl px-4 py-3 bg-white/25 border border-white/40
                    shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] wrap-break-word"
                    :class="user.bio ? '' : 'italic text-aero-text/70'">
                    {{ user.bio ?? 'Sin biografía aún' }}
                </div>
            </section>

            <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-baseline">
                <dt class="text-sm font-semibold px-2">Email</dt>
                <dd class="rounded-full px-4 py-1 bg-white/25 border border-white/40 wrap-break-word">
                    {{ user.email }}
                </dd>

                <dt class="text-sm font-semibold px-2">Nombre de usuario</dt>
                <dd class="rounded-full px-4 py-1 bg-white/25 border border-white/40 wrap-break-word"
                    :class="user.display_name ? '' : 'italic text-aero-text/70'">
                    {{ user.display_name ?? 'Sin nombre de usuario aún' }}
                </dd>
            </dl>
            <RouterLink :to="`/usuario/${user.id}/chat`" class="btn-aero text-aero-text rounded-full px-8 py-2 font-bold self-end
                hover:brightness-110 active:translate-y-px transition">
                Chatear con {{user.display_name ?? user.email}}
            </RouterLink> 
        </div>
        <section class="flex flex-col gap-3">
            <h3 class="text-sm font-semibold px-2 text-shadow-aero">Publicaciones</h3>
            <PostsFeed :user-id="route.params.id" />
        </section>
    </div>
</template>