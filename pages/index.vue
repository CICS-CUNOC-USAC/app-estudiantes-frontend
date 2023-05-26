<script lang="ts">
export default {
  emits: ['currentPage'],
  created () {
    this.$emit('currentPage', 'inicio')
  }
}
</script>

<template>
  <div>
    <h1>Inicio</h1>
  </div>
</template>

<style scoped lang="scss">

</style>
