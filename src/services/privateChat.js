import { supabase } from "./supabase";

let privateChatsCache = {

};

function sortUserIdsForPrivateChat({ sender_id, receiver_id }) {
    return [sender_id, receiver_id].sort();
}

async function buscarChat(user1, user2){
    const { data, error } = await supabase
        .from('private_chats')
        .select()
        .eq('user_id1', user1)
        .eq('user_id2', user2);

    if (error) {
        console.error('Error al buscar chat privado:', error);
        throw new Error(error.message);
    }
    return data?.[0];
}

export async function buscarChatPrivado({sender_id, receiver_id}) {
    const cacheKey = sortUserIdsForPrivateChat({sender_id, receiver_id}).join('_');
    if (privateChatsCache[cacheKey]) {
        console.log('Chat encontrado en cache');
        console.groupEnd();
        return privateChatsCache[cacheKey];
    }
    let chat = await buscarChat(sender_id, receiver_id);
    if (!chat) {
        chat = await buscarChat(receiver_id, sender_id);
    } else {
        console.log('Chat encontrado');
    }
    privateChatsCache[cacheKey] = chat;
    return chat;
}

async function crearChatPrivado({ sender_id, receiver_id }) {
    const { data, error } = await supabase
        .from('private_chats')
        .insert({
            user_id1: sender_id,
            user_id2: receiver_id,
        })
        .select();

    if (error) {
        console.error('Error al crear chat privado:', error);
        throw new Error(error.message);
    }
    return data?.[0];
}


export async function mandarMensajePrivado({ sender_id, receiver_id, body }) {
    let chat = await buscarChatPrivado({sender_id, receiver_id});
    if (!chat) {
        chat = crearChatPrivado({ sender_id, receiver_id });
    }
    const { error: errorMessage } = await supabase
        .from('private_chats_messages')
        .insert({
            chat_id: chat.id,
            sender_id: sender_id,
            body
        });

    if (errorMessage) {
        console.error('Error al enviar mensaje del chat privado:', errorMessage);
        throw new Error(errorMessage.message);
    }
}

export async function traerMensajesPrivados({sender_id, receiver_id}) {
    const chat = await buscarChatPrivado({sender_id, receiver_id});
    if (!chat) {
        return [];
    }

    const { data, error } = await supabase
        .from('private_chats_messages')
        .select()
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error al cargar mensajes del chat privado:', error);
        throw new Error(error.message);
    }

    return data;
}

export async function subscribeToNewPrivateChatMessages({ sender_id, receiver_id, callback }) {
    const chat = await buscarChatPrivado({sender_id, receiver_id});
    if (!chat) {
        console.warn('No se encontró un chat privado para suscribirse a los mensajes.');
        return;
    }

    const channel = supabase.realtime.channel(`private_chat:${chat.id}:messages`);
    channel.on(
        'postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'private_chats_messages',
            filter: `chat_id=eq.${chat.id}`,
        }, payload => {
            callback(payload.new);
        });

        channel.subscribe();

        return () => {
            channel.unsubscribe();
        }
}