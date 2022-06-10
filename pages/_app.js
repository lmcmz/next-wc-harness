import {ClientContextProvider} from "../contexts/ClientContext"
import {JsonRpcContextProvider} from "../contexts/JsonRpcContext"
import "../styles/globals.css"
import "../flow/config"

function MyApp({Component, pageProps}) {
  return (
    <ClientContextProvider>
      <JsonRpcContextProvider>
        <Component {...pageProps} />
      </JsonRpcContextProvider>
    </ClientContextProvider>
  )
}

export default MyApp
