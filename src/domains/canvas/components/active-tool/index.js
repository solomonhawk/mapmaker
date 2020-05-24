import { useState, useEffect, useCallback } from 'react'
import { useAppState } from '../../../../services/app-state'
import { usePointer } from '../pointer-container/hook'

import {
  mapPointerToGridOrigin,
  mapPointerToGrid,
  quantizedViewportCenter,
} from '../canvas/helpers'
import { Tools } from '../../../toolbar'

function ActiveTool({ viewport, container }) {
  const state = useAppState()
  const pointer = usePointer()

  const { addShape, updateShape, removeShape } = state.data.actions

  const [currentShape, setCurrentShape] = useState(null)

  const currentPoint = useCallback(() => {
    const totalOffset = quantizedViewportCenter(viewport, state.canvas)
    const position = mapPointerToGrid(pointer, totalOffset, state.canvas)
    return mapPointerToGridOrigin(position, viewport, state.canvas)
  }, [pointer, state.canvas, viewport])

  const onBeginShape = useCallback(
    (e) => {
      const shape = addShape({
        type: state.toolbar.selected,
        points: [currentPoint(), currentPoint()],
      })

      setCurrentShape(shape)
    },
    [addShape, currentPoint, state.toolbar.selected]
  )

  const onUpdateShape = useCallback(
    (e) => {
      if (currentShape) {
        const endPoint = currentPoint()

        updateShape({
          ...currentShape,
          points: [currentShape.points[0], endPoint],
        })
      }
    },
    [currentPoint, currentShape, updateShape]
  )

  const onEndShape = useCallback(
    (e) => {
      if (currentShape) {
        const endPoint = currentPoint()

        if (
          currentShape.type === Tools.LINE &&
          currentShape.points[0].x === endPoint.x &&
          currentShape.points[0].y === endPoint.y
        ) {
          removeShape(currentShape)
        } else if (
          currentShape.type === Tools.RECT &&
          (currentShape.points[0].x === endPoint.x ||
            currentShape.points[0].y === endPoint.y)
        ) {
          removeShape(currentShape)
        } else {
          updateShape({
            ...currentShape,
            points: [currentShape.points[0], endPoint],
          })
        }

        setCurrentShape(null)
      }
    },
    [currentShape, updateShape, removeShape, currentPoint]
  )

  useEffect(() => {
    container.addEventListener('mousedown', onBeginShape)
    container.addEventListener('mousemove', onUpdateShape)
    container.addEventListener('mouseup', onEndShape)

    return () => {
      container.removeEventListener('mousedown', onBeginShape)
      container.removeEventListener('mousemove', onUpdateShape)
      container.removeEventListener('mouseup', onEndShape)
    }
  }, [container, onBeginShape, onUpdateShape, onEndShape])

  return null
}

export default ActiveTool
