<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        <Icon
          name="icon-park-twotone:computer"
          class="mb-1 mr-1.5 inline-block"
        />
        Sesiones activas
      </h3>
      <button
        class="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
        :disabled="loadingAll || sessions.length === 0"
        @click="logoutAll"
      >
        <Icon name="icon-park-twotone:exit" class="inline-block" />
        Cerrar todas
      </button>
    </div>

    <section class="mb-6 mt-2 space-y-3">
      <!-- Loading state -->
      <div
        v-if="loading"
        class="flex items-center gap-2 text-sm text-muted-color"
      >
        <Icon name="svg-spinners:180-ring" class="inline-block" />
        Cargando sesiones...
      </div>

      <!-- Empty state -->
      <div
        v-else-if="sessions.length === 0"
        class="text-sm text-muted-color"
      >
        No hay sesiones activas.
      </div>

      <!-- Session cards -->
      <div
        v-for="session in sessions"
        v-else
        :key="session.id"
        class="bg-surface-50 dark:bg-surface-900 flex items-start justify-between rounded-lg border border-black/10 p-4 dark:border-neutral-700"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <Icon
              :name="deviceIcon(session.device_info)"
              class="shrink-0 text-primary-600"
            />
            <span class="truncate text-sm font-medium">
              {{ deviceLabel(session.device_info) }}
            </span>
          </div>
          <p class="mt-1 text-xs text-muted-color">
            IP: {{ session.ip_address || '—' }}
          </p>
          <p class="text-xs text-muted-color">
            Iniciada: {{ formatDate(session.created_at) }}
          </p>
          <p class="text-xs text-muted-color">
            Expira: {{ formatDate(session.expires_at) }}
          </p>
        </div>

        <button
          class="ml-3 mt-0.5 shrink-0 text-muted-color hover:text-red-500 disabled:opacity-40"
          :disabled="revoking === session.id"
          @click="revokeSession(session.id)"
        >
          <Icon
            v-if="revoking === session.id"
            name="svg-spinners:180-ring"
            class="text-base"
          />
          <Icon v-else name="icon-park-twotone:close-one" class="text-base" />
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

type Session = {
  id: number
  device_info: string | null
  ip_address: string | null
  created_at: string
  expires_at: string
}

const props = defineProps<{
  role: 'regular' | 'staff'
}>()

const baseEndpoint = computed(() =>
  props.role === 'staff' ? '/staff-auth' : '/auth',
)

const sessions = ref<Session[]>([])
const loading = ref(false)
const loadingAll = ref(false)
const revoking = ref<number | null>(null)

async function fetchSessions() {
  loading.value = true
  try {
    sessions.value = await $api<Session[]>(`${baseEndpoint.value}/sessions`)
  } catch {
    toast.error('Error al cargar las sesiones')
  } finally {
    loading.value = false
  }
}

async function revokeSession(id: number) {
  revoking.value = id
  try {
    await $api(`${baseEndpoint.value}/sessions/${id}`, { method: 'DELETE' })
    sessions.value = sessions.value.filter((s) => s.id !== id)
    toast.success('Sesión cerrada')
  } catch {
    toast.error('No se pudo cerrar la sesión')
  } finally {
    revoking.value = null
  }
}

async function logoutAll() {
  loadingAll.value = true
  try {
    await $api(`${baseEndpoint.value}/logout-all`, { method: 'POST' })
    sessions.value = []
    toast.success('Todas las sesiones han sido cerradas, por favor inicia sesión nuevamente')
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = props.role === 'staff' ? '/staff/login' : '/login'
  } catch {
    toast.error('No se pudieron cerrar todas las sesiones')
  } finally {
    loadingAll.value = false
  }
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

function deviceLabel(userAgent: string | null): string {
  if (!userAgent) return 'Dispositivo desconocido'
  const ua = userAgent.toLowerCase()
  if (ua.includes('postman')) return 'Postman'
  const browser = ua.includes('firefox')
    ? 'Firefox'
    : ua.includes('chrome') && !ua.includes('edg')
      ? 'Chrome'
      : ua.includes('safari') && !ua.includes('chrome')
        ? 'Safari'
        : ua.includes('edg')
          ? 'Edge'
          : 'Navegador'
  const os = ua.includes('android')
    ? 'Android'
    : ua.includes('iphone') || ua.includes('ipad')
      ? 'iOS'
      : ua.includes('windows')
        ? 'Windows'
        : ua.includes('mac')
          ? 'macOS'
          : ua.includes('linux')
            ? 'Linux'
            : ''
  return os ? `${browser} en ${os}` : browser
}

function deviceIcon(userAgent: string | null): string {
  if (!userAgent) return 'icon-park-twotone:computer'
  const ua = userAgent.toLowerCase()
  if (ua.includes('android') || ua.includes('iphone'))
    return 'icon-park-twotone:iphone'
  if (ua.includes('ipad') || ua.includes('tablet'))
    return 'icon-park-twotone:ipad'
  return 'icon-park-twotone:computer'
}

onMounted(fetchSessions)
</script>
