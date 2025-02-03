<template>
  <div
    class="bg-cics-white dark:bg-cics-blue  px-12 pt-18 pb-8 lg:pt-24 lg:pb-14  lg:pr-12 lg:pl-28 gap-6 lg:gap-0"
  >
  <div class="max-w-screen-2xl mx-auto flex flex-col lg:items-center lg:justify-between justify-center items-center lg:flex-row">
    <header class="lg:w-6/12 space-y-4 lg:space-y-8 text-center lg:text-left">
      <h2 class="text-muted-color-emphasis uppercase font-light tracking-widest">Ingeniería CUNOC</h2>
      <h1 class="text-4xl lg:text-5xl  font-semibold tracking-wide">
        PORTAL <br />
        ESTUDIANTIL
      </h1>
      <p class="text-color leading-relaxed text-balance ">
        El nuevo portal, creado por el <span class="italic">CICS</span>, para los estudiantes de Ingenieria del Centro
        Universitario De Occidente ha sido creado con el fin de apoyar a los
        estudiantes a encontrar informacion que les puede ser util a lo largo de
        su carrera.
      </p>
    </header>
    <picture class="lg:w-4/12 w-3/4 select-none pointer-events-none">
      <img
      src="~/assets/img/landing-logo-sparks.svg"
      alt="Logo de Ingeniería CUNOC"
      class="dark:hidden"
      />
      <img
      src="~/assets/img/landing-logo-sparks-dark.svg"
      alt="Logo de Ingeniería CUNOC"
      class="hidden dark:block"
      />
    </picture>
  </div>
  </div>
</template>
<script setup lang="ts">
import landingLogoSparks from '~/assets/img/landing-logo-sparks.svg'
</script>
<style scoped></style>
