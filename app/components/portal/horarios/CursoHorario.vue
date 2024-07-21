<template>
  <v-container style="padding: 4px">
    <v-card class="mx-auto" max-width="350" min-width="180">
      <template #actions>
        <v-container>
          <v-row justify="center">
            <v-col class="text-center">
              <v-row>
                <v-col class="text-center small-text">
                  {{ curso.curso }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center small-text">
                  {{ curso.codigo }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center small-text">
                  {{ curso.docente }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center small-text">
                  {{ curso.semestre }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-card>
  </v-container>
</template>

<script lang="ts">
export default {
  props: {
    curso: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.small-text {
  font-size: 12px;
  /* Ajusta el tamaño según sea necesario */
  margin: 0;
  padding: 0;
  /* Elimina márgenes adicionales */
}
</style>
