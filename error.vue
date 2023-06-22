<template>
  <v-container fluid class="container">
    <v-row justify="center">
      <v-col cols="12" sm="6" md="6" lg="6">
        <v-card style="text-align: center">
          <v-card-title class="headline d-flex flex-column justify-center align-center">
            <v-icon>
              mdi-alert-outline
            </v-icon>
            <strong>Ha ocurrido un error</strong>
          </v-card-title>
          <v-card-text style="font-size: 1rem">
            Puede que esta página no exista o se haya producido un error interno, puedes <nuxt-link to="/" style="color: orangered; font-style: italic; text-decoration: none">
              <strong>regresar al inicio</strong>
              <v-icon
                style="font-size: 1.2rem"
                class="ml-1 mb-1"
              >
                mdi-home-outline
              </v-icon>
            </nuxt-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.container {
  height: 90vh;
  display: flex;
  align-items: center;
}
</style>
