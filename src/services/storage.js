import { supabase } from "./supabase";

export async function uploadFile(filename, file, bucket = 'avatars') {
    const { error } = await supabase.storage
        .from(bucket)
        .upload(filename, file);
    if (error) {
        console.error('Error al subir archivo:', error);
        throw new Error(error.message);
    }
}


export function getPublicUrl(filename, bucket = 'avatars') {
    const {data} = supabase.storage
        .from(bucket)
        .getPublicUrl(filename);
    return data.publicUrl;
}

export async function deleteFile(filename, bucket = 'avatars') {
    const { error } = await supabase.storage
        .from(bucket)
        .remove([filename]);
    if (error) {
        console.error('Error al borrar archivo:', error);
        throw new Error(error.message);
    }
}

export function getPathFromPublicUrl(url, bucket = 'avatars') {
    if (!url) return null;
    const marker = `/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(url.slice(index + marker.length));
}