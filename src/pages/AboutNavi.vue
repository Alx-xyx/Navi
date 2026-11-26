<script>
import TitleH1 from '../components/TitleH1.vue';
export default {
    name: 'AboutNavi',
    components: {
        TitleH1
    }
};
</script>

<template>
    <section class="max-w-2xl px-4 py-10 flex flex-col gap-6">
        <TitleH1>
            Bienvenido Navi,<br>
            a la red social que te prometieron
        </TitleH1>

        <div class="flex flex-col gap-2 text-lg text-shadow-aero">
            <p>Sin ruido, sin presión, sin scroll infinito que te deja peor de lo que empezaste.</p>
            <p>Un lugar para charlar con gente de verdad, a tu ritmo, cuidando lo que compartís.</p>
        </div>

        <div class="flex flex-wrap gap-3">
            <RouterLink to="/register" class="btn-aero text-aero-text rounded-full px-8 py-2 font-bold
            hover:brightness-110 active:translate-y-px transition">
                Registrate y empezá a chatear
            </RouterLink>
        </div>
    </section>
</template>
