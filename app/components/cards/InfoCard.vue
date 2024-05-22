<template>
  <v-card :to="route" rounded="lg" :height="fullHeight ? '100%' : ''">
    <v-img v-if="img" height="150" :src="img" cover />
    <v-container class="pa-2">
      <v-card-item>
        <v-card-subtitle v-if="subtitle" align="left" class="mb-2">
          <p class="card-subtitle">
            {{ subtitle }}
          </p>
        </v-card-subtitle>
        <v-card-title class="text-heading" align="left">
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
  }
}
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
  font-size: 0.9rem;
}
.card-description {
  font-weight: normal;
  font-size: 1rem;
}
</style>
