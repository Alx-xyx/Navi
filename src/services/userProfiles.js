import { supabase } from "./supabase";

export async function getUserById(id) {
    const { error, data }=await supabase
        .from('user_profiles')
        .select()
        .eq('id', id);

    if (error) {
        console.error('Error al traer el perfil de usuario: ', error);
    };

    return data?.[0];
};

export async function createUserProfile(data) {
    const { error }=await supabase
        .from('user_profiles')
        .insert(data);

    if (error) {
        console.error('Error al crear un usuario: ', error);
        throw new Error(error.message);
    };
};

export async function updateUserProfile(id, data) {
    const { error }=await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id)
        .select();
    console.log('Update del usuario realizado', data, error);
    if (error) {
        console.error('Error al actualizar el perfil de usuario: ', error);
        throw new Error(error.message);
    }
}