<script setup lang="ts">
import type { IBatch } from "~~/shared/types"

defineProps<{
  batch: IBatch
}>()
</script>

<template>
  <div class="flex items-center flex-col sm:flex-row sm:gap-8">
    <div class="flex flex-col">
      <!-- header -->
      <div class="flex flex-col">
        <span class="text-3xl">{{ $props.batch.name }}</span>
        <span class="text-lg text-gray-500">ID: {{ $props.batch.id }}</span>
      </div>

      <!-- info -->
      <div class="my-4 space-y-1">
        <!-- date -->
        <div class="flex gap-2 items-center text-lg">
          <UIcon name="material-symbols:calendar-month-outline" size="20px" class="shrink-0" />
          <span class="">
            Started:
            {{ new Date($props.batch.createdAt * 1000).toJSON().slice(0, 10).replaceAll("-", "/") }}
          </span>
        </div>

        <!-- current phase -->
        <div class="flex gap-2 items-center text-lg">
          <UIcon name="bx:bxs-wine" size="20px" class="shrink-0" />
          <span>
            Current Phase:
            {{ $props.batch.history[$props.batch.history.length - 1]?.phase ?? "none" }}
          </span>
        </div>

        <!-- grape type -->
        <div class="flex gap-2 items-center text-lg">
          <UIcon name="tdesign:grape" size="20px" class="shrink-0" />
          <span>
            Grape Type:
            {{ $props.batch.grapeType }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <!-- history -->
      <!-- <span class="text-2xl my-3">Phases:</span> -->
      <div class="flex flex-col gap-2">
        <div
          v-for="h in $props.batch.history"
          class="border-l-3 ml-2 pl-2 flex flex-col gap-1 text-lg"
        >
          <span class="text-xl">{{ h.phase }}</span>
          <span class="text-gray-500">
            Date: {{ new Date(h.timestamp * 1000).toJSON().slice(0, 10).replaceAll("-", "/") }}
          </span>
          <span class="">{{ h.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
