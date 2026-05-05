<template>
  <section class="mt-10 border-t border-black/10 pt-6">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">Comentarios</h2>
      <span class="text-muted-color text-sm">
        {{ commentsData?.length || 0 }}
      </span>
    </div>

    <div class="mb-6">
      <div class="flex gap-3 w-full">
        <CTextarea
          v-model="newCommentContent"
          label="Escribe un comentario"
          root-class="w-full"
          prepend-icon="icon-park-twotone:edit-name"
          no-borders
          fill-height
          :rows="3"
          placeholder="Comparte tu opinión sobre este comunicado"
        />
        <Button
          label="Comentar"
          icon="icon-park-outline:send"
          size="small"
          :loading="createAsyncStatus === 'loading'"
          :disabled="!newCommentContent.trim()"
          @click="submitRootComment"
        />
      </div>

      <p class="text-muted-color text-xs py-1.5">
        {{
          authenticated
            ? ''
            : 'Inicia sesión para publicar comentarios y responder.'
        }}
      </p>
    </div>

    <div
      v-if="commentsStatus === 'pending'"
      class="text-muted-color rounded-lg border border-black/10 px-4 py-3 text-sm"
    >
      Cargando comentarios...
    </div>

    <div
      v-else-if="!commentsData || commentsData.length === 0"
      class="text-muted-color rounded-lg border border-dashed border-black/20 px-4 py-3 text-sm"
    >
      Aún no hay comentarios. Sé la primera persona en comentar.
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="comment in commentsData"
        :key="comment.id"
        :id="`comment-${comment.id}`"
        class="bg-surface-50 dark:bg-surface-900 rounded-xl border border-black/15 px-4 py-3"
      >
        <header class="mb-2 flex items-start justify-between gap-2">
          <div>
            <p class="text-sm font-semibold">
              {{ comment.user?.name || 'Usuario' }}
            </p>
            <p class="text-muted-color text-xs">
              {{ formatCommentDate(comment.createdAt) }}
            </p>
          </div>
        </header>

        <p class="text-sm whitespace-pre-line">
          {{ comment.content }}
        </p>

        <div class="mt-2 flex items-center gap-4">
          <Button
            v-if="authenticated"
            variant="tonal"
            size="small"
            :label="
              activeReplyCommentId === comment.id ? 'Cancelar' : 'Responder'
            "
            @click="toggleReplyBox(comment.id)"
          />
          <Button
            v-if="isCommentOwner(comment.user?.id)"
            variant="tonal"
            size="small"
            severity="danger"
            label="Eliminar"
            :loading="isDeletingComment(comment.id)"
            @click="requestDeleteComment(comment.id)"
          />
        </div>

        <div v-if="activeReplyCommentId === comment.id" class="mt-3">
          <CTextarea
            v-model="replyDrafts[comment.id]"
            label="Responder comentario"
            prepend-icon="icon-park-twotone:message"
            no-borders
            :rows="2"
            placeholder="Escribe tu respuesta"
          />
          <div class="mt-2 flex justify-end">
            <Button
              label="Responder"
              icon="icon-park-outline:send"
              size="small"
              :loading="createAsyncStatus === 'loading'"
              :disabled="!getReplyDraft(comment.id).trim()"
              @click="submitReply(comment.id)"
            />
          </div>
        </div>

        <div v-if="comment.replies?.length" class="mt-4 space-y-3 pl-4">
          <article
            v-for="reply in comment.replies"
            :key="reply.id"
            :id="`comment-${reply.id}`"
            class="bg-surface-100 dark:bg-surface-950 rounded-lg border border-black/10 px-3 py-2"
          >
            <header class="mb-1 flex items-start justify-between gap-2">
              <div>
                <p class="text-sm font-semibold">
                  {{ reply.user?.name || 'Usuario' }}
                </p>
                <p class="text-muted-color text-xs">
                  {{ formatCommentDate(reply.createdAt) }}
                </p>
              </div>
              <Button
                v-if="isCommentOwner(reply.user?.id)"
                variant="tonal"
                size="small"
                severity="danger"
                label="Eliminar"
                :loading="isDeletingComment(reply.id)"
                @click="requestDeleteComment(reply.id)"
              />
            </header>
            <p class="text-sm whitespace-pre-line">{{ reply.content }}</p>
          </article>
        </div>
      </article>
    </div>

    <Dialog v-model:open="deleteModalOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar este comentario?</DialogTitle>
        </DialogHeader>
        <p class="text-sm">Esta acción no se puede deshacer.</p>
        <DialogFooter class="mt-4 flex gap-3 sm:justify-start">
          <Button
            label="Cancelar"
            severity="secondary"
            class="w-full"
            @click="closeDeleteModal"
          />
          <Button
            label="Eliminar"
            severity="danger"
            class="w-full"
            :loading="
              pendingDeleteCommentId !== null &&
              isDeletingComment(pendingDeleteCommentId)
            "
            :disabled="pendingDeleteCommentId === null"
            @click="confirmDeleteComment"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import CTextarea from '~/components/primitives/form/CTextarea.vue'
import type { StrapiPostComment } from '~/lib/api/strapi/types'

const props = defineProps<{
  postId: string
}>()

const { authenticated, user } = storeToRefs(useRegularAuthStore())
const postIdRef = computed(() => String(props.postId || ''))

const {
  data: commentsData,
  status: commentsStatus,
  refresh: refreshComments
} = await useAsyncData<StrapiPostComment[]>(
  () => `cics-comunicado-${postIdRef.value}-comments`,
  async () => {
    if (!postIdRef.value) {
      return []
    }
    return $api(`/comments/${postIdRef.value}`)
  },
  {
    lazy: true,
    default: () => [],
    watch: [postIdRef]
  }
)

const newCommentContent = ref('')
const activeReplyCommentId = ref<number | null>(null)
const replyDrafts = reactive<Record<number, string>>({})
const deletingCommentIds = ref<number[]>([])
const deleteModalOpen = ref(false)
const pendingDeleteCommentId = ref<number | null>(null)
const lastCreatedParentId = ref<number | undefined>(undefined)

const submitRootComment = async () => {
  createCommentMutation({
    content: newCommentContent.value
  })
}

const submitReply = async (parentId: number) => {
  createCommentMutation({
    content: getReplyDraft(parentId),
    parentId
  })
}

const { mutate: createCommentMutation, asyncStatus: createAsyncStatus } =
  useMutation({
    mutation: ({
      content,
      parentId
    }: {
      content: string
      parentId?: number
    }) => {
      if (!authenticated.value) {
        toast.error('Debes iniciar sesión para comentar.')
        return Promise.reject(new Error('Not authenticated'))
      }

      const trimmedContent = content.trim()
      if (!trimmedContent) {
        return Promise.reject(new Error('Empty content'))
      }

      lastCreatedParentId.value = parentId

      return $api<{ id: number }>('/comments', {
        method: 'POST',
        body: {
          content: trimmedContent,
          strapiPostId: postIdRef.value,
          ...(parentId ? { parentId } : {})
        }
      })
    },
    onSuccess: async (createdComment) => {
      if (lastCreatedParentId.value) {
        replyDrafts[lastCreatedParentId.value] = ''
        activeReplyCommentId.value = null
      } else {
        newCommentContent.value = ''
      }

      await refreshComments()
      await scrollToComment(createdComment.id)
    },
    onError: (error) => {
      if (
        error instanceof Error &&
        (error.message === 'Empty content' ||
          error.message === 'Not authenticated')
      ) {
        return
      }

      toast.error('No se pudo publicar el comentario.')
    }
  })

const { mutate: deleteCommentMutation } = useMutation({
  mutation: (commentId: number) => {
    if (!authenticated.value) {
      toast.error('Debes iniciar sesión para eliminar comentarios.')
      return Promise.reject(new Error('Not authenticated'))
    }

    deletingCommentIds.value.push(commentId)

    return $api(`/comments/${commentId}`, {
      method: 'DELETE'
    }).finally(() => {
      deletingCommentIds.value = deletingCommentIds.value.filter(
        (id) => id !== commentId
      )
    })
  },
  onSuccess: async () => {
    await refreshComments()
    closeDeleteModal()
  },
  onError: (error) => {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return
    }

    toast.error('No se pudo eliminar el comentario.')
  }
})

const toggleReplyBox = (commentId: number) => {
  activeReplyCommentId.value =
    activeReplyCommentId.value === commentId ? null : commentId
}

const getReplyDraft = (commentId: number) => {
  return replyDrafts[commentId] || ''
}

const requestDeleteComment = (commentId: number) => {
  pendingDeleteCommentId.value = commentId
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
  pendingDeleteCommentId.value = null
}

const confirmDeleteComment = async () => {
  if (pendingDeleteCommentId.value === null) {
    return
  }

  deleteCommentMutation(pendingDeleteCommentId.value)
}

const scrollToComment = async (commentId: number) => {
  await nextTick()
  const commentElement = document.getElementById(`comment-${commentId}`)

  if (commentElement) {
    commentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}

const isDeletingComment = (commentId: number) => {
  return deletingCommentIds.value.includes(commentId)
}

const isCommentOwner = (commentUserId?: number) => {
  if (!commentUserId || !user.value?.id) {
    return false
  }

  return commentUserId === user.value.id
}

const formatCommentDate = (dateString: string) => {
  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(dateString))
}
</script>
