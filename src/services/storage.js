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