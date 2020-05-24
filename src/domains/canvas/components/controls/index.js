import React, { useCallback } from 'react'
import { useAppState } from '../../../../services/app-state'
import './controls.css'

function Controls() {
  console.log('render controls')
  const state = useAppState()

  const { zoomScalePercent, actions } = state.canvas

  const clearCanvas = useCallback(() => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure?')) {
      actions.clear()
    }
  }, [actions.clear])

  return (
    <div className="canvas-controls">
      <ul className="canvas-controls-list">
        <li className="canvas-controls-item canvas-control-item-zoom">
          <div className="canvas-zoom">Zoom: {zoomScalePercent}%</div>
        </li>

        <li className="canvas-controls-item">
          <button
            title="zoom out"
            className="canvas-control-btn"
            onClick={actions.zoomOut}
          >
            <span className="canvas-control-btn-text">-</span>
          </button>
        </li>

        <li className="canvas-controls-item">
          <button
            title="zoom in"
            className="canvas-control-btn"
            onClick={actions.zoomIn}
          >
            <span className="canvas-control-btn-text">+</span>
          </button>
        </li>

        <li className="canvas-controls-item">
          <button
            className="canvas-control-btn"
            onClick={actions.centerViewport}
          >
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
      </ul>
    </div>
  )
}

export default Controls
