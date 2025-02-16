import { ethers, JsonRpcProvider } from "ethers"
import { type WineChain } from "@/../typechain-types"

let _contract_cache: WineChain

export function useWineChain() {
  return {
    contract: _contract_cache ?? (_contract_cache = initContract()),
  }
}

function initContract() {
  const ABI = useAppConfig().ABI as string
  const {
    public: { BC_URL, BC_CONTRACT_ADDRESS },
  } = useRuntimeConfig()

  const contract = new ethers.Contract(
    BC_CONTRACT_ADDRESS,
    ABI,
    new JsonRpcProvider(BC_URL)
  ) as any as WineChain

  return contract
}
