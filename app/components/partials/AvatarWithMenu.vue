<template>
  <PopoverRoot>
    <PopoverTrigger as-child
      ><AvatarRoot
        class="group relative flex h-full w-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full"
      >
        <AvatarFallback
          class="text-muted-color bg-surface-200 flex size-full items-center justify-center overflow-hidden select-none"
        >
          {{ `${displayName?.charAt(0)}` }}
        </AvatarFallback>
        <AvatarFallback
          class="bg-surface-700/80 absolute inset-0 flex items-center justify-center tracking-widest text-white opacity-0 transition-opacity duration-200 select-none group-hover:opacity-100"
        >
          <Icon name="icon-park-outline:more" />
        </AvatarFallback> </AvatarRoot
    ></PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="top"
        :side-offset="16"
        class="data-[state=open]:animate-contentShow bg-cics-white z-[9999] ml-4 w-72 rounded-xl border border-black/80 p-3.5 shadow-lg shadow-black/10 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <h2 class="font-semibold mb-2">Otras opciones</h2>
        <h3 class="mb-1.5 inline-flex items-center gap-2 text-sm font-medium">
          Sesión iniciada como:
        </h3>
        <p class="mb-2">
          {{ displayName }}
        </p>


        <h3 class="mb-1.5 inline-flex items-center gap-2 text-sm font-medium">
          Tema
        </h3>
        <ColorScheme placeholder="..." tag="div">
          <ToggleGroupRoot
            class="flex items-center gap-2.5"
            :model-value="$colorMode.preference"
            @update:model-value="
              (val) => {
                if (val) $colorMode.preference = val as string
              }
            "
          >
            <ToggleGroupItem
              v-for="(option, index) in schemeOptions"
              class="group hover:bg-primary/10 active:bg-primary/15 data-[state=on]:bg-primary-600 flex items-center gap-2 rounded-lg border-2 border-transparent px-2 py-1 transition duration-[50ms] data-[state=on]:border-black data-[state=on]:text-white dark:data-[state=on]:border-white"
              :value="option.value"
            >
              <Icon :name="option.icon" :class="option.iconClass" />
            </ToggleGroupItem>
          </ToggleGroupRoot>
        </ColorScheme>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
<script setup lang="ts">
defineProps<{
  displayName?: string
}>()

const schemeOptions = [
  {
    name: 'Sistema',
    value: 'system',
    icon: 'icon-park-twotone:computer',
    iconClass:
      'scale-[80%] group-data-[state=on]:scale-100 transition-transform duration-500'
  },
  {
    name: 'Claro',
    value: 'light',
    icon: 'icon-park-twotone:sun',
    iconClass:
      'scale-[80%] translate-y-0.5 group-data-[state=on]:rotate-45 group-data-[state=on]:translate-y-0 group-data-[state=on]:scale-100  transition-transform duration-500'
  },
  {
    name: 'Oscuro',
    value: 'dark',
    icon: 'icon-park-twotone:moon',
    iconClass:
      'scale-[80%] -rotate-12 translate-y-0.5 group-data-[state=on]:rotate-0 group-data-[state=on]:translate-y-0 group-data-[state=on]:scale-100  transition-transform duration-500'
  }
]
</script>
<style scoped></style>
