export const DEFAULT_MAIN_CHAINS = [
  // mainnets
  "flow:mainnet",
]

export const DEFAULT_TEST_CHAINS = [
  // testnets
  "flow:testnet",
]

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS]

export const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID

export const DEFAULT_RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL

export const DEFAULT_FLOW_METHODS = {
  FLOW_AUTHN: "flow_authn",
  FLOW_AUTHZ: "flow_authz",
  FLOW_USER_SIGN: "flow_user_sign",
}

export const DEFAULT_LOGGER = "debug"

export const DEFAULT_APP_METADATA = {
  name: "FCL WC Dapp",
  description: "FCL WC Dapp",
  url: "https://flow.com/",
  icons: ["https://avatars.githubusercontent.com/u/62387156?s=280&v=4"],
}
