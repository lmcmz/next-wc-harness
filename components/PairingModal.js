import Button from "./Button"
import Pairing from "./Pairing"
import {STable, SModalContainer, SContainer, SModalTitle} from "./shared"

const PairingModal = props => {
  const {pairings, connect} = props
  return (
    <SModalContainer>
      <SModalTitle>{"Select available pairing or create new one"}</SModalTitle>
      <STable>
        {pairings.map(pairing => (
          <Pairing
            key={pairing.topic}
            pairing={pairing}
            onClick={() => connect({topic: pairing.topic})}
          />
        ))}
      </STable>
      <Button onClick={() => connect()}>{`New Pairing`}</Button>
    </SModalContainer>
  )
}

export default PairingModal
