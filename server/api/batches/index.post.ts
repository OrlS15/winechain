import { z } from "zod"

const schema = z.object({
  name: z.string(),
  grapeType: z.string(),
})

export default defineAuthEventHandler(async (event, session) => {
  const { data } = await readValidatedBody(event, schema.safeParse)
  if (!data)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    })

  const { contract } = useAdminWineChain()

  await contract.addWineBatch(uniqueID(), data.name, data.grapeType)
})

function uniqueID() {
  return Math.floor(Math.random() * 90000000) + 10000000 // max 8 digits
}
