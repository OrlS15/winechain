import { auth } from "~~/server/utils/auth"

async function main() {
  const res = await auth.api.signUpEmail({
    body: {
      email: "admin@winechain.com",
      name: "Admin",
      password: "admin123",
    },
  })
  console.log("User created:", res)
}

main()
