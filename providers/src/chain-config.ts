import { chain, Chain } from "wagmi"

const ChainsConfig: Chain[] = [
  chain.polygonMumbai,
  {
    id: 1337,
    name: "Localhost development",
    network: "spree",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: "http://localhost:8545"
    },
    testnet: true
  },
  chain.polygon,
]

export default ChainsConfig
