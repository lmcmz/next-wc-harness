import styled from "styled-components"
import {colors, fonts} from "../styles"

const SPeerOneLiner = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 2px solid rgb(${colors.darkGrey});
  padding: 5px;

  & img {
    width: 40px;
    height: 40px;
  }
  & > div {
    margin-left: 10px;
  }
`

const SPeerCard = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
  flex-direction: column;
  border-radius: 8px;
  border: 2px solid rgb(${colors.darkGrey});
  padding: 5px;
  & > div {
    margin: 4px auto;
  }
`

const SIcon = styled.img`
  width: 100px;
  margin: 0 auto;
`

const SCenter = styled.div`
  text-align: center;
`

const SUrl = styled(SCenter)`
  font-size: ${fonts.size.small};
  opacity: 0.8;
`

const SName = styled(SCenter)`
  font-weight: bold;
`

const Peer = props =>
  props.oneLiner ? (
    <SPeerOneLiner>
      <img src={props.metadata.icons[0]} alt={props.metadata.name} />
      <div>{props.metadata.name}</div>
    </SPeerOneLiner>
  ) : (
    <SPeerCard>
      <SIcon src={props.metadata.icons[0]} alt={props.metadata.name} />
      <SName>{props.metadata.name}</SName>
      <SCenter>{props.metadata.description}</SCenter>
      <SUrl>{props.metadata.url}</SUrl>
    </SPeerCard>
  )

export default Peer
