import styled from "styled-components"
import Loader from "./Loader"
import {SContainer, SModalTitle} from "./shared"

export const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`

const PingModal = props => {
  const {pending, result} = props
  return (
    <>
      {pending ? (
        <SModalContainer>
          <SModalTitle>{"Pending Session Ping"}</SModalTitle>
          <SContainer>
            <Loader />
          </SContainer>
        </SModalContainer>
      ) : result ? (
        <SModalContainer>
          <SModalTitle>
            {result.valid ? "Successful Session Ping" : "Failed Session Ping"}
          </SModalTitle>
        </SModalContainer>
      ) : (
        <SModalContainer>
          <SModalTitle>{"Unknown Error with Session Ping"}</SModalTitle>
        </SModalContainer>
      )}
    </>
  )
}

export default PingModal
