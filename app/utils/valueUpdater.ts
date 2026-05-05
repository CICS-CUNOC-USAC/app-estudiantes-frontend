import type { RowData, Updater } from "@tanstack/vue-table";
import '@tanstack/vue-table' //or vue, svelte, solid, qwik, etc.

declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    displayName: string
  }
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value
    = typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

