<template>
  <v-container style="padding: 4px">
    <v-card
      class="mx-auto rounded-sm"
      :class="getCorrectClassCard(curso)"
      max-width="350"
      min-width="180"
    >
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
  },
  methods: {
    getCorrectClassCard(curso) {
      if (curso.semestre == 'III') {
        return 'card_color_green'
      } else if (curso.semestre == 'IV') {
        return 'card_color_yellow'
      } else if (curso.semestre == 'V') {
        return 'card_color_smoth_green'
      } else if (curso.semestre == 'VI') {
        return 'card_color_orage'
      } else if (curso.semestre == 'VIII') {
        return 'card_color_magenta'
      } else if (curso.semestre == 'X') {
        return 'card_color_blue'
      }
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

.card_color_green {
  background-color: #4caf50;
  color: white;
}

.card_color_yellow {
  background-color: #ffeb3b;
  color: black;
}

.card_color_smoth_green {
  background-color: #8bc34a;
  color: white;
}

.card_color_orage {
  background-color: #ff9800;
  color: white;
}

.card_color_magenta {
  background-color: #c74b74;
  color: white;
}

.card_color_blue {
  background-color: #2196f3;
  color: white;
}
</style>
