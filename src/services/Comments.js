import { supabase } from "./supabase";

const COMMENT_SELECT = '*, author:user_profiles(id, email, display_name, file_name)';

async function getCommentById(id) {
    const { data, error } = await supabase
        .from('comments')
        .select(COMMENT_SELECT)
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error al traer el comentario:', error);
        throw new Error(error.message);
    }
    return data;
}

export async function listComments(postId) {
    const { data, error } = await supabase
        .from('comments')
        .select(COMMENT_SELECT)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error al listar comentarios:', error);
        throw new Error(error.message);
    }
    return data;
}

export async function createComment({ postId, body }) {
    const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: postId, body })
        .select(COMMENT_SELECT)
        .single();

    if (error) {
        console.error('Error al crear el comentario:', error);
        throw new Error(error.message);
    }
    return data;
}

export async function deleteComment(id) {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error al borrar el comentario:', error);
        throw new Error(error.message);
    }
}

export function subscribeToComments(postId, { onInsert, onDelete }) {
    const channel = supabase
        .channel(`comments:${postId}:${crypto.randomUUID()}`)
        .on('postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'comments',
                filter: `post_id=eq.${postId}`,
            },
            async payload => {
                try {
                    const comment = await getCommentById(payload.new.id);
                    if (comment) onInsert?.(comment);
                } catch (error) {
                    console.error('Error en realtime (INSERT de comments):', error);
                }
            })
        .on('postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'comments' },
            payload => onDelete?.(payload.old.id))
        .subscribe(status => console.log(`realtime comments ${postId}:`, status));

    return () => {
        supabase.removeChannel(channel);
    };
}