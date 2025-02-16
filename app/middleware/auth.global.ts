export default defineNuxtRouteMiddleware(async (to) => {
  const authClient = useAuthClient()
  const { data: session } = await authClient.useSession(useFetch)

  /* ignore list */
  if (["/admin/login", "/"].includes(to.path)) return

  if (to.path.includes("/admin") && session.value === null) {
    return navigateTo("/admin/login")
  }
})
