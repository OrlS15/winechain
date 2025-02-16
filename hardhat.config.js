import "@nomicfoundation/hardhat-ignition"
import "dotenv/config"
import "@typechain/hardhat"
import "@nomicfoundation/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"

const config = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: process.env.NUXT_BC_PRIVATE_KEY,
          balance: "100000000000000000000", // 100 ETH in wei
        },
      ],
    },
  },
}

export default config
