import React, { useCallback } from 'react'
import { useAppState } from '../../../../services/app-state'
import { Tools } from '../../../toolbar'
import Shape from './shape'

function isKeyboardFocus() {
  return document.documentElement.dataset.whatintent !== 'keyboard'
}

function Shapes({ shapes, selectedShapeIds = [], constrained }) {
  const state = useAppState()

  const { selectShape } = state.canvas.actions
  const { zoomScale } = state.canvas

  const onSelectShape = useCallback(
    (e, shape, isFocus) => {
      if (state.toolbar.selected === Tools.SELECT) {
        if (isFocus && isKeyboardFocus()) {
          return
        }

        selectShape(shape, !!e.shiftKey)
      }
    },
    [state.toolbar.selected, selectShape]
  )

  return shapes.map((shape) => {
    return (
      <Shape
        key={shape.id}
        shape={shape}
        scale={(v) => v * zoomScale}
        onSelect={(e) => onSelectShape(e, shape, false)}
        onFocus={(e) => onSelectShape(e, shape, true)}
        constrained={constrained}
        selected={
          selectedShapeIds.length ? selectedShapeIds.includes(shape.id) : false
        }
      />
    )
  })
}

export default Shapes
