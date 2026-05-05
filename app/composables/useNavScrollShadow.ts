export function useNavScrollShadow(threshold = 30) {
  const hasScrolled = ref(false)

  const onScroll = () => {
    hasScrolled.value = window.scrollY > threshold
  }

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return { hasScrolled }
}
