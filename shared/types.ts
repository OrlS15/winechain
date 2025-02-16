export interface IBatch {
  id: number
  name: string
  grapeType: string
  createdAt: number
  history: IBatchHistory[]
}

export interface IBatchHistory {
  phase: string
  description: string
  timestamp: number
}
