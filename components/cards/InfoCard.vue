<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :to="route"
      :elevation="isHovering ? 6 : 2"
      rounded="lg"
    >
      <v-img 
        height="150"
        :src="img"
        cover
      />
      <v-container class="pa-2">
        <v-card-item>
          <v-card-subtitle
            align="left"
            class="mb-2"
          >
            <p class="card-subtitle">
              {{ subtitle }}
            </p>  
          </v-card-subtitle>
          <v-card-title
            class="text-orange-accent-4"
            align="left"
          >
            <p class="card-title">
              {{ title }}
            </p>
          </v-card-title>
        </v-card-item>
  
        <v-card-text align="left">
          <p class="card-description">
            {{ description }}
          </p>
        </v-card-text>
      </v-container>
    </v-card>
  </v-hover>
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
      required: false
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    route: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss">
  .card-title {
    font-weight: 600;
    font-size: 2rem;
  }
  .card-subtitle {
    font-weight: 400;
    font-size: 1.1rem;
  }
  .card-description {
    font-weight: normal;
    font-size: 1.1rem;
  }
</style>
