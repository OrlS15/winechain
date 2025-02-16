<script setup lang="ts">
import { useQRCode } from "@vueuse/integrations/useQRCode"
import { z } from "zod"
import type { FormSubmitEvent } from "#ui/types"
import type { IBatch } from "~~/shared/types"

const toast = useToast()

const { data } = await useFetch("/api/batches", {
  /* order by createdAt */
  transform: (data) => ({ batches: data.batches.sort((a, b) => b.createdAt - a.createdAt) }),
})

/* qrcode */
const originalURL = useRequestURL()
const selectedQrcodeID = ref<string | undefined>()
const qrCodeURL = computed(() => {
  if (!selectedQrcodeID.value) return ""
  const url = new URL(originalURL.origin)
  url.searchParams.set("id", selectedQrcodeID.value)
  return url.toString()
})
const qrcode = useQRCode(qrCodeURL, {
  scale: 8,
})

/* edit info */
const editInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  grapeType: z.string(),
})
type EditInfoSchema = z.output<typeof editInfoSchema>
const editInfoState = reactive<Partial<EditInfoSchema>>({})

const isEditInfoModalOpen = ref(false)
function openEditInfo(id: number) {
  isEditInfoModalOpen.value = true
  Object.assign(editInfoState, structuredClone(data.value?.batches.find((b) => b.id === id)))
}
function onSubmitEditInfo(event: FormSubmitEvent<EditInfoSchema>) {
  $fetch("/api/batches", {
    method: "PATCH",
    body: {
      id: event.data.id,
      name: event.data.name,
      grapeType: event.data.grapeType,
    },
  })
    .then(async () => {
      toast.add({
        title: "Success",
        description: "Batch updated successfully",
        color: "success",
      })
      isEditInfoModalOpen.value = false
      await refreshNuxtData()
    })
    .catch(() => {
      toast.add({
        title: "Error",
        description: "An error occurred while updating the batch",
        color: "error",
      })
    })
}

/* add-history */
const addHistorySchema = z.object({
  id: z.number(),
  phase: z.string(),
  description: z.string().optional(),
})
type AddHistorySchema = z.output<typeof addHistorySchema>
const addHistoryState = reactive<Partial<AddHistorySchema>>({})

const isAddHistoryModalOpen = ref(false)
watch(isAddHistoryModalOpen, (nv) => {
  if (!nv) {
    addHistoryState.phase = ""
    addHistoryState.description = ""
  }
})
function openAddHistory(id: number) {
  isAddHistoryModalOpen.value = true
  Object.assign(addHistoryState, structuredClone(data.value?.batches.find((b) => b.id === id)))
}
function onSubmitAddHistory(event: FormSubmitEvent<AddHistorySchema>) {
  $fetch("/api/batches/history", {
    method: "POST",
    body: {
      id: event.data.id,
      phase: event.data.phase,
      description: event.data.description,
    },
  })
    .then(async () => {
      toast.add({
        title: "Success",
        description: "History added successfully",
        color: "success",
      })
      isAddHistoryModalOpen.value = false
      await refreshNuxtData()
    })
    .catch(() => {
      toast.add({
        title: "Error",
        description: "An error occurred while adding history",
        color: "error",
      })
    })
}

/* delete */
const isDeleteModalOpen = ref(false)
const currentDeleteID = ref<number>()
function openDelete(id: number) {
  isDeleteModalOpen.value = true
  currentDeleteID.value = id
}
function deleteBatch() {
  $fetch("/api/batches", {
    method: "DELETE",
    body: { id: currentDeleteID.value },
  })
    .then(async () => {
      toast.add({
        title: "Success",
        description: "Batch deleted successfully",
        color: "success",
      })
      isDeleteModalOpen.value = false
      await refreshNuxtData()
    })
    .catch(() => {
      toast.add({
        title: "Error",
        description: "An error occurred while deleting the batch",
        color: "error",
      })
    })
}

