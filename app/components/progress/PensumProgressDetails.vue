<template>
  <div style="position: sticky !important; top: 4rem; z-index: 1">
    <v-sheet
      v-if="$vuetify.display.smAndUp"
      class="pa-4"
      rounded="xl"
      border
      elevation="1"
    >
      <v-progress-linear
        :active="loading"
        class="w-50"
        absolute
        location="bottom"
        indeterminate
      ></v-progress-linear>
      <v-row justify="center" class="text-center">
        <!-- <v-col cols="12">
          <h2>Progreso de carrera:</h2>
        </v-col> -->
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <h6 class="text-overline">Créditos acumulados:</h6>
          <strong>{{ careerProgress?.current_credits.total_credits }}</strong>
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <h6 class="text-overline">Créditos obligatorios:</h6>
          <strong
            >{{ careerProgress?.current_credits.mandatory_credits }} /
            {{ careerProgress?.mandatory_credits }}</strong
          >
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <h6 class="text-overline">Créditos disponibles:</h6>
          <strong
            >{{ careerProgress?.current_credits.total_credits }} /
            {{ careerProgress?.available_credits }}</strong
          >
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet v-else class="pa-4" rounded="xl" border elevation="2">
      <v-progress-linear
        :active="loading"
        class="w-50"
        absolute
        location="bottom"
        indeterminate
      ></v-progress-linear>
      <v-row justify="center" class="text-center" no-gutters>
        <!-- <v-col cols="12" class="mb-2">
          <h2>Progreso de carrera:</h2>
        </v-col> -->
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <span class="text-overline">Créditos acumulados:</span>
          <strong>{{ careerProgress?.current_credits.total_credits }}</strong>
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <span class="text-overline">Créditos obligatorios:</span>
          <strong
            >{{ careerProgress?.current_credits.mandatory_credits }} /
            {{ careerProgress?.mandatory_credits }}</strong
          >
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <span class="text-overline">Créditos disponibles:</span>
          <strong
            >{{ careerProgress?.current_credits.total_credits }} /
            {{ careerProgress?.available_credits }}</strong
          >
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  careerProgress: ProgressResponse | null
  loading: boolean
}>()
</script>
<style lang="scss" scoped></style>
