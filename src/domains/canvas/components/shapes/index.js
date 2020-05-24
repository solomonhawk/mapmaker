import React, { useCallback } from 'react'
import { useAppState } from '../../../../services/app-state'
import { Tools } from '../../../toolbar'
import Line from './line'
import Rect from './rect'
import Circle from './circle'

const shapeMap = {
  [Tools.LINE]: Line,
  [Tools.RECT]: Rect,
  [Tools.CIRCLE]: Circle,
}

function Shapes() {
  const state = useAppState()

  const { selectShape } = state.canvas.actions
  const { zoomScale, selectedShape } = state.canvas

  const onSelectShape = useCallback(
    (shape) => () => {
      if (state.toolbar.selected === Tools.SELECT) {
        selectShape(shape)
      }
    },
    [state.toolbar.selected, selectShape]
  )

  return state.data.shapes.map((shape) => {
    if (!(shape.type in shapeMap)) {
      throw new Error(`Unkown shape! "${shape}"`)
    }

    const Component = shapeMap[shape.type]

    return (
      <Component
        key={shape.id}
        scaleFactor={zoomScale}
        onSelect={onSelectShape(shape)}
        selected={selectedShape ? shape.id === selectedShape.id : false}
        {...shape}
      />
    )
  })
}

export default Shapes
