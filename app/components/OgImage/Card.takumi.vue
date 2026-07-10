<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    badge?: 'Comunicado' | 'Publicación Oficial' | 'Portal'
    imageUrl?: string
  }>(),
  {
    title: 'CICS App',
    subtitle: 'Portal para estudiantes de Ingeniería, CUNOC',
    badge: 'Portal',
    imageUrl: undefined
  }
)

const COLORS = {
  bg: '#F9F5F3',
  primary: '#ff6600',
  dark: '#272933',
  muted: '#6b6e7a',
  white: '#ffffff',
  border: '#e8e3df'
}

const hasImage = computed(() => Boolean(props.imageUrl))

const truncatedTitle = computed(() => {
  const max = 80
  return props.title.length > max ? `${props.title.slice(0, max)}…` : props.title
})

const containerBg = computed(() => (hasImage.value ? COLORS.dark : COLORS.bg))
const textColor = computed(() => (hasImage.value ? COLORS.white : COLORS.dark))
const mutedColor = computed(() => (hasImage.value ? 'rgba(255,255,255,0.78)' : COLORS.muted))
const borderColor = computed(() => (hasImage.value ? 'rgba(255,255,255,0.25)' : COLORS.border))
</script>

<template>
  <div
    class="relative flex h-full w-full flex-col overflow-hidden p-16"
    :style="{ backgroundColor: containerBg, fontFamily: 'Inter' }"
  >
    <img
      v-if="hasImage"
      :src="imageUrl"
      class="absolute top-0 left-0 h-full w-full object-cover"
    />

    <div
      v-if="hasImage"
      class="absolute inset-0 flex"
      style="background-image: linear-gradient(180deg, rgba(15,13,11,0.55) 0%, rgba(15,13,11,0.62) 35%, rgba(15,13,11,0.97) 100%)"
    />

    <div class="absolute top-0 left-0 right-0 flex h-1.5" :style="{ backgroundColor: COLORS.primary }" />

    <div
      v-if="!hasImage"
      class="absolute -bottom-20 -right-20 flex h-[340px] w-[340px] rounded-full"
      :style="{ backgroundColor: COLORS.primary, opacity: 0.07 }"
    />

    <div class="mt-5 mb-7 flex">
      <div
        class="flex rounded-full px-5 py-1.5 text-[18px] font-bold tracking-wide"
        :style="{ backgroundColor: COLORS.primary, color: COLORS.white }"
      >
        {{ badge }}
      </div>
    </div>

    <div
      class="mb-6 flex text-[52px] font-bold"
      :style="[{ lineHeight: '1.15', maxWidth: '1050px' }, { color: textColor }]"
    >
      {{ truncatedTitle }}
    </div>

    <div class="flex flex-1 text-2xl" :style="{ color: mutedColor }">
      {{ subtitle }}
    </div>

    <div
      class="flex flex-row items-center justify-between pt-6"
      :style="{ borderTop: `2px solid ${borderColor}` }"
    >
      <div class="flex flex-row items-center gap-2.5">
        <div class="flex text-[22px] font-bold" :style="{ color: textColor }">CICS App</div>
      </div>
      <div class="flex text-lg" :style="{ color: mutedColor }">cics.cunoc.edu.gt</div>
    </div>
  </div>
</template>
