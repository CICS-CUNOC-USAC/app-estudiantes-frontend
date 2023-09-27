import { defineStore } from 'pinia'

export enum SnackbarType {
  SUCCESS,
  ERROR,
  WARNING,
  MESSAGE
}

export const useSnackbarStore = defineStore({
  id: 'snackbar',
  state: () => ({
    snackbarShow: false,
    title: '',
    message: '',
    color: '',
    type: SnackbarType.MESSAGE
  }),
  actions: {
    showSnackbar({
      title,
      message,
      color,
      type
    }: {
      title: string
      message: string
      color?: string
      type?: SnackbarType
    }) {
      this.title = title
      this.message = message
      this.color = color!
      this.type = type!
      this.snackbarShow = true
    },
    hideSnackbar() {
      this.snackbarShow = false
    }
  }
})
