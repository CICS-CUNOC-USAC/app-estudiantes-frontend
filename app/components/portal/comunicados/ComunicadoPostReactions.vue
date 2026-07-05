<template>
  <section class="py-2" v-if="reactionsData">
    <div
      class="flex flex-wrap gap-2 transition-opacity opacity-75 hover:opacity-100"
      :class="{
        'pointer-events-none opacity-60':
          status === 'pending' || asyncStatus === 'loading'
      }"
    >
      <button
        v-for="reaction in Object.keys(reactionsData.counts)"
        :key="reaction"
        class="flex w-12 items-center rounded-full border-2 border-black px-2 py-1 transition hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
        :class="{
          'border-primary-500/50 shadow-primary-500/50 text-color':
            reactionsData.userReaction?.includes(reaction),
          'text-muted-color hover:text-color': !reactionsData.userReaction?.includes(reaction)
        }"
        @click="mutate(reaction)"
      >
        <Icon
          :name="
            MAPPED_REACTIONS_ICON_COMPONENTS[reaction] || 'lucide:question-mark'
          "
        />
        <span
          class="ml-1 text-xs"
          
          >{{ reactionsData.counts[reaction] }}</span
        >
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import {
  MAPPED_REACTIONS_ICON_COMPONENTS,
  type StrapiPostReactionResponse
} from '~/lib/api/strapi/types'

const props = defineProps<{
  postId: string
  loading?: boolean
}>()

const { authenticated } = storeToRefs(useRegularAuthStore())

const postIdRef = computed(() => String(props.postId || ''))

const {
  data: reactionsData,
  refresh: refreshReactions,
  status
} = await useAsyncData<StrapiPostReactionResponse>(
  () => `cics-comunicado-${postIdRef.value}-reactions`,
  async () => {
    if (!postIdRef.value) {
      return {
        counts: {},
        userReaction: null,
        total: 0
      }
    }

    return $api(`/reactions/${postIdRef.value}`)
  },
  {
    lazy: true,
    default: () => ({
      counts: {},
      userReaction: null,
      total: 0
    }),
    watch: [postIdRef]
  }
)

const { mutate, asyncStatus } = useMutation({
  mutation: (reaction: string) => {
    if (!authenticated.value) {
      toast.error('Debes iniciar sesión para reaccionar a la publicación.')
      return Promise.reject('Not authenticated')
    }
    return $api('/reactions/toggle', {
      method: 'POST',
      body: {
        strapiPostId: postIdRef.value,
        type: reaction
      }
    })
  },
  onSuccess: () => {
    refreshReactions()
  }
})
</script>
