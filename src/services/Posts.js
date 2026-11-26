
import { supabase } from "./supabase";
import { deleteFile, getPathFromPublicUrl, getPublicUrl, uploadFile } from "./storage";

const BUCKET = 'posts';

const POST_SELECT = '*, author:user_profiles(id, email, display_name, file_name)';

export async function getPostById(id) {
    const { data, error } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error al traer la publicación:', error);
        throw new Error(error.message);
    }
    return data;
}

export async function listPosts({ userId = null } = {}) {
    let query = supabase
        .from('posts')
        .select(POST_SELECT)
        .order('created_at', { ascending: false });

    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;

    if (error) {
        console.error('Error al listar publicaciones:', error);
        throw new Error(error.message);
    }
    return data;
}

export async function createPost({ userId, body, file = null }) {
    let image_url = null;
    let path = null;

    if (file) {
        path = `${userId}/${crypto.randomUUID()}`;
        await uploadFile(path, file, BUCKET);
        image_url = getPublicUrl(path, BUCKET);
    }

    const { data, error } = await supabase
        .from('posts')
        .insert({ body, image_url })
        .select(POST_SELECT)
        .single();

    if (error) {
        console.error('Error al crear la publicación:', error);
        // Si falló el insert, no dejamos la imagen huérfana en storage
        if (path) await deleteFile(path, BUCKET).catch(() => { });
        throw new Error(error.message);
    }
    return data;
}

export async function updatePost(id, { body }) {
    const { data, error } = await supabase
        .from('posts')
        .update({ body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(POST_SELECT)
        .single();

    if (error) {
        console.error('Error al editar la publicación:', error);
        throw new Error(error.message);
    }
    return data;
}

export async function deletePost(post) {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

    if (error) {
        console.error('Error al borrar la publicación:', error);
        throw new Error(error.message);
    }

    const path = getPathFromPublicUrl(post.image_url, BUCKET);
    if (path) await deleteFile(path, BUCKET).catch(() => { });
}

export function subscribeToPosts({ onInsert, onUpdate, onDelete }) {
    const channel = supabase
        .channel(`posts:${crypto.randomUUID()}`)
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'posts' },
            async payload => {
                try {
                    const post = await getPostById(payload.new.id);
                    if (post) onInsert?.(post);
                } catch (error) {
                    console.error('Error en realtime (INSERT de posts):', error);
                }
            })
        .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'posts' },
            async payload => {
                try {
                    const post = await getPostById(payload.new.id);
                    if (post) onUpdate?.(post);
                } catch (error) {
                    console.error('Error en realtime (UPDATE de posts):', error);
                }
            })
        .on('postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'posts' },
            payload => onDelete?.(payload.old.id))
        .subscribe(status => console.log('realtime posts:', status));

    return () => {
        supabase.removeChannel(channel);
    };
}