<script setup>
import { onMounted, onUnmounted ,ref } from 'vue';
import ListaDeMensajes from './ListaDeMensajes.vue';
import EnviarUnMensaje from './EnviarUnMensaje.vue';
import { mandarMensaje, suscribirseAMensajes, traerMensajes } from '../../services/publicChat.js';

//** ---------- REFERENCIAS REACTIVAS ---------- */
const messages = ref([]);

//~~ ---------- FUNCIONES ---------- ~/
async function guardarEnBbDd(newMessage) {
    try {
        await mandarMensaje({
            body: newMessage.body,
        })
    } catch (error) {
        console.error('Error al guardar el mensaje');
    }
};

//?? ---------- MOUNTED || UNMOUNTED ---------- ?/
let cancelarSuscripcion = () => {};

onMounted(async () => {
    try {
        messages.value = await traerMensajes();
        cancelarSuscripcion = await suscribirseAMensajes(
            newMessageData => messages.value.push(newMessageData)
        );
    } catch (error) {
        console.error('Error al traer mensajes de Supabase:', error);
    };
})

onUnmounted(() =>{
    cancelarSuscripcion?.();
})
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6 p-6">
        <section class="flex-1 min-w-0">
            <ListaDeMensajes :messages="messages" />
        </section>
        <section class="md:w-96 md:shrink-0 md:self-start md:sticky md:top-6">
            <EnviarUnMensaje @enviarMensaje="guardarEnBbDd" />
        </section>
    </div>
</template>
