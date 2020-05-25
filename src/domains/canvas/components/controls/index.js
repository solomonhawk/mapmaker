import React, { useCallback, useMemo } from 'react'
import { useAppState } from '../../../../services/app-state'
import Selected from './selected'
import { usePointer } from '../pointer-container/hook'

import {
  mapPointerToGridOrigin,
  mapPointerToGrid,
  quantizedViewportCenter,
} from '../canvas/helpers'

import './controls.css'

function Controls({ viewport }) {
  const state = useAppState()
  const pointer = usePointer()
  const { selectedShapes, zoomScalePercent, actions } = state.canvas

  const {
    zoomIn,
    zoomOut,
    centerViewport,
    groupSelected,
    ungroupSelected,
  } = actions

  const clearCanvas = useCallback(() => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure?')) {
      actions.clear()
    }
  }, [actions])

  const getCurrentPoint = useCallback(() => {
    const totalOffset = quantizedViewportCenter(viewport, state.canvas)
    const position = mapPointerToGrid(pointer, totalOffset, state.canvas)

    return mapPointerToGridOrigin(position, viewport, state.canvas)
  }, [pointer, state.canvas, viewport])

  const currentPoint = useMemo(() => getCurrentPoint(), [getCurrentPoint])

  return (
    <div className="canvas-controls">
      <Selected
        selectedShapes={selectedShapes}
        group={groupSelected}
        ungroup={ungroupSelected}
      />

      <ul className="canvas-controls-list">
        <li className="canvas-controls-item">
          <button
            title="zoom out"
            className="canvas-control-btn"
            onClick={zoomOut}
          >
            <span className="canvas-control-btn-text">-</span>
          </button>
        </li>

        <li className="canvas-controls-item">
          <button
            title="zoom in"
            className="canvas-control-btn"
            onClick={zoomIn}
          >
            <span className="canvas-control-btn-text">+</span>
          </button>
        </li>

        <li className="canvas-controls-item">
          <button className="canvas-control-btn" onClick={centerViewport}>
            <span className="canvas-control-btn-text">⌾</span>
          </button>
        </li>

        <li className="canvas-controls-item">
          <button
            className="canvas-control-btn"
            disabled={!state.data.shapes.length}
            onClick={clearCanvas}
          >
            <span className="canvas-control-btn-text">×</span>
          </button>
        </li>

        <li className="canvas-controls-item canvas-control-item-text">
          <div className="canvas-zoom">Zoom: {zoomScalePercent}%</div>
        </li>

        <li className="canvas-controls-item canvas-control-item-position">
          <div className="current-point">
            x: {currentPoint.x}, y: {currentPoint.y}
          </div>
        </li>
      </ul>
    </div>
  )
}

export default Controls
