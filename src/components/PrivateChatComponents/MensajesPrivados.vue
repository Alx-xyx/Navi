<script>
    export default {
        name: 'ListaDeMensajes',
        props: {
            messages: {
                type: Array,
                required: true
            }
        }
    };
</script>

<template>
    <div class="glass rounded-3xl p-6">
        <h2 class="text-2xl font-bold mb-4 [text-shadow:0_1px_3px_rgb(3_74_102/0.6)]">
            Lista de Mensajes
        </h2>

        <ol class="scroll-aero flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
            <li class="rounded-2xl px-4 py-3 bg-white/25 border border-white/40
                shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]" v-for="message in messages">
                <div class="flex justify-between items-baseline gap-4 mb-1">
                    <RouterLink :to="'/usuario/' + message.sender_id" class="text-aero-text hover:underline">
                        <span class="font-bold text-sm">{{message.email}} dijo:</span>
                    </RouterLink>
                    <span class="text-xs">{{ new Date(message.createdAt).toLocaleTimeString() }}</span>
                </div>
                <p class="text-sm wrap-break-word">{{ message.body }}</p>
            </li>
        </ol>
    </div>
    <div class="glass rounded-3xl p-6">
        <h2 class="text-2xl font-bold mb-4 [text-shadow:0_1px_3px_rgb(3_74_102/0.6)]">
            Enviar un mensaje
        </h2>

        <form class="flex flex-col gap-4" action="#" @submit.prevent="enviarMensaje">
            <div class="flex flex-col gap-1">
                <label for="mensaje" class="text-sm font-semibold px-2">Mensaje</label>
                <textarea v-model="newMessage.body" name="mensaje" id="mensaje" rows="4" placeholder="Escribe tu mensaje" class="rounded-2xl px-4 py-3 bg-white/25 border border-white/50 resize-none
                        shadow-[inset_0_2px_4px_rgb(3_74_102/0.25)]
                        placeholder:text-white/70
                        focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35"></textarea>
            </div>
            <button type="submit" class="btn-aero rounded-full px-8 py-2 font-bold self-end
                    hover:brightness-110 active:brightness-95 active:translate-y-px
                    transition">
                Enviar
            </button>
        </form>
    </div>
</template>