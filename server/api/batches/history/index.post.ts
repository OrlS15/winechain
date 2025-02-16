import { z } from "zod"

const schema = z.object({
  id: z.number(),
  phase: z.string().optional(),
  description: z.string().optional(),
})

export default defineAuthEventHandler(async (event, session) => {
  const { data } = await readValidatedBody(event, schema.safeParse)
  if (!data)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    })

  const { contract } = useAdminWineChain()

  await contract.addWineBatchHistory(data.id, data.phase ?? "", data.description ?? "")
})
