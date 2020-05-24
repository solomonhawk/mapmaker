import React, { useState, useCallback, useEffect } from 'react'
import Menu from './domains/menu/components/menu'
import Toolbar from './domains/toolbar/components/toolbar'
import Canvas from './domains/canvas/components/canvas'
import { AppState } from './services/app-state'
import { Tools } from './domains/toolbar'
import Controls from './domains/canvas/components/controls'

import './App.css'

const GRID_BASE_SIZE = 50
const MAX_ZOOM = 4
const MIN_ZOOM = 0.05

const STORAGE_KEY = 'mapmaker-shapes'
const STORAGE_KEY_ZOOM = 'mapmaker-zoom'
const STORAGE_KEY_PAN = 'mapmaker-pan'

function canDraw(selectedTool) {
  return [Tools.LINE, Tools.RECT, Tools.CIRCLE].includes(selectedTool)
}

const initialZoomScale = 1
const initialTranslation = { x: 0, y: 0 }

function App() {
  const [loading, setLoading] = useState(true)
  const [shapes, setShapes] = useState([])
  const [selectedTool, setSelectedTool] = useState(Tools.LINE)
  const [zoomScale, setZoomScale] = useState(initialZoomScale)
  const [translation, setTranslation] = useState(initialTranslation)

  const gridSize = GRID_BASE_SIZE * zoomScale

  useEffect(() => {
    try {
      const savedShapes = localStorage.getItem(STORAGE_KEY)
      setShapes(JSON.parse(savedShapes) || [])
    } catch (e) {
      console.error('Failed to load saved data!')
    }

    try {
      const savedZoom = localStorage.getItem(STORAGE_KEY_ZOOM)
      setZoomScale(JSON.parse(savedZoom) || initialZoomScale)
    } catch (e) {
      console.error('Failed to load saved zoom!')
    }

    try {
      const savedTranslation = localStorage.getItem(STORAGE_KEY_PAN)
      setTranslation(JSON.parse(savedTranslation) || initialTranslation)
    } catch (e) {
      console.error('Failed to load saved pan!')
    }

    setLoading(false)
  }, [])

  const zoomIn = useCallback(() => {
    setZoomScale((zoomScale) => Math.min(zoomScale * 2, MAX_ZOOM))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomScale((zoomScale) => Math.max(zoomScale / 2, MIN_ZOOM))
  }, [])

  const translate = useCallback(
    (translation) => {
      setTranslation({
        x: translation.x,
        y: translation.y,
      })
    },
    [setTranslation]
  )

  const clear = useCallback(() => setShapes([]), [])

  const centerViewport = useCallback(() => {
    setZoomScale(1)
    setTranslation({
      x: 0,
      y: 0,
    })
  }, [setTranslation])

  const addShape = useCallback(
    (shape) => {
      const newShape = { ...shape, id: shapes.length }
      setShapes([...shapes, newShape])
      return newShape
    },
    [shapes]
  )

  const removeShape = useCallback(
    (shape) => {
      if (shape.id === undefined) {
        throw new Error('Cannot remove shape without an ID')
      }
      console.log('removing', shape)
      const newShapes = shapes.slice()
      newShapes.splice(shape.id, 1)
      setShapes(newShapes)
    },
    [shapes]
  )

  const updateShape = useCallback(
    (shape) => {
      const updatedShapes = shapes.slice()
      updatedShapes[shape.id] = shape
      setShapes(updatedShapes)
    },
    [shapes]
  )

  const appState = {
    data: {
      shapes,
      actions: {
        addShape,
        removeShape,
        updateShape,
      },
    },
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
      canDraw: canDraw(selectedTool),
      actions: {
        zoomIn,
        zoomOut,
        translate,
        clear,
        centerViewport,
      },
    },
  }

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shapes))
    }
  }, [loading, shapes])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY_ZOOM, JSON.stringify(zoomScale))
    }
  }, [loading, zoomScale])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY_PAN, JSON.stringify(translation))
    }
  }, [loading, translation])

  return (
    <AppState.Provider value={appState}>
      <div className="app-container">
        {/* <Menu /> */}
        <Canvas />
        <Toolbar />
        <Controls />

        <div className="app-debug">
          <pre>{JSON.stringify(appState, null, 2)}</pre>
        </div>
      </div>
    </AppState.Provider>
  )
}

export default App
