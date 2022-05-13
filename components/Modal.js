import {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import {colors, transitions} from "../styles"

const SLightbox = styled.div`
  transition: opacity 0.1s ease-in-out;
  text-align: center;
  position: absolute;
  width: 100vw;
  height: 100%;
  margin-left: -50vw;
  top: ${({offset}) => (offset ? `-${offset}px` : 0)};
  left: 50%;
  z-index: 2;
  will-change: opacity;
  background-color: ${({opacity}) => {
    let alpha = 0.4
    if (typeof opacity === "number") {
      alpha = opacity
    }
    return `rgba(0, 0, 0, ${alpha})`
  }};
  opacity: ${({show}) => (show ? 1 : 0)};
  visibility: ${({show}) => (show ? "visible" : "hidden")};
  pointer-events: ${({show}) => (show ? "auto" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;
`

const SModalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const SCloseButton = styled.div`
  transition: ${transitions.short};
  position: absolute;
  width: ${({size}) => `${size}px`};
  height: ${({size}) => `${size}px`};
  right: ${({size}) => `${size / 1.6667}px`};
  top: ${({size}) => `${size / 1.6667}px`};
  opacity: 0.5;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  &:before,
  &:after {
    position: absolute;
    content: " ";
    height: ${({size}) => `${size}px`};
    width: 2px;
    background: ${({color}) => `rgb(${colors[color]})`};
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`

const SCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  padding: 25px;
  background-color: rgb(${colors.white});
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SModalContent = styled.div`
  position: relative;
  width: 100%;
  position: relative;
  word-wrap: break-word;
`

export default function Modal({children, show, opacity, closeModal}) {
  const [offset, setOffset] = useState(0)
  const lightboxRef = useRef(null)

  useEffect(() => {
    if (lightboxRef.current) {
      const lightboxRect = lightboxRef.current.getBoundingClientRect()
      const nextOffset = lightboxRect.top > 0 ? lightboxRect.top : 0

      if (nextOffset !== 0 && nextOffset !== offset) {
        setOffset(nextOffset)
      }
    }
  }, [offset])

  return (
    <SLightbox show={show} offset={0} opacity={opacity} ref={lightboxRef}>
      <SModalContainer>
        <SHitbox onClick={closeModal} />

        <SCard>
          <SCloseButton size={25} color={"dark"} onClick={closeModal} />
          <SModalContent>{children}</SModalContent>
        </SCard>
      </SModalContainer>
    </SLightbox>
  )
}
