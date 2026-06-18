<template>
  <component :is="to ? NuxtLink : 'div'" :to unstyled class="flex h-full flex-col overflow-hidden rounded-lg border border-surface-950/75 text-color duration-300 ease-in-out dark:bg-surface-800
      -translate-x-0.5 -translate-y-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]
    " :class="{
      'p-1.5': !noSpacing,
      'cursor-pointer': to,
      [colorCareer[career_id] || 'bg-gray-200']: true
    }">
    <slot name="career">
      <h3 v-if="career" class="mb-0.5 truncate text-[10px] font-semibold leading-tight transition-colors duration-300 ease-in-out">
        {{ semesterToRoman(semester || 1) }} &bull; {{ career }}
      </h3>
    </slot>
    <slot name="content">
      <p class="mb-0.5 text-[11px] font-medium flex-1 leading-snug">
        {{ curso }}
      </p>
      <div class="mt-auto flex justify-between">
        <span class="text-[10px] tracking-tight">
          {{ seccion }}
        </span>
        <span class="text-[10px] tracking-tight">
          {{ abbreviateWeekdays(days || []) }}
        </span>
      </div>
    </slot>
    <slot name="footer">
      <div class="dark:min-h-1 dark:mt-1 light:hidden dark:block" :class="{
        [colorCareer[career_id] || 'bg-gray-200']: true
      }"></div>
    </slot>
  </component>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'
defineProps<{
  career?: string
  career_id: number
  curso?: string
  to?: string
  seccion?: string
  semester?: number
  days?: Array<string>
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

function abbreviateWeekdays(names: string[]): string {
  const abbrev: Record<string, string> = {
    'Lunes': 'L', 'Martes': 'M', 'Miercoles': 'Mi', 'Miércoles': 'Mi',
    'Jueves': 'J', 'Viernes': 'V', 'Sabado': 'S', 'Sábado': 'S', 'Domingo': 'D',
  };
  return names.map((name) => abbrev[name] || name.substring(0, 2)).join(' ');
}

const colorCareer: Record<number, string> = {
  0: 'bg-sky-300',
  58: 'bg-orange-300', //sistemas
  33: 'bg-red-300', //civil
  34: 'bg-lime-300', //mecanica
  35: 'bg-teal-300', //industrial
  36: 'bg-green-300', //mec-industrial
}
</script>
<style lang="postcss" scoped></style>
