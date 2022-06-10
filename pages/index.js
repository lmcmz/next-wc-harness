import {useState, useEffect} from "react"
import useCurrentUser from "../hooks/use-current-user"
import Header from "../components/Header"
import Modal from "../components/Modal"
import PairingModal from "../components/PairingModal"
import PingModal from "../components/PingModal"
import RequestModal from "../components/RequestModal"
import {COMMANDS} from "../cmds"
import {useJsonRpc} from "../contexts/JsonRpcContext"
import {useWalletConnectClient} from "../contexts/ClientContext"

const renderCommand = d => {
  return (
    <li key={d.LABEL}>
      <button onClick={d.CMD}>{d.LABEL}</button>
    </li>
  )
}

export default function Home() {
  const [modal, setModal] = useState("")

  const closeModal = () => setModal("")
  const openPairingModal = () => setModal("pairing")
  const openPingModal = () => setModal("ping")
  const openRequestModal = () => setModal("request")

  // Initialize the WalletConnect client.
  const {client, session, connect, disconnect, isInitializing} =
    useWalletConnectClient()

  // Use `JsonRpcContext` to provide us with relevant RPC methods and states.
  const {ping, isRpcRequestPending, rpcResult} = useJsonRpc()

  const currentUser = useCurrentUser()

  useEffect(() => {
    require("../decorate")
  }, [])

  // Close the pairing modal after a session is established.
  useEffect(() => {
    if (session && modal === "pairing") {
      closeModal()
    }
  }, [session, modal])

  const onConnect = () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized")
    }
    // Suggest existing pairings (if any).
    if (client.pairing.topics.length) {
      return openPairingModal()
    }
    // If no existing pairings are available, trigger `WalletConnectClient.connect`.
    connect()
  }

  const onPing = async () => {
    openPingModal()
    await ping()
  }

  // Renders the appropriate model for the given request that is currently in-flight.
  const renderModal = () => {
    switch (modal) {
      case "pairing":
        if (typeof client === "undefined") {
          throw new Error("WalletConnect is not initialized")
        }
        return (
          <PairingModal pairings={client.pairing.values} connect={connect} />
        )
      case "request":
        return <RequestModal pending={isRpcRequestPending} result={rpcResult} />
      case "ping":
        return <PingModal pending={isRpcRequestPending} result={rpcResult} />
      default:
        return null
    }
  }

  return (
    <div>
      <Header ping={onPing} disconnect={disconnect} session={session} />
      {isInitializing ? "Loading..." : <div>Wallet Connect Intialized!</div>}
      <ul>{COMMANDS.map(renderCommand)}</ul>
      <pre>{session && JSON.stringify({session}, null, 2)}</pre>
      <pre>{JSON.stringify({currentUser}, null, 2)}</pre>
      <Modal show={!!modal} closeModal={closeModal}>
        {renderModal()}
      </Modal>
    </div>
  )
}
