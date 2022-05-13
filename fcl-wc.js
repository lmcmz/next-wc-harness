import Client, {CLIENT_EVENTS} from "@walletconnect/client"
import QRCodeModal from "@walletconnect/legacy-modal"

/* const _data = {
  client: null,
}

const fclWc = {
  init: async projectId => {
    if (_data.client) {
      return _data.client
    }
    _data.client = await Client.init({
      projectId: projectId,
      relayUrl: "wss://relay.walletconnect.com",
      metadata: DEFAULT_APP_METADATA,
    })
    console.log(_data.client, "wwwrap")
    return _data.client
  },
  events: CLIENT_EVENTS,
  QRCodeModal: QRCodeModal,
} */

const fclWC = {
  Client,
  CLIENT_EVENTS,
  QRCodeModal,
}
export default fclWC
