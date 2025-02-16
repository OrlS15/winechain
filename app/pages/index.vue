<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router"
import { QrcodeStream } from "vue-qrcode-reader"

const { contract } = useWineChain()
const id = useRouteQuery("id", 0, { transform: Number })

const { data: batch, error } = await useAsyncData(
  async () => {
    if (!id.value) return null
    const b = await contract.getBatchInfo(id.value)
    return {
      id: Number.parseInt(b.id.toString()),
      name: b.name,
      grapeType: b.grapeType,
      createdAt: Number.parseInt(b.createdAt.toString()),
      history: b.history.map((h) => ({
        phase: h.phase,
        description: h.description,
        timestamp: Number.parseInt(h.timestamp.toString()),
      })),
    }
  },
  {
    watch: [id],
  }
)

const qrErr = ref<string>("")
const showQRcodeScanner = ref<boolean>(false)

function onError(err: any) {
  qrErr.value = `[${err.name}]: `

  if (err.name === "NotAllowedError") {
    qrErr.value += "you need to grant camera access permission"
  } else if (err.name === "NotFoundError") {
    qrErr.value += "no camera on this device"
  } else if (err.name === "NotSupportedError") {
    qrErr.value += "secure context required (HTTPS, localhost)"
  } else if (err.name === "NotReadableError") {
    qrErr.value += "is the camera already in use?"
  } else if (err.name === "OverconstrainedError") {
    qrErr.value += "installed cameras are not suitable"
  } else if (err.name === "StreamApiNotSupportedError") {
    qrErr.value += "Stream API is not supported in this browser"
  } else if (err.name === "InsecureContextError") {
    qrErr.value +=
      "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP."
  } else {
    qrErr.value += err.message
  }
}

function onDetect(detectedCodes: any) {
  const url = new URL(detectedCodes[0].rawValue)
  const _id = url.searchParams.get("id")
  id.value = Number.parseInt(_id || "0")
  showQRcodeScanner.value = false
}
</script>

<template>
  <UAlert
    color="neutral"
    title="Wine Batch Information"
    size="xl"
    description="Scan the QR code to access comprehensive details about the wine batch. This includes the batch's name, grape type, creation date, and history. All information is sourced directly from the blockchain, ensuring its authenticity and transparency."
    icon="hugeicons:blockchain-06"
    :ui="{
      icon: 'size-11',
    }"
  />

  <!-- batch info card -->
  <template v-if="batch">
    <div class="flex justify-center items-center w-full mt-8">
      <WineBatchDetails :batch="batch" />
    </div>
  </template>

  <UModal v-model:open="showQRcodeScanner" title="Scan QR Code">
    <UButton @click="showQRcodeScanner = true" size="xl" class="block mx-auto my-10">
      Scan QR Code
    </UButton>
    <template #body>
      <pre>{{ qrErr }}</pre>
      <pre>{{ error }}</pre>
      <!-- QRCode scanner -->
      <qrcode-stream @detect="onDetect" @error="onError" class="size-full"></qrcode-stream>
    </template>
  </UModal>
</template>
