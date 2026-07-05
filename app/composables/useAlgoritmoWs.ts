import type { WsEvent } from '~/lib/api/schedules-generator/types'

export function useAlgoritmoWs() {
  const ws = ref<WebSocket | null>(null)
  const connected = ref(false)
  const lastEvent = ref<WsEvent | null>(null)
  let manualClose = false
  let retry = 0

  function connect() {
    if (ws.value) return
    manualClose = false
    const base = import.meta.env.VITE_API_SCHEDULES_BASE_URL as string
    const url = base.replace(/^https?/, (m) => (m === 'https' ? 'wss' : 'ws')) + '/ws/algoritmo'
    ws.value = new WebSocket(url)

    ws.value.onopen = () => { connected.value = true; retry = 0 }
    ws.value.onclose = () => {
      connected.value = false
      ws.value = null
      if (!manualClose && retry < 5) {
        retry++
        setTimeout(connect, 500 * retry) // backoff simple
      }
    }
    ws.value.onerror = () => { connected.value = false }
    ws.value.onmessage = (e) => {
      try { lastEvent.value = JSON.parse(e.data) as WsEvent }
      catch { /* ignore malformed */ }
    }
  }

  function disconnect() {
    manualClose = true
    ws.value?.close()
    ws.value = null
    connected.value = false
  }

  onUnmounted(disconnect)

  return { connected, lastEvent, connect, disconnect }
}
