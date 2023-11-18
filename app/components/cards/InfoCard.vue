<template>
  <v-card :to="route" rounded="lg">
    <v-img height="150" :src="img" cover />
    <v-container class="pa-2">
      <v-card-item>
        <v-card-subtitle align="left" class="mb-2">
          <p class="card-subtitle">
            {{ subtitle }}
          </p>
        </v-card-subtitle>
        <v-card-title class="text-orange-accent-4" align="left">
          <span class="card-title">
            {{ title }}
          </span>
        </v-card-title>
      </v-card-item>

      <v-card-text align="left">
        <p class="card-description">
          {{ description }}
        </p>
      </v-card-text>
    </v-container>
  </v-card>
</template>
<script lang="ts">
export default {
  props: {
    img: {
      type: String,
      required: true
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
  }
}
</script>
<style lang="scss" scoped>
.card-title {
  font-weight: 600;
  font-size: 1.5rem;
}
.card-subtitle {
  font-weight: 400;
  font-size: 0.9rem;
}
.card-description {
  font-weight: normal;
  font-size: 1rem;
}
</style>
