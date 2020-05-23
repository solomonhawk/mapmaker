import React from "react"
import { usePointer } from "../pointer-container/hook"
import { useAppState } from "../../../../services/app-state"

import "./cursor.css"

function Cursor() {
  // console.log("render cursor");
  const state = useAppState()
  const pointer = usePointer()

  const { translation, gridSize } = state.canvas

  const translationOffset = {
    x: translation.x % gridSize,
    y: translation.y % gridSize,
  }

  const position = {
    x: Math.round(pointer.x / gridSize) * gridSize + translationOffset.x,
    y: Math.round(pointer.y / gridSize) * gridSize + translationOffset.y,
  }

  console.log(gridSize)

  return (
    <div
      className="cursor"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    />
  )
}

export default Cursor
