import { createAuthClient } from "better-auth/vue"

let authClient: ReturnType<typeof createAuthClient>

export function useAuthClient() {
  return (
    authClient ??
    (authClient = createAuthClient({
      baseURL: useRequestURL().origin,
    }))
  )
}
