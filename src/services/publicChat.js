import { supabase } from "./supabase";

export async function mandarMensaje({body }) {
    const { data, error }=await supabase
        .from('public_chat_messages')
        .insert({
            body
        })
        .select();
    if (error) {
        console.error('Error al guardar mensaje en Supabase:', error);
        throw new Error(error.message);
    } else {
        console.log('Mensaje guardado en Supabase');
        return data;
    };
};

export async function traerMensajes() {
    const { data, error }=await supabase
        .from('public_chat_messages')
        .select('*')
        .order('createdAt', { ascending: true });

    if (error) {
        console.error('Error al cargar mensajes de Supabase:', error);
        return;
    };
    return data;
};

export async function suscribirseAMensajes(callback) {
    const chatChannel=supabase.channel('public_chat_messages');
    chatChannel.on('postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'public_chat_messages'
        },
        payload => {
            console.log('Nuevo mensaje recibido:', payload);
            callback(payload.new);
        }
    );
    chatChannel.subscribe();
};