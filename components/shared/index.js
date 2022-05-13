import styled from "styled-components"
import Button from "../Button"
import {fonts} from "../../styles"

export const SConnectButton = styled(Button)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  margin: 12px 0;
`

export const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`

export const STable = styled(SContainer)`
  flex-direction: column;
  text-align: left;
`

export const SRow = styled.div`
  width: 100%;
  display: flex;
  margin: 6px 0;
`

export const SKey = styled.div`
  width: 30%;
  font-weight: 700;
`

export const SValue = styled.div`
  width: 70%;
  font-family: monospace;
`

export const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`

export const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`

export const SModalParagraph = styled.p`
  margin-top: 30px;
`
