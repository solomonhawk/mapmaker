import React, { useState, useCallback } from "react"
import Menu from "./domains/menu/components/menu"
import Toolbar from "./domains/toolbar/components/toolbar"
import Canvas from "./domains/canvas/components/canvas"
import { AppState } from "./services/app-state"
import { Tools } from "./domains/toolbar"

import "./App.css"

const GRID_BASE_SIZE = 50
const MAX_ZOOM = 4
const MIN_ZOOM = 0.05

function App() {
  const [selectedTool, setSelectedTool] = useState(Tools.LINE)
  const [zoomScale, setZoomScale] = useState(1)
  const [translation, setTranslation] = useState({ x: 0, y: 0 })

  const gridSize = GRID_BASE_SIZE * zoomScale

  const zoomIn = useCallback(() => {
    setZoomScale((zoomScale) => Math.min(zoomScale * 2, MAX_ZOOM))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomScale((zoomScale) => Math.max(zoomScale / 2, MIN_ZOOM))
  }, [])

  const translate = useCallback(
    (delta) => {
      console.log(delta)
      setTranslation((translation) => ({
        x: delta.x,
        y: delta.y,
      }))
    },
    [setTranslation]
  )

  const appState = {
    toolbar: {
      selected: selectedTool,
      actions: {
        selectTool: setSelectedTool,
      },
    },
    canvas: {
      gridSize,
      zoomScale,
      zoomScalePercent: parseInt(zoomScale * 100, 10),
      translation,
      actions: {
        zoomIn,
        zoomOut,
        translate,
      },
    },
  }

  return (
    <AppState.Provider value={appState}>
      <div className="app-container">
        <Menu />
        <Toolbar />
        <Canvas />

        <div className="app-debug">
          <pre>{JSON.stringify(appState, null, 2)}</pre>
        </div>
      </div>
    </AppState.Provider>
  )
}

export default App
