import React, { useState, useEffect, useCallback } from 'react'
import { useAppState } from '../../../../services/app-state'
import { usePointer } from '../pointer-container/hook'
import Shapes from '../shapes'
import { createShape } from '../../../../data/shapes'

import {
  mapPointerToGridOrigin,
  mapPointerToGrid,
  quantizedViewportCenter,
} from '../canvas/helpers'

const PENDING_SHAPE_ID = 'PENDING_SHAPE'

const initialModifiers = {
  shift: false,
  meta: false,
  alt: false,
}

function ActiveTool({ viewport, container }) {
  const state = useAppState()
  const pointer = usePointer()

  const { addShape, removeShape } = state.data.actions

  const [currentShape, setCurrentShape] = useState(null)
  const [modifiers, setModifiers] = useState(initialModifiers)

  const currentPoint = useCallback(() => {
    const totalOffset = quantizedViewportCenter(viewport, state.canvas)
    const position = mapPointerToGrid(pointer, totalOffset, state.canvas)

    return mapPointerToGridOrigin(position, viewport, state.canvas)
  }, [pointer, state.canvas, viewport])

  // prevent click from reaching canvas container which would otherwise
  // trigger an `deselectShapes` action at the wrong time
  const onClick = useCallback(
    (e) => {
      if (currentShape) {
        e.stopPropagation()
      }
    },
    [currentShape]
  )

  const onKeyDown = useCallback(
    (e) => {
      const key = e.key.toLowerCase()

      if (key in modifiers) {
        setModifiers({ ...modifiers, [key]: true })
      }
    },
    [modifiers, setModifiers]
  )

  const onKeyUp = useCallback(() => {
    setModifiers(initialModifiers)
  }, [])

  const onBeginShape = useCallback(
    (e) => {
      const startPoint = currentPoint()

      setCurrentShape(
        createShape(state.toolbar.selected, {
          id: PENDING_SHAPE_ID,
          controlPoints: [startPoint, startPoint],
        })
      )
    },
    [currentPoint, state.toolbar.selected]
  )

  const onUpdateShape = useCallback(
    (e) => {
      if (currentShape) {
        const endPoint = currentPoint()

        setCurrentShape(
          currentShape.update({
            controlPoints: [currentShape.controlPoints[0], endPoint],
          })
        )
      }
    },
    [currentPoint, currentShape]
  )

  const onEndShape = useCallback(
    (e) => {
      if (currentShape) {
        const endPoint = currentPoint()
        const shape = createShape(currentShape.type, {
          controlPoints: [currentShape.controlPoints[0], endPoint],
        })

        if (!shape.valid()) {
          removeShape(currentShape)
        } else {
          addShape(shape)
        }

        setCurrentShape(null)
      }
    },
    [currentShape, addShape, removeShape, currentPoint]
  )

  useEffect(() => {
    container.addEventListener('click', onClick)
    container.addEventListener('mousedown', onBeginShape)
    container.addEventListener('mousemove', onUpdateShape)
    container.addEventListener('mouseup', onEndShape)

    return () => {
      container.removeEventListener('click', onClick)
      container.removeEventListener('mousedown', onBeginShape)
      container.removeEventListener('mousemove', onUpdateShape)
      container.removeEventListener('mouseup', onEndShape)
    }
  }, [container, onClick, onBeginShape, onUpdateShape, onEndShape])

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown, true)
    document.body.addEventListener('keyup', onKeyUp, true)

    return () => {
      document.body.removeEventListener('keydown', onKeyDown, true)
      document.body.removeEventListener('keyup', onKeyUp, true)
    }
  }, [onKeyDown, onKeyUp])

  return (
    <Shapes
      shapes={currentShape ? [currentShape] : []}
      constrained={!!modifiers.shift}
    />
  )
}

export default ActiveTool
