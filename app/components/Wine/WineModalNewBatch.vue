<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "#ui/types"

const toast = useToast()

const schema = z.object({
  name: z.string(),
  grapeType: z.string(),
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})
const isOpen = ref(false)
const formRef = ref<HTMLFormElement | null>(null)

function onSubmit(event: FormSubmitEvent<Schema>) {
  $fetch("/api/batches", {
    method: "POST",
    body: {
      name: event.data.name,
      grapeType: event.data.grapeType,
    },
  })
    .then(async () => {
      toast.add({
        title: "Batch created",
        description: "The batch was created successfully",
        color: "success",
      })
      isOpen.value = false
      await refreshNuxtData()
    })
    .catch(() => {
      toast.add({
        title: "Error",
        description: "An error occurred while creating the batch",
        color: "error",
      })
    })
}
</script>

<template>
  <!-- modal -->
  <UModal
    v-model:open="isOpen"
    title="New Wine Batch"
    description="Create a new wine batch"
    :ui="{ footer: 'justify-end' }"
  >
    <UButton icon="material-symbols:add" size="lg" color="primary" variant="solid">
      New Wine Batch
    </UButton>

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="mx-auto flex flex-col gap-3 justify-center items-center"
        ref="formRef"
        @submit.prevent="onSubmit"
      >
        <UFormField label="Batch name" name="name" size="lg">
          <UInput v-model="state.name" />
        </UFormField>

        <UFormField label="Grape Type" name="grapeType" size="lg">
          <UInput v-model="state.grapeType" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="isOpen = false" />
      <UButton label="Add" color="primary" type="submit" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
