import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {DEFAULT_APP_METADATA} from "../constants"
import * as fcl from "@onflow/fcl"
import fclWC from "@onflow/fcl-wc"

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
    console.log("Session connected", _session)
  }, [])

  const connect = useCallback(
    async pairing => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }
      try {
        const session = await client.connect({
          metadata: DEFAULT_APP_METADATA,
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
        fclWC.QRCodeModal.close()
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
      reason: fclWC.ERROR.USER_DISCONNECTED.format(),
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
        console.log("SESSION EVENT", "session_updated")
        onSessionConnected(updatedSession)
      })

      _client.on(fclWC.CLIENT_EVENTS.session.deleted, () => {
        console.log("SESSION EVENT", "session_deleted")
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
      const {client} = await fcl.config.get("wc.adapter")
      console.log("Client Initialized", client)
      setClient(client)
      await _subscribeToEvents(client)
      await _checkPersistedState(client)
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