/* show info */
const isShowInfoModalOpen = ref(false)
const currentShowInfoBatch = ref<IBatch>()
function openShowInfo(id: number) {
  currentShowInfoBatch.value = structuredClone(data.value?.batches.find((b) => b.id === id))
  isShowInfoModalOpen.value = true
}
</script>

<template>
  <!-- mini page header -->
  <div class="flex justify-between items-center">
    <span class="text-3xl font-bold">Wine Batches</span>
    <WineModalNewBatch />
  </div>

  <!-- content -->
  <div class="py-6 flex flex-wrap gap-4 justify-center items-center">
    <template v-for="b in data?.batches">
      <WineProductionCard
        :batch="b"
        @show-q-r-code="selectedQrcodeID = b.id.toString()"
        @edit-info="openEditInfo(b.id)"
        @add-history="openAddHistory(b.id)"
        @show-info="openShowInfo(b.id)"
        @delete="openDelete(b.id)"
      />
    </template>
  </div>

  <!-- modal edit info -->
  <UModal v-model:open="isEditInfoModalOpen" :title="'Edit Batch: ' + editInfoState.id">
    <template #body>
      <div class="flex justify-center items-center">
        <UForm
          :schema="editInfoSchema"
          :state="editInfoState"
          class="mx-auto flex flex-col gap-3 justify-center items-center"
          method="post"
          @submit.prevent="onSubmitEditInfo"
        >
          <UFormField label="Name" name="name" type="text" size="xl">
            <UInput v-model="editInfoState.name" />
          </UFormField>

          <UFormField label="Grape Type" name="grapeType" type="text" size="xl">
            <UInput v-model="editInfoState.grapeType" />
          </UFormField>

          <!-- submit -->
          <UButton label="Submit" color="primary" type="submit" size="xl" />
        </UForm>
      </div>
    </template>
  </UModal>

  <!-- modal add history -->
  <UModal v-model:open="isAddHistoryModalOpen" :title="'Add History to: ' + addHistoryState.id">
    <template #body>
      <div class="flex justify-center items-center">
        <UForm
          :schema="addHistorySchema"
          :state="addHistoryState"
          class="mx-auto flex flex-col gap-3 justify-center items-center"
          method="post"
          @submit.prevent="onSubmitAddHistory"
        >
          <UFormField label="Phase" name="phase" type="text" size="xl">
            <UInputMenu v-model="addHistoryState.phase" :items="['Harvesting', 'Destemming', 'Fermentation', 'Maturation', 'Bottling']" />
          </UFormField>

          <UFormField label="Description" name="description" type="text" size="xl">
            <UTextarea v-model="addHistoryState.description" />
          </UFormField>

          <!-- submit -->
          <UButton label="Submit" color="primary" type="submit" size="xl" />
        </UForm>
      </div>
    </template>
  </UModal>

  <!-- modal delete -->
  <UModal v-model:open="isDeleteModalOpen" title="Delete Batch">
    <template #body>
      <div class="flex justify-center items-center flex-col gap-2">
        <span>Are you sure you want to delete this batch?</span>
        <div class="flex gap-2">
          <UButton label="Delete" color="error" @click="deleteBatch" />
          <UButton
            label="Cancel"
            color="primary"
            variant="soft"
            @click="isDeleteModalOpen = false"
          />
        </div>
      </div>
    </template>
  </UModal>

  <!-- modal show info -->
  <UModal v-model:open="isShowInfoModalOpen" title="Batch Info">
    <template #body>
      <div class="flex justify-center items-center">
        <WineBatchDetails v-if="currentShowInfoBatch" :batch="currentShowInfoBatch" />
      </div>
    </template>
  </UModal>

  <!-- modal qr-code -->
  <UModal
    :open="!!selectedQrcodeID"
    :title="'QR Code id: ' + selectedQrcodeID"
    @update:open="!$event && (selectedQrcodeID = undefined)"
  >
    <template #body>
      <div class="flex justify-center items-center">
        <img :src="qrcode" alt="QR Code" class="size-full" />
      </div>
    </template>
  </UModal>
</template>
