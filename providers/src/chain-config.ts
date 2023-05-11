import { Chain } from 'wagmi'
import { polygon, polygonMumbai, gnosisChiado, gnosis } from 'wagmi/chains'

const ChainsConfig: Chain[] = [
  polygonMumbai,
  polygon,
  gnosisChiado,
  gnosis, 
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
      default: {
        http: ["http://localhost:8545"]
      },
      public: {
        http: ["http://localhost:8545"]
      }
    },
    testnet: true
  },
]

export default ChainsConfig
