export const useCustomPageTitle = (titleToSet?: string) => {
  useSeoMeta({
    title: () => 
      titleToSet ? `${titleToSet} | CICS App` : 'CICS App | Portal',
    ogTitle: () =>
      titleToSet ? `${titleToSet} | CICS App` : 'CICS App | Portal',
  });
}