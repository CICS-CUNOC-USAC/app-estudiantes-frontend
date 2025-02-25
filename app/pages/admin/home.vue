<template>
    <main>
        <h1>Administración</h1>
        <h1 class="text-2xl mb-8">{{ getSaludo() }}!</h1>
        <div class="flex flex-wrap justify-between">
            <CCardAlt interactive class="max-w-60" to="/admin/me">
                <template #content>
                    <div class="space-y-4 grid grid-cols-5">
                        <div class="col-span-1">
                            <Icon name="icon-park-twotone:user"></Icon>
                        </div>
                        <div class="col-span-4">
                            <div class="grid grid-rows-2">
                                <h2>Perfil</h2>
                                <h3>Ver informacion de tu perfil</h3>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex items-center gap-x-2 self-end">
                        <CButton label="Ver más" icon="icon-park-outline:arrow-right" variant="text"
                            class="flex-1 text-xs" />
                        <CButton label="No me interesa" icon="lucide:circle-x" variant="text" class="flex-1 text-xs" />
                    </div>
                </template>
            </CCardAlt>
            <CCardAlt interactive class="max-w-60" to="/admin/books/physical">
                <template #content>
                    <div class="space-y-4 grid grid-cols-5">
                        <div class="col-span-1">
                            <Icon name="icon-park-twotone:user"></Icon>
                        </div>
                        <div class="col-span-4">
                            <div class="grid grid-rows-2">
                                <h2>Biblioteca Fisica</h2>
                                <h3>Ver libros disponibles en la biblioteca de Ingenieria</h3>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex items-center gap-x-2 self-end">
                        <CButton label="Ver más" icon="icon-park-outline:arrow-right" variant="text"
                            class="flex-1 text-xs" />
                        <CButton label="No me interesa" icon="lucide:circle-x" variant="text" class="flex-1 text-xs" />
                    </div>
                </template>
            </CCardAlt>
            <CCardAlt interactive class="max-w-60" to="/admin/books/digital">
                <template #content>
                    <div class="space-y-4 grid grid-cols-5">
                        <div class="col-span-1">
                            <Icon name="icon-park-twotone:user"></Icon>
                        </div>
                        <div class="col-span-4">
                            <div class="grid grid-rows-2">
                                <h2>Biblioteca Digital</h2>
                                <h3>Ver libros disponibles en la biblioteca digital</h3>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex items-center gap-x-2 self-end">
                        <CButton label="Ver más" icon="icon-park-outline:arrow-right" variant="text"
                            class="flex-1 text-xs" />
                        <CButton label="No me interesa" icon="lucide:circle-x" variant="text" class="flex-1 text-xs" />
                    </div>
                </template>
            </CCardAlt>
            <CCardAlt interactive class="max-w-60" to="/admin/users">
                <template #content>
                    <div class="space-y-4 grid grid-cols-5">
                        <div class="col-span-1">
                            <Icon name="icon-park-twotone:user"></Icon>
                        </div>
                        <div class="col-span-4">
                            <div class="grid grid-rows-2">
                                <h2>Usuarios</h2>
                                <h3>Ver informacion de usuarios existentes</h3>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex items-center gap-x-2 self-end">
                        <CButton label="Ver más" icon="icon-park-outline:arrow-right" variant="text"
                            class="flex-1 text-xs" />
                        <CButton label="No me interesa" icon="lucide:circle-x" variant="text" class="flex-1 text-xs" />
                    </div>
                </template>
            </CCardAlt>
            <CCardAlt interactive class="max-w-60" to="/admin/roles">
                <template #content>
                    <div class="space-y-4 grid grid-cols-5">
                        <div class="col-span-1">
                            <Icon name="icon-park-twotone:user"></Icon>
                        </div>
                        <div class="col-span-4">
                            <div class="grid grid-rows-2">
                                <h2>Roles</h2>
                                <h3>Ver informacion de roles existentes</h3>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex items-center gap-x-2 self-end">
                        <CButton label="Ver más" icon="icon-park-outline:arrow-right" variant="text"
                            class="flex-1 text-xs" />
                        <CButton label="No me interesa" icon="lucide:circle-x" variant="text" class="flex-1 text-xs" />
                    </div>
                </template>
            </CCardAlt>
        </div>
    </main>
</template>
<script setup lang="ts">
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import { storeToRefs } from 'pinia'
const authStore = useAuthStore()
await authStore.fetchUser()
const regularAuthStore = useRegularAuthStore()
const { user } = storeToRefs(regularAuthStore)

function getSaludo() {
    const horaActual = new Date().getHours();
    if (horaActual >= 6 && horaActual < 12) {
        return "Buenos días"
    } else if (horaActual >= 12 && horaActual < 19) {
        return "Buenas tardes"
    } else {
        return "Buenas noches"
    }
}

definePageMeta({
    layout: 'admin'
})
</script>
<style lang=""></style>