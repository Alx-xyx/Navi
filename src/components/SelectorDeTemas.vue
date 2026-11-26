<script>
import { TEMAS, cargarTema, aplicarTema } from '../services/theme.js';

export default {
    name: 'SelectorDeTemas',
    data() {
        return {
            temas: TEMAS,
            temaSeleccionado: cargarTema(),
        };
    },
    methods: {
        cambiarTema(id) {
            this.temaSeleccionado=id;
            aplicarTema(id);
        }
    }
};
</script>

<template>
    <div class="glass rounded-3xl p-6 mr-4">
        <h2 class="text-2xl font-bold mb-4">Elegí tu tema</h2>

        <div class="flex flex-wrap gap-3">
            <button v-for="tema in temas" :key="tema.id" type="button" :data-theme="tema.id"
                @click="cambiarTema(tema.id)" class="btn-aero text-aero-text rounded-full px-5 py-2 font-bold transition
                        hover:brightness-110 active:translate-y-px"
                :class="temaSeleccionado === tema.id ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''">
                {{ tema.name }}
            </button>
        </div>
    </div>
</template>