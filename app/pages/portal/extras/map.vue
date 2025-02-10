<template>
    <main>
        <nav class="space-x-4">
            <CButton icon="icon-park-outline:arrow-left" variant="link" label="Regresar al inicio"
                class="mb-5 text-muted-color-emphasis lg:mb-2" to="/" />
        </nav>
        <h1 class="text-xl font-semibold">
            <Icon name="icon-park-twotone:map-draw" class="mb-1 mr-1.5 inline-block" />
            Mapa del Módulo G
        </h1>

        <div class="my-6 space-y-6 h-125 flex items-center justify-center">
            <div class="flex flex-col m-2">
                <CButton 
                    @click="currentLevel++"
                    icon="icon-park-outline:arrow-up"
                    class="mb-5 lg:mb-2" 
                    :disabled="currentLevel == 3"
                />
                <CButton 
                    @click="currentLevel--"
                    icon="icon-park-outline:arrow-down"
                    class="mb-5 lg:mb-2" 
                    :disabled="currentLevel == 1"
                />
            </div>
            <div class="svg-container" 
            :style="[bgImg, $colorMode.preference === 'dark' ? { filter: 'invert(100%)' } : {}]">
                <component
                    class="svg" 
                    v-bind:style="[$colorMode.preference === 'dark' ? {'filter': 'invert(100%)'} : {}]"
                    :is="currentSvg" 
                    />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'

import modulo_g1 from '~/assets/img/maps/mg1.svg'
import modulo_g2 from '~/assets/img/maps/mg2.svg'
import modulo_g3 from '~/assets/img/maps/mg3.svg'

import bg_modulo_g1 from '~/assets/img/maps/mg1.png';
import bg_modulo_g2 from '~/assets/img/maps/mg2.png';
import bg_modulo_g3 from '~/assets/img/maps/mg3.png';


const currentLevel = ref(1);
 const bgUrl = computed(() => {
  if (currentLevel.value === 1) return `url(${bg_modulo_g1})`;
  if (currentLevel.value === 2) return `url(${bg_modulo_g2})`;
  return `url(${bg_modulo_g3})`;
});

const currentSvg = computed(() => {
  if (currentLevel.value === 1) return modulo_g1;
  if (currentLevel.value === 2) return modulo_g2;
  return modulo_g3;
});

const bgImg = computed(() => ({
  backgroundImage: bgUrl.value
}));

</script>

<style>
.svg-container {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: auto;
    height: 100%;
}

.svg {
    width: inherit;
    height: 100%;
}

.svg path {
    transition: fill 0.1s ease;
}

.svg path:hover {
    fill: var(--p-primary-500);
    cursor: pointer;
}
</style>
<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>