import {createRouter, createWebHistory} from 'vue-router';
import MainHomePage from './pages/MainHomePage.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import PublicChat from './pages/PublicChat.vue';
import AboutNavi from './pages/AboutNavi.vue';
import Profile from './pages/Profile.vue';
import { subscribeToAuthState } from './services/auth.js';
import EditProfile from './pages/EditProfile.vue';
import UserProfile from './pages/UserProfile.vue';
import PrivateChat from './pages/PrivateChat.vue';
import EditProfileAvatar from './pages/EditProfileAvatar.vue';

const routes=[
    {
        path: '/',
        name: 'MainHomePage',
        component: MainHomePage
    },
    {   path: '/login',
        name: 'Login', 
        component: Login 
    },
    {   path: '/register',
        name: 'Register',
        component: Register 
    },
    {   path: '/publicChat',
        name: 'PublicChat',
        component: PublicChat,
        meta: {requiresAuth: true,},
    },
    {   path: '/aboutNavi',
        name: 'AboutNavi',
        component: AboutNavi
    },
    {   path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {requiresAuth: true,},
    },
    {
        path: '/editProfile',
        name: 'EditProfile',
        component: EditProfile,
        meta: {requiresAuth: true,},
    },
    {
        path: '/editProfile/avatar',
        name: 'EditProfileAvatar',
        component: EditProfileAvatar,
        meta: {requiresAuth: true,},
    },
    {
        path: '/usuario/:id',
        name: 'UserProfile',
        component: UserProfile,
        meta: {requiresAuth: true,},
    },
    {
        path: '/usuario/:id/chat',
        name: 'PrivateChat',
        component: PrivateChat,
        meta: {requiresAuth: true,},
    },
]

const router=createRouter({
    routes,
    history: createWebHistory()
})

let user={
    id: null,
    email: null,
}

subscribeToAuthState(userData => user=userData);

router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && user.id === null) {
        return '/login';
    }
})

export default router;