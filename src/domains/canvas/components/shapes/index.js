import React from 'react'
import { useAppState } from '../../../../services/app-state'
import { Tools } from '../../../toolbar'
import Line from './line'
import Rect from './rect'
import Circle from './circle'

function Shapes() {
  const state = useAppState()

  const scaleFactor = state.canvas.zoomScale

  return state.data.shapes.map((shape) => {
    if (shape.type === Tools.LINE) {
      return <Line key={shape.id} scaleFactor={scaleFactor} {...shape} />
    }

    if (shape.type === Tools.RECT) {
      return <Rect key={shape.id} scaleFactor={scaleFactor} {...shape} />
    }

    if (shape.type === Tools.CIRCLE) {
      return <Circle key={shape.id} scaleFactor={scaleFactor} {...shape} />
    }

    console.error('Unknown shape', shape)
    throw new Error('Unknown shape!')
  })
}

export default Shapes
