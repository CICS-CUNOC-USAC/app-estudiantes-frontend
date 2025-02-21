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

        <div class="flex items-center justify-center">
            
            <div v-if="currentRoom" :key="currentRoom" 
            :class="isSmallScreen
                ? 'fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/75'
                : 'm-5 lg:mr-20 p-4 bg-neutral-200/60 rounded-sm dark:bg-neutral-900 w-3/4 h-full'
            ">
                <div 
                :class="
                    isSmallScreen
                    ? 'bg-white p-4 rounded-lg w-full max-w-md border-3 border-black dark:bg-neutral-900'
                    : 'rounded-sm dark:bg-neutral-900'
                ">
                    <CButton
                        v-if="isSmallScreen"
                        class="px-2 mb-5"
                        icon="icon-park-outline:close-one"
                        @click="closeModal"
                    />
                    <div class="flex justify-center items-center">
                        <img :src="selectedImage" alt="Salon" class="m-2 mx-4 w-auto md:h-80 lg:h-80 h-60">
                    </div>
                    
                    <hr class="my-4 border-t border-neutral-500 dark:border-neutral-700" />
                    <div>
                        <p class="text-l font-semibold m-2"> {{ currentRoom }} </p>
                        <p class="text-s font-light m-2">
                            <Icon name="icon-park-outline:layers" class="mb-1 mr-1.5 inline-block" />
                            Nivel {{ currentLevel }}
                        </p>
                        <p class="text-s font-light m-2" v-if="isImportant">
                            <Icon name="icon-park-outline:calendar" class="mb-1 mr-1.5 inline-block" />
                            Curso actual: CURSO / INGENIERO / HORA
                        </p>
                        <p class="text-s font-light m-2" v-if="currentInfo">
                            <Icon name="icon-park-outline:help" class="mb-1 mr-1.5 inline-block" />
                            {{ currentInfo }}
                        </p>
                    </div>
                </div>
            </div>

            <div class=" mt-30 md:my-5 lg:my-5 h-102 md:h-115 lg:h-115 flex items-center justify-center">
                <div class="flex flex-col m-2">
                    <CButton 
                    v-show="currentLevel < 3"  @click="currentLevel++;
                    currentRoom = null" icon="icon-park-outline:arrow-up" class="mb-5 lg:mb-2"
                    />
                    <CButton  
                    v-show="currentLevel > 1"  @click="currentLevel--;
                    currentRoom = null" icon="icon-park-outline:arrow-down" class="mb-5 lg:mb-2"
                    />
                </div>
                <div class="w-auto h-full  bg-cover bg-no-repeat bg-center" :style="[bgImg]">
                    <component class="svg w-auto h-full " :is="currentSvg" @click="handleClick" />
                </div>
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

import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();
const isSmallScreen = computed(() => width.value < 640);

const glob = import.meta.glob('~/assets/img/maps/salones/*.jpg', { eager: true })

const selectedImage = ref()
const images = Object.fromEntries(
    Object.entries(glob).map(([key, mod]: any) => {
        const filename = key.split('/').pop()?.replace('.jpg', '')
        return [filename, mod.default]
    })
)

const selectedPath = ref<SVGElement | null>();
const currentLevel = ref(1);
const currentRoom = ref();
const currentInfo = ref();
const isImportant = ref(false);

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

const handleClick = (event: MouseEvent) => {
    const target = event.target as SVGElement;

    if (target.tagName === "path") {
        selectedImage.value = images[target.id];

        if (selectedPath.value) {
            selectedPath.value.setAttribute("fill", "transparent");
        }

        target.setAttribute("fill", "var(--p-primary-400)");
        selectedPath.value = target;

        currentRoom.value = target.querySelector("title")?.textContent || null;
        currentInfo.value = target.querySelector("desc")?.textContent || null;
        isImportant.value = target.getAttribute('data-important') === '1';
    }
};

const closeModal = () => {
    if(selectedPath.value){
        selectedPath.value.setAttribute("fill", "transparent")
        selectedPath.value = null;
    }
    currentRoom.value = null;
}

</script>

<style>
.svg path {
    transition: fill 0.1s ease;
}

.svg path:hover {
    fill: var(--p-primary-300);
    cursor: pointer;
}
</style>