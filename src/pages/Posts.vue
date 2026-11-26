<script setup>
import TitleH1 from '../components/TitleH1.vue';
import PostsFeed from '../components/PostsComponents/PostsFeed.vue';
</script>

<template>
    <section class="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
        <TitleH1>Publicaciones</TitleH1>
        <PostsFeed show-form />
    </section>
</template>