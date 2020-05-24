import React from 'react'
import { usePointer } from '../pointer-container/hook'
import { useAppState } from '../../../../services/app-state'
import { quantizedViewportCenter } from '../canvas/helpers'

import './cursor.css'

function mapCursorToZoomScaledGrid(pointer, offset, gridSize) {
  return {
    x: Math.round((pointer.x - offset.x) / gridSize) * gridSize + offset.x,
    y: Math.round((pointer.y - offset.y) / gridSize) * gridSize + offset.y,
  }
}

function Cursor({ viewport }) {
  console.log('render cursor')
  const state = useAppState()
  const pointer = usePointer()
  const { gridSize } = state.canvas
  const totalOffset = quantizedViewportCenter(viewport, state.canvas)
  const position = mapCursorToZoomScaledGrid(pointer, totalOffset, gridSize)

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
