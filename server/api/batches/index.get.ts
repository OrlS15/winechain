import { IBatch } from "~~/shared/types"

export default defineAuthEventHandler(async (event, session) => {
  const { contract } = useAdminWineChain()

  const batches: IBatch[] = (await contract.getAllBatches()).map((b) => ({
    id: Number.parseInt(b.id.toString()),
    name: b.name,
    grapeType: b.grapeType,
    createdAt: Number.parseInt(b.createdAt.toString()),
    history: b.history.map((h) => ({
      phase: h.phase,
      description: h.description,
      timestamp: Number.parseInt(h.timestamp.toString()),
    })),
  }))

  return {
    batches,
  }
})
