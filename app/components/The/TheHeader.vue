<script setup lang="ts">
const authClient = useAuthClient()

const { data: session } = await authClient.useSession(useFetch)

async function logout() {
  await authClient.signOut()
  window.location.reload()
}
</script>

<template>
  <header
    class="bg-wine-500 text-white w-full h-16 flex justify-between items-center shadow px-6 sticky top-0"
  >
    <!-- 1st -->
    <div class="w-full flex items-center gap-3 justify-start">
      <NuxtImg src="/images/logo.png" sizes="45px" />
      <span class="font-title text-3xl">WineChain</span>
    </div>

    <!-- 2nd -->
    <!-- <div class="w-full flex items-center justify-center">w</div> -->

    <!-- 3rd -->
    <div v-if="session" class="w-full flex justify-end">
      <UDropdownMenu
        :items="[
          {
            type: 'label',
            label: session.user.name,
            avatar: {
              src: 'https://placehold.co/800?text=ADMIN&font=raleway',
            },
          },
          /* logout */
          {
            color: 'error',
            label: 'Logout',
            icon: 'si:sign-out-alt-line',
            onSelect: logout,
          },
        ]"
        :ui="{
          content: 'w-48',
        }"
      >
        <UAvatar
          src="https://placehold.co/800?text=ADMIN&font=raleway"
          size="xl"
          class="border-2 border-wine-100"
        />
      </UDropdownMenu>
    </div>
  </header>
</template>
