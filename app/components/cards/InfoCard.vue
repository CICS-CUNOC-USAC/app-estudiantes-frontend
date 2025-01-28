<template>
    <CCardAlt
    class="hover:bg-primary-100/75 dark:hover:bg-primary-900/30 group"
    interactive-inverse
      no-spacing
      :to="route"
    >
      <template #content>
        <img :src="img" class="h-28 w-full select-none object-cover" />
        <div class="p-5">
          <p
            class="text-xs italic tracking-wide text-muted-color-emphasis"
          >
            {{ subtitle }}
          </p>
          <h3 class="text-lg font-semibold py-2">{{ title }}</h3>
          <p class="text-sm">{{ description }}</p>
        </div>
      </template>
    </CCardAlt>
</template>
<script lang="ts" setup>
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
defineProps({
  fullHeight: {
    type: Boolean,
    required: false,
    default: false
  },
  img: {
    type: String,
    required: false,
    default: ''
  },
  subtitle: {
    type: String,
    required: false,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  route: {
    type: String,
    required: true
  }
})
</script>
<style lang="scss" scoped>
.card-title {
  font-weight: 600;
  font-size: 1.5rem;
  white-space: pre-wrap;
  line-height: 1;
}
.card-subtitle {
  font-weight: 400;
  font-style: italic;
  font-size: 0.9rem;
}
.card-description {
  font-weight: normal;
  font-size: 1rem;
}
</style>
