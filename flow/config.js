import * as fcl from "@onflow/fcl"
import getConfig from "next/config"
import fclWC from "../contexts/fcl-wc"

// Initalize fclWC Adapter
const getAdapter = async () =>
  await fclWC.init('c284f5a3346da817aeca9a4e6bc7f935')

getAdapter().then(a => console.log("adapater from config", a))

const USE_LOCAL = true
const resolver = async () => ({
  appIdentifier: "Awesome App (v0.0)",
  nonce: "3037366134636339643564623330316636626239323161663465346131393662",
})
const {publicRuntimeConfig} = getConfig()

// const FCL_CRYPTO_CONTRACT_ADDR =
//   process.env.NEXT_PUBLIC_FCL_CRYPTO_CONTRACT ||
//   publicRuntimeConfig.fclCryptoContract

fcl
  .config()
  .put("debug.accounts", true)
  .put("logger.level", 2)
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")
  .put("service.OpenID.scopes", "email")
  .put("wc.projectId", "6427e017c4bd829eef203702a51688b0")
  .put("discovery.wc.adapter", getAdapter())

const DEFAULT_APP_METADATA = {
  name: "Flow App",
  description: "Flow DApp for WalletConnect",
  url: "https://testFlow.com/",
  icons: ["https://avatars.githubusercontent.com/u/62387156?s=280&v=4"],
}

if (USE_LOCAL) {
  fcl
    .config()
    // .put("debug.accounts", true)
    .put("logger.level", 2)
    .put("flow.network", "testnet")
    .put("discovery.wallet.method", "POP/RPC")
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    // .put("accessNode.api", "http://localhost:8888")
    // .put("discovery.wallet", "http://localhost:3000/fcl/authn")
    .put("discovery.wallet", "http://localhost:3000/testnet/authn")
} else {
  fcl
    .config()
    // testnet
    .put("env", "testnet")
    .put("flow.network", "testnet")
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    .put("discovery.wallet", "http://localhost:3000/testnet/authn")
  //.put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  // mainnet
  //.put("env", "mainnet")
  //.put("flow.network", "mainnet")
  //.put("discovery.wallet", "https://fcl-discovery.onflow.org/authn")
  //.put("accessNode.api", "https://rest-mainnet.onflow.org")
}
