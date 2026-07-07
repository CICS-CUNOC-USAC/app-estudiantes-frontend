<template>
  <div class="border border-black rounded-xl  bg-card p-4 space-y-3">
    <div class="h-5 w-32 rounded bg-muted animate-pulse" />
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
      <div v-for="i in 6" :key="i" class="h-14 rounded-lg bg-muted animate-pulse border border-black/20" />
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] 2xl:grid-cols-[380px_1fr] gap-4 items-start">
    <div class="hidden lg:block border border-black rounded-xl  bg-card p-4 space-y-1.5">
      <div v-for="i in 6" :key="i" class="h-14 rounded-[0.6rem] bg-muted animate-pulse border border-black/20" />
    </div>
    <div class="border border-black rounded-xl  bg-card p-4">
      <div class="grid grid-cols-[56px_repeat(5,1fr)] gap-1.5 mb-1.5">
        <div />
        <div v-for="i in 5" :key="i" class="h-8 rounded-lg bg-muted animate-pulse" />
      </div>
      <div v-for="row in 8" :key="row" class="grid grid-cols-[56px_repeat(5,1fr)] gap-1.5 mb-1.5">
        <div class="h-11 rounded bg-transparent" />
        <div v-for="col in 5" :key="col" class="h-11 rounded-lg bg-muted/60 animate-pulse border border-black/10" />
      </div>
    </div>
  </div>
</template>
