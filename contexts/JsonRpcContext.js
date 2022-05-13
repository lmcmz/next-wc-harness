import {createContext, useContext, useState} from "react"
import {useWalletConnectClient} from "./ClientContext"

/**
 * Context
 */
export const JsonRpcContext = createContext({})

/**
 * Provider
 */
export function JsonRpcContextProvider({children}) {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState()

  const {client, session} = useWalletConnectClient()

  const ping = async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized")
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected")
    }

    try {
      setPending(true)

      let valid = false

      try {
        await client.session.ping(session.topic)
        valid = true
      } catch (e) {
        valid = false
      }

      // display result
      setResult({
        method: "ping",
        valid,
        result: valid ? "Ping succeeded" : "Ping failed",
      })
    } catch (e) {
      console.error(e)
      setResult(null)
    } finally {
      setPending(false)
    }
  }

  return (
    <JsonRpcContext.Provider
      value={{
        ping,
        rpcResult: result,
        isRpcRequestPending: pending,
      }}
    >
      {children}
    </JsonRpcContext.Provider>
  )
}

export function useJsonRpc() {
  const context = useContext(JsonRpcContext)
  if (context === undefined) {
    throw new Error("useJsonRpc must be used within a JsonRpcContextProvider")
  }
  return context
}
