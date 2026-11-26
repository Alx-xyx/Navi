import { getPublicUrl, uploadFile } from "./storage";
import { supabase } from "./supabase";
import { createUserProfile, getUserById, updateUserProfile } from "./userProfiles";

let userData={
    id: null,
    email: null,
    bio: null,
    display_name: null,
    file_name: null,
};

let observers=[];

supabase.auth.onAuthStateChange((event, session) => {
    console.log('auth:', event, session?.user?.id);

    if (session !== null) {
        userData={
            id: session.user.id,
            email: session.user.email,
        };
        getUserById(userData.id)
            .then(profile => {
                if (!profile) return;
                userData={
                    ...userData,
                    bio: profile.bio,
                    display_name: profile.display_name,
                    file_name: profile.file_name,
                };
                notifyAll();
            });
    } else {
        userData={
            id: null,
            email: null,
            bio: null,
            display_name: null,
            file_name: null,
        };
    }

    notifyAll();
});

export async function register({ email, password }) {
    const { data, error }=await supabase
        .auth
        .signUp({
            email,
            password
        });
    if (error) {
        console.error('Error al crear una cuenta:', error);
        throw new Error(error.message);
    }

    await createUserProfile({
        id: data.user.id,
        email,
    });

    console.log("Usuario creado!");

    return {
        id: data.user.id,
        email: data.user.email,
    };

};

export async function login({ email, password }) {
    const { data, error }=await supabase
        .auth
        .signInWithPassword({
            email,
            password
        });
    if (error) {
        console.error('Error al iniciar sesion:', error);
        throw new Error(error.message);
    };

    console.log("Navi inició sesion!");

    return {
        id: data.user.id,
        email: data.user.email,
    };
};

export async function logout() {
    const { error }=await supabase
        .auth
        .signOut();
    if (error) {
        console.error("Error al cerrar sesion:", error);
    };
};

export async function updateProfile(data) {
    try {
        await updateUserProfile(userData.id, data);
        userData={
            ...userData,
            ...data,
        };
        notifyAll();
    } catch (error) {
        console.error("Error al actualizar el perfil de usuario:", error);
        throw new Error(error.message);
    }
};

export async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        console.error('Error al cambiar la contraseña:', error);
        throw new Error(error.message);
    }
}

export async function updateAvatarUrl(file) {
    try {
        const path = `${userData.id}/${crypto.randomUUID()}`;
        await uploadFile(path, file, 'avatars');
        const file_name = getPublicUrl(path, 'avatars');
        await updateUserProfile(userData.id, { file_name });
        userData.file_name = file_name;
        notifyAll();
    } catch (error) {
        console.error("Error al actualizar la URL del avatar:", error);
        throw new Error(error.message);
    }
}

export function subscribeToAuthState(callback) {
    observers.push(callback);
    notify(callback);
    return () => {
        observers = observers.filter(observer => observer !== callback);
    };
};

function notify(callback) {
    callback({ ...userData });
};

function notifyAll() {
    observers.forEach(observer => notify(observer));
};