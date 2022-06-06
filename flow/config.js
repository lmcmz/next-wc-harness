import * as fcl from "@onflow/fcl"
import getConfig from "next/config"

const USE_LOCAL = true

// prettier-ignore
fcl
  .config()
  .put("debug.accounts", true)
  .put("logger.level", 2)
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")
  .put("service.OpenID.scopes", "email")
  .put("wc.projectId", "6427e017c4bd829eef203702a51688b0")

if (USE_LOCAL) {
  // prettier-ignore
  fcl
    .config()
    .put("flow.network", "local")
    .put("accessNode.api", "http://localhost:8888")
    //.put("discovery.wallet", "http://localhost:8701/fcl/authn")
    .put("discovery.wallet", "http://localhost:3000/testnet/authn")
} else {
  // prettier-ignore
  fcl
    .config()
    // testnet
    .put("env", "testnet")
    .put("flow.network", "testnet")
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  // mainnet
  //.put("env", "mainnet")
  //.put("flow.network", "mainnet")
  //.put("discovery.wallet", "https://fcl-discovery.onflow.org/authn")
  //.put("accessNode.api", "https://rest-mainnet.onflow.org")
  // Discovery API
  //.put("discovery.authn.include", ["0x9d2e44203cb13051"])
  //.put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/api/testnet/authn")
  // Dapper Wallet
  // .put(
  // "discovery.wallet","https://staging.accounts.meetdapper.com/fcl/authn-restricted")
  // .put("discovery.wallet.method", "POP/RPC")
  // .put("discovery.wallet","https://graphql-api.staging.app.dapperlabs.com/fcl/authn")
  // .put("discovery.wallet.method", "HTTP/POST")
}
