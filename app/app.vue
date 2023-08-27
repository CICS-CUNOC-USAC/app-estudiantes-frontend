<template>
  <NuxtLayout />
</template>
<script>
export default {
  setup () {
    useHead({
      title: 'CUNOC - Aplicación para estudiantes'
    })
  }
}
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-leave-to,
.page-enter-from {
  opacity: 0;
  transform: translateX(1rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}

.layout-leave-to,
.layout-enter-from {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
