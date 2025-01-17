<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to
    unstyled
    class="flex h-full flex-col overflow-hidden rounded-lg border border-surface-950/75 bg-surface-50 text-color duration-300 ease-in-out dark:bg-surface-800
      -translate-x-0.5 -translate-y-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]
    "
    :class="{
      'p-2': !noSpacing,
      'cursor-pointer': to,
    }"
  >
    <slot name="career">
      <h3
      v-if="career"
        class="mb-2 text-xs font-semibold transition-colors duration-300 ease-in-out"
      >
        {{ semesterToRoman(semester || 1) }} &bull; {{ career }}
      </h3>
    </slot>
    <slot name="content">
      <p class="mb-2 flex-1 leading-tight">
        {{ curso }}
      </p>
      <div class="grid grid-cols-2">
      <span class="block text-xs tracking-tight justify-self-start">
        <Icon v-if="smallIcon" :name="smallIcon" class="mr-1 inline-block !text-sm" />
        Seccion: {{ seccion }}
      </span>
      <span class="block text-xs tracking-tight justify-self-end">
        <Icon v-if="smallIcon" :name="smallIcon" class="mr-1 inline-block !text-sm" />
        {{ transformToWeekdays(days || []) }}
      </span>
      </div>
    </slot>
    <slot name="footer">
    </slot>
  </component>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'
defineProps<{
  career?: string
  curso?: string
  to?: string
  seccion?: string
  semester?: number
  days?: Array<number>
  smallIcon?: string
  noSpacing?: boolean
}>()

function semesterToRoman(semesterNum: number) {
  if (semesterNum < 1 || semesterNum > 10) {
    throw new Error("Input must be a number between 1 and 10.");
  }

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return romanNumerals[semesterNum - 1];
}

function transformToWeekdays(numbers: number[]): string {
  const weekdays: { [key: number]: string } = {
    1: 'L',   // Lunes
    2: 'M',   // Martes
    3: 'Mi',  // Miércoles
    4: 'J',   // Jueves
    5: 'V',   // Viernes
    6: 'S',   // Sábado
    7: 'D'    // Domingo
  };

  return numbers.map((num) => {
    if (num < 1 || num > 7) {
      throw new Error(`Invalid day number: ${num}. Must be between 1 and 7.`);
    }
    return weekdays[num];
  }).join(' ');
}
</script>
<style lang="postcss" scoped></style>
