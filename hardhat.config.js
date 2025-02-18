import "@nomicfoundation/hardhat-ignition"
import "dotenv/config"
import "@typechain/hardhat"
import "@nomicfoundation/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"

const config = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},
  },
}

export default config
