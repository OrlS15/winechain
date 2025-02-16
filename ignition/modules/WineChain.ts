import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("WineChainModule", (m) => {
  const owner = m.getAccount(0)

  const WineChain = m.contract("WineChain", [], { from: owner })

  return { WineChain }
})
