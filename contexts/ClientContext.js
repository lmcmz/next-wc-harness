import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  DEFAULT_APP_METADATA,
  DEFAULT_FLOW_METHODS,
  DEFAULT_LOGGER,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
} from "../constants"
import {ERROR, getAppMetadata} from "@walletconnect/utils"
import fclWC from "fcl-wc"

/**
 * Context
 */
export const ClientContext = createContext({})

/**
 * Provider
 */
export function ClientContextProvider({children}) {
  const [client, setClient] = useState()
  const [pairings, setPairings] = useState([])
  const [session, setSession] = useState()

  const [isFetchingBalances, setIsFetchingBalances] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  const [balances, setBalances] = useState({})
  const [accounts, setAccounts] = useState([])

  const reset = () => {
    setPairings([])
    setSession(undefined)
    setBalances({})
    setAccounts([])
  }

  const onSessionConnected = useCallback(async _session => {
    setSession(_session)
    setAccounts(_session.state.accounts)
  }, [])

  const connect = useCallback(
    async pairing => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }
      console.log("connect", pairing, DEFAULT_APP_METADATA)
      try {
        const session = await client.connect({
          // metadata: getAppMetadata() || DEFAULT_APP_METADATA,
          metadata: {
            name: "Flow App",
            description: "Flow DApp for WalletConnect",
            url: "https://testFlow.com/",
            icons: [
              "https://avatars.githubusercontent.com/u/62387156?s=280&v=4",
            ],
          },
          pairing,
          permissions: {
            blockchain: {
              chains: ["flow:testnet"],
            },
            jsonrpc: {
              methods: ["flow_signMessage", "flow_authz", "flow_authn"],
            },
          },
        })

        onSessionConnected(session)
      } catch (e) {
        console.error(e)
      }

      fclWC.QRCodeModal.close()
    },
    [client, onSessionConnected]
  )

  const disconnect = useCallback(async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized")
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected")
    }
    await client.disconnect({
      topic: session.topic,
      reason: ERROR.USER_DISCONNECTED.format(),
    })
  }, [client, session])

  const _subscribeToEvents = useCallback(
    async _client => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }

      _client.on(fclWC.CLIENT_EVENTS.pairing.proposal, async proposal => {
        const {uri} = proposal.signal.params
        console.log("EVENT", "QR Code Modal open")
        fclWC.QRCodeModal.open(uri, () => {
          console.log("EVENT", "QR Code Modal closed")
        })
      })

      _client.on(fclWC.CLIENT_EVENTS.pairing.created, async () => {
        setPairings(_client.pairing.topics)
      })

      _client.on(fclWC.CLIENT_EVENTS.session.updated, updatedSession => {
        console.log("EVENT", "session_updated")
        onSessionConnected(updatedSession)
      })

      _client.on(fclWC.CLIENT_EVENTS.session.deleted, () => {
        console.log("EVENT", "session_deleted")
        reset()
      })
    },
    [onSessionConnected]
  )

  const _checkPersistedState = useCallback(
    async _client => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }
      // populates existing pairings to state
      setPairings(_client.pairing.topics)
      if (typeof session !== "undefined") return
      // populates existing session to state (assume only the top one)
      if (_client.session.topics.length) {
        const _session = await _client.session.get(_client.session.topics[0])
        onSessionConnected(_session)
      }
    },
    [session, onSessionConnected]
  )

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true)

      const _client = await fclWC.Client.init({
        logger: DEFAULT_LOGGER,
        relayUrl: DEFAULT_RELAY_URL,
        projectId: DEFAULT_PROJECT_ID,
      })
      console.log("Client Initialized", _client)
      setClient(_client)
      await _subscribeToEvents(_client)
      await _checkPersistedState(_client)
    } catch (err) {
      throw err
    } finally {
      setIsInitializing(false)
    }
  }, [_checkPersistedState, _subscribeToEvents])

  useEffect(() => {
    if (!client) {
      createClient()
    }
  }, [client, createClient])

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,
      accounts,
      client,
      session,
      connect,
      disconnect,
    }),
    [pairings, isInitializing, accounts, client, session, connect, disconnect]
  )

  return (
    <ClientContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useWalletConnectClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error(
      "useWalletConnectClient must be used within a ClientContextProvider"
    )
  }
  return context
}
