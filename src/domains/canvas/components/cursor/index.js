import React from 'react'
import { usePointer } from '../pointer-container/hook'
import { useAppState } from '../../../../services/app-state'
import { quantizedViewportCenter, mapPointerToGrid } from '../canvas/helpers'

import './cursor.css'

function Cursor({ viewport }) {
  // console.log('render cursor')
  const state = useAppState()
  const pointer = usePointer()

  if (!state.canvas.canDraw) {
    return null
  }

  const totalOffset = quantizedViewportCenter(viewport, state.canvas)
  const position = mapPointerToGrid(pointer, totalOffset, state.canvas)

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
