import React, { useCallback, useState, useEffect } from "react"
import { useAppState } from "../../../../services/app-state"

import "./pan-container.css"

const initialDragState = {
  dragging: false,
  startX: null,
  startY: null,
  deltaX: 0,
  deltaY: 0,
}

function PanContainer({ children }) {
  const state = useAppState()
  const [canDrag, setCanDrag] = useState(false)
  const [dragState, setDragState] = useState(initialDragState)

  const { translation } = state.canvas
  const { translate } = state.canvas.actions

  const onKeyDown = useCallback((e) => {
    console.log(e.key)
    if (e.key === " ") {
      setCanDrag(true)
    }
  }, [])

  const onKeyUp = useCallback((e) => {
    setCanDrag(false)
  }, [])

  useEffect(() => {
    document.body.addEventListener("keydown", onKeyDown)
    document.body.addEventListener("keyup", onKeyUp)

    return () => {
      document.body.removeEventListener("keydown", onKeyDown)
      document.body.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  const onBeginDrag = useCallback(
    (e) => {
      if (canDrag) {
        console.log("begin drag")

        setDragState((dragState) => ({
          ...dragState,
          dragging: true,
          startX: e.clientX,
          startY: e.clientY,
        }))
      }
    },
    [canDrag]
  )

  const onEndDrag = useCallback((e) => {
    console.log("end drag")
    setDragState(initialDragState)
  }, [])

  const onDrag = useCallback(
    (e) => {
      if (dragState.dragging) {
        const deltaX = e.clientX - dragState.startX
        const deltaY = e.clientY - dragState.startY
        console.log("dragging", deltaX, deltaY)

        translate({
          x: translation.x + deltaX,
          y: translation.y + deltaY,
        })
      }
    },
    [translate, dragState]
  )

  return (
    <div
      className="pan-container"
      onMouseDown={onBeginDrag}
      onMouseUp={onEndDrag}
      onMouseMove={onDrag}
      style={{
        cursor: canDrag ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  )
}

export default PanContainer
