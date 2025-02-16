<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "#ui/types"

const toast = useToast()
const authClient = useAuthClient()

const schema = z.object({
  email: z.string(),
  password: z.string(),
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { error } = await authClient.signIn.email({
    email: event.data.email,
    password: event.data.password,
  })
  if (error) {
    toast.add({
      color: "error",
      title: "Login failed",
      description: error.message,
    })
    return
  }
  toast.add({
    color: "success",
    title: "Login successful",
  })
  await navigateTo("/admin")
  return
}
</script>

<template>
  <UContainer class="pt-10">
    <UForm
      :schema="schema"
      :state="state"
      class="mx-auto flex flex-col gap-3 justify-center items-center"
      method="post"
      @submit.prevent="onSubmit"
    >
      <UFormField label="Email" name="email" type="email" size="xl">
        <UInput v-model="state.email" type="email" />
      </UFormField>

      <UFormField label="Password" name="password" type="password" size="xl">
        <UInput v-model="state.password" type="password" />
      </UFormField>

      <UButton label="Login" color="primary" type="submit" size="xl" />
    </UForm>
  </UContainer>
</template>
