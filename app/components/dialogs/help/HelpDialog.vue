<template>
  <div>
    <v-btn
      class="floating-open"
      icon="mdi-help"
      elevation="4"
      @click="openDialog()"
    />

    <v-dialog v-model="dialog" class="HelpDialog">
      <v-skeleton-loader
        v-if="loading"
        type="heading, heading, text"
      ></v-skeleton-loader>
      <v-card v-else class="HelpCard">
        <v-card-text>
          <v-row class="text-center">
            <v-col></v-col>
            <v-col cols="6" sm="6">
              <v-sheet
                rounded="lg"
                class="pa-1 h-100 d-flex flex-column justify-center"
              >
                <span class="font-weight-bold text-h4 help-title">{{
                  title
                }}</span>
              </v-sheet>
            </v-col>
            <v-col></v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col>
              <v-sheet>
                <!--
                <span class="pa-2 h-100 d-flex align-center"
                  >{{ content }}
                </span>
                -->
                <MdPreview
                  :model-value="content"
                  preview-theme="cics"
                  style="background-color: rgb(var(--v-theme-surface))"
                />
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 mb-1">
          <v-spacer />
          <v-btn color="red" variant="plain" @click="dialog = false"
            >CERRAR</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import '@/components/dialogs/help/cics-theme.css'
defineProps<{
  title: string
  content: string
}>()
const { loading } = storeToRefs(useCoursesStore())
const dialog = ref(false)
const openDialog = () => {
  dialog.value = true
}
</script>
<style lang="scss" scoped>
.HelpCard {
  &__numeric {
    padding: 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.help-title {
  word-wrap: normal;
}

.HelpDialog {
  max-width: 100%;
  @media (min-width: 900px) {
    max-width: 70%;
  }
  @media (min-width: 1200px) {
    max-width: 50%;
  }
}

.floating-open {
  position: fixed;
  bottom: 12%;
  right: 4%;
  text-align: center;
  z-index: 10;
}
</style>
