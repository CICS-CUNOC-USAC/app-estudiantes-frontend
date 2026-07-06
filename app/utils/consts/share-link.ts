export async function handleShareCurrentLink() {
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url
      })
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url)
      alert('¡Enlace copiado al portapapeles!')
    }
  } catch (err) {
    console.error('Error sharing:', err)
  }
}