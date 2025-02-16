import { z } from "zod"

const schema = z.object({
  id: z.number(),
  name: z.string().optional(),
  grapeType: z.string().optional(),
})

export default defineAuthEventHandler(async (event, session) => {
  const { data } = await readValidatedBody(event, schema.safeParse)
  if (!data)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    })

  const { contract } = useAdminWineChain()

  await contract.editWineBatchInfo(data.id, data.name ?? "", data.grapeType ?? "")
})
