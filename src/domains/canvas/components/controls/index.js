import React, { useCallback } from 'react'
import { useAppState } from '../../../../services/app-state'
import Selected from './selected'
import './controls.css'

function Controls() {
  // console.log('render controls')
  const state = useAppState()

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

        <li className="canvas-controls-item canvas-control-item-zoom">
          <div className="canvas-zoom">Zoom: {zoomScalePercent}%</div>
        </li>
      </ul>
    </div>
  )
}

export default Controls
