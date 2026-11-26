<script>
import TitleH1 from '../components/TitleH1.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { mandarMensajePrivado, buscarChatPrivado, traerMensajesPrivados, subscribeToNewPrivateChatMessages } from '../services/privateChat.js';
import { getUserById } from '../services/userProfiles.js';

let unsubscribeFromChat = () =>{};

export default {
    name: 'PrivateChat',
    components: { TitleH1 },
    data() {
        return {
            user: { 
                id: null, 
                email: null, 
                display_name: null 
            },
            otherUser: { 
                id: null, 
                email: null, 
                display_name: null 
            },
            loadingOtherUser: false,
            loadingMessages: false,
            messages: [],
            newMessage: { body: '' },
        };
    },
    methods: {
        async enviarMensaje(){
        const body = this.newMessage.body.trim();
        if (!body) return;
            try {
                await mandarMensajePrivado({
                    sender_id: this.user.id,
                    receiver_id: this.otherUser.id,
                    body: this.newMessage.body,
                    created_at: new Date().toISOString(),
                });
                this.newMessage.body = '';
            } catch (error) {
                throw new Error('Error al enviar mensaje privado: ' + error.message);
            }
        }
    },
    async mounted() {
        subscribeToAuthState(userData => (this.user = userData));

    try {
        this.loadingOtherUser = true;
        this.otherUser = await getUserById(this.$route.params.id);
    } catch (error) {
        console.error('Error al cargar el otro usuario:', error);
    }
    this.loadingOtherUser = false;

    try {
        this.loadingMessages = true;
        this.messages = await traerMensajesPrivados({
            sender_id: this.user.id,
            receiver_id: this.$route.params.id,
        });

        unsubscribeFromChat = await subscribeToNewPrivateChatMessages({
            sender_id: this.user.id,
            receiver_id: this.otherUser.id,
            callback: newMessage => this.messages.push(newMessage),
        });


    } catch (error) {
        console.error('Error al cargar los mensajes:', error);
    }
    this.loadingMessages = false;
    },
    unmounted() {
        unsubscribeFromChat();
    },
};
</script>

<template>
    <section class="max-w-3xl px-4 py-10 flex flex-col gap-6">
        <TitleH1>Conversación privada con {{ otherUser.display_name ?? otherUser.email }}</TitleH1>

        <div class="glass rounded-3xl flex flex-col overflow-hidden h-[70vh] w-full">

            <!-- Encabezado -->
            <header class="flex items-center gap-3 px-5 py-3 border-b border-white/30 bg-white/10">
                <div class="size-10 shrink-0 rounded-full btn-aero grid place-items-center font-bold uppercase">
                    {{ (otherUser.display_name ?? otherUser.email ?? '?').charAt(0) }}
                </div>
                <h2 class="font-bold text-lg truncate text-shadow-aero">
                    {{ otherUser.display_name ?? otherUser.email ?? 'Usuario' }}
                </h2>
            </header>
            <ol class="scroll-aero flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 p-5">
                <li v-if="messages.length === 0" class="m-auto text-sm italic text-aero-text/70">
                    Todavía no hay mensajes. ¡Saludá!
                </li>

                <li v-for="message in messages" :key="message.id" class="max-w-[80%] flex flex-col gap-0.5"
                    :class="message.sender_id === user.id ? 'self-end items-end' : 'self-start items-start'">
                    <div class="rounded-2xl px-4 py-2 border text-sm wrap-break-word
                    shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]" :class="message.sender_id === user.id
                    ? 'bg-aero-400/70 border-white/50 rounded-br-md'
                    : 'bg-white/25 border-white/40 rounded-bl-md'">
                        {{ message.body }}
                    </div>
                    <span class="text-[11px] text-aero-text/70 px-1">
                        {{ new Date(message.createdAt).toLocaleTimeString() }}
                    </span>
                </li>
            </ol>

            <form class="flex items-end gap-3 p-4 border-t border-white/30 bg-white/10" action="#"
                @submit.prevent="enviarMensaje">
                <textarea v-model="newMessage.body" rows="1" placeholder="Escribí un mensaje..." class="flex-1 resize-none max-h-32 field-sizing-content rounded-2xl px-4 py-2
                bg-white/25 border border-white/50
                shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]
                placeholder:text-aero-text/60
                focus:outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/35"></textarea>
                <button type="submit" class="btn-aero text-aero-text rounded-full px-6 py-2 font-bold
                    hover:brightness-110 active:brightness-95 active:translate-y-px transition">
                    Enviar
                </button>
            </form>
        </div>
    </section>
</template>