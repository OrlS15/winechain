<script setup lang="ts">
import type { IBatch } from "~~/shared/types"

defineProps<{
  batch: IBatch
}>()

defineEmits<{
  editInfo: []
  addHistory: []
  showInfo: []
  showQRCode: []
  delete: []
}>()
</script>

<template>
  <div class="bg-white p-4 shadow w-[300px] rounded-md">
    <!-- title -->
    <div class="flex justify-between items-center">
      <span class="text-xl">{{ $props.batch.name }}</span>
      <UIcon name="lucide:grape" class="text-wine-500" size="25px" />
    </div>

    <!-- id -->
    <span class="text-gray-400">ID: {{ $props.batch.id }}</span>

    <!-- info -->
    <div class="my-6 space-y-1">
      <!-- date -->
      <div class="flex gap-2 items-center">
        <UIcon name="material-symbols:calendar-month-outline" size="20px" class="shrink-0" />
        <span class="">
          Started:
          {{ new Date($props.batch.createdAt * 1000).toJSON().slice(0, 10).replaceAll("-", "/") }}
        </span>
      </div>

      <!-- current phase -->
      <div class="flex gap-2 items-center">
        <UIcon name="bx:bxs-wine" size="20px" class="shrink-0" />
        <span>
          Current Phase: {{ $props.batch.history[$props.batch.history.length-1]?.phase ?? "none" }}
        </span>
      </div>

      <!-- grape type -->
      <div class="flex gap-2 items-center">
        <UIcon name="tdesign:grape" size="20px" class="shrink-0" />
        <span>
          Grape Type:
          {{ $props.batch.grapeType}}
        </span>
      </div>
    </div>

    <!-- buttons -->
    <div class="flex justify-center items-center gap-2 flex-wrap">
      <UButton size="xl" class="w-[48.5%]" @click="$emit('editInfo')">Edit Info</UButton>
      <UButton size="xl" class="w-[48.5%]" @click="$emit('showInfo')">Show Info</UButton>
      <UButton size="xl" class="w-[48.5%]" @click="$emit('addHistory')">Add History</UButton>
      <UButton size="xl" class="w-[48.5%]" @click="$emit('showQRCode')">Show QRCode</UButton>
      <UButton size="xl" class="w-full bg-red-700" @click="$emit('delete')" color="error">
        <UIcon name="bx:bxs-trash" class="mx-auto" />
      </UButton>
    </div>
  </div>
</template>
