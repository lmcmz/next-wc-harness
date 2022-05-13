import styled from "styled-components"
import Peer from "./Peer"

const SPairingContainer = styled.div`
  width: 100%;
  cursor: pointer;
`

const Pairing = props => {
  const {
    state: {metadata},
  } = props.pairing
  return (
    <SPairingContainer onClick={props.onClick}>
      <div>
        {typeof metadata !== "undefined" ? (
          <Peer oneLiner metadata={metadata} />
        ) : (
          <div>{`Unknown`}</div>
        )}
      </div>
    </SPairingContainer>
  )
}

export default Pairing
