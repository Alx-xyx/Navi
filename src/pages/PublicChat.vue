<script>
import TitleH1 from '../components/TitleH1.vue';
import RenderChats from '../components/PublicChatComponents/RenderChats.vue';
export default {
    name: 'PublicChat',
    components: {
        TitleH1,
        RenderChats
    }
};
</script>

<template>
    <TitleH1>Esto fue lo que otros Navis han compartido</TitleH1>
    <div>
        <RenderChats/>
    </div>
</template>
