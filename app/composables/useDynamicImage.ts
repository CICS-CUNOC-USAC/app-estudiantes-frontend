export const useDynamicImage = (path: string): string =>
  new URL(path, import.meta.url).toString();