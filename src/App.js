import React, { useReducer, useCallback, useEffect } from 'react'
// import Menu from './domains/menu/components/menu'
import Toolbar from './domains/toolbar/components/toolbar'
import Canvas from './domains/canvas/components/canvas'
import { AppState } from './services/app-state'
import { Tools } from './domains/toolbar'
import Controls from './domains/canvas/components/controls'
import without from 'lodash-es/without'

import './App.css'

const GRID_BASE_SIZE = 50
const MAX_ZOOM = 4
const MIN_ZOOM = 0.1

const STORAGE_KEY = 'mapmaker-shapes'
const STORAGE_KEY_ZOOM = 'mapmaker-zoom'
const STORAGE_KEY_PAN = 'mapmaker-pan'

function canDraw(selectedTool) {
  return [Tools.LINE, Tools.RECT, Tools.CIRCLE].includes(selectedTool)
}

const initialZoomScale = 0.5
const initialTranslation = { x: 0, y: 0 }

const ACTIONS = {
  HYDRATE: 'HYDRATE',

  CLEAR_SHAPES: 'CLEAR_SHAPES',
  ADD_SHAPE: 'ADD_SHAPE',
  UPDATE_SHAPE: 'UPDATE_SHAPE',
  REMOVE_SHAPE: 'REMOVE_SHAPE',
  REMOVE_SELECTED_SHAPE: 'REMOVE_SELECTED_SHAPE',
  SELECT_SHAPE: 'SELECT_SHAPE',
  UNSELECT_SHAPE: 'UNSELECT_SHAPE',

  SELECT_TOOL: 'SELECT_TOOL',

  SET_ZOOM: 'SET_ZOOM',
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
  SET_PAN: 'SET_PAN',
  RESET_PAN_ZOOM: 'RESET_PAN_ZOOM',
}

const reducer = (state, action) => {
  switch (action.type) {
    // Startup

    case ACTIONS.HYDRATE:
      return {
        ...state,
        loading: false,
        zoomScale: action.payload.zoomScale || initialZoomScale,
        translation: action.payload.translation || initialTranslation,
        shapes: action.payload.shapes || [],
      }

    // Shapes

    case ACTIONS.CLEAR_SHAPES:
      return {
        ...state,
        shapes: [],
        selectedShape: null,
      }

    case ACTIONS.ADD_SHAPE:
      return {
        ...state,
        shapes: [...state.shapes, action.payload],
      }

    case ACTIONS.UPDATE_SHAPE: {
      const updatedShapes = state.shapes.slice()
      updatedShapes[action.payload.id] = action.payload

      return {
        ...state,
        shapes: updatedShapes,
        selectedShape: action.selectAfterUpdate
          ? action.payload
          : state.selectedShape,
      }
    }

    case ACTIONS.REMOVE_SHAPE: {
      return {
        ...state,
        shapes: without(state.shapes, action.payload),
      }
    }

    case ACTIONS.REMOVE_SELECTED_SHAPE: {
      if (state.selectedShape) {
        const shapes = without(state.shapes, state.selectedShape)

        return {
          ...state,
          shapes,
          selectedShape: shapes.length ? shapes[shapes.length - 1] : null,
        }
      } else {
        return state
      }
    }

    case ACTIONS.SELECT_SHAPE:
      return {
        ...state,
        selectedShape: action.payload,
      }

    // Tools

    case ACTIONS.SELECT_TOOL: {
      return {
        ...state,
        selectedTool: action.payload,
      }
    }

    // Pan + Zoom

    case ACTIONS.ZOOM_IN:
      return {
        ...state,
        zoomScale: Math.min(state.zoomScale * 2, MAX_ZOOM),
      }

    case ACTIONS.ZOOM_OUT:
      return {
        ...state,
        zoomScale: Math.max(state.zoomScale / 2, MIN_ZOOM),
      }

    case ACTIONS.SET_PAN:
      return {
        ...state,
        translation: action.payload,
      }

    case ACTIONS.RESET_PAN_ZOOM:
      return {
        ...state,
        zoomScale: initialZoomScale,
        translation: initialTranslation,
      }

    default:
      console.error('Unknown action!', action)
      return state
  }
}

const initialState = {
  loading: false,
  shapes: [],
  selectedTool: Tools.SELECT,
  selectedShape: null,
  zoomScale: initialZoomScale,
  translation: initialTranslation,
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    loading,
    shapes,
    selectedTool,
    selectedShape,
    zoomScale,
    translation,
  } = state

  const gridSize = GRID_BASE_SIZE * zoomScale

  useEffect(() => {
    try {
      const savedShapes = localStorage.getItem(STORAGE_KEY)
      const savedZoom = localStorage.getItem(STORAGE_KEY_ZOOM)
      const savedTranslation = localStorage.getItem(STORAGE_KEY_PAN)
      // setShapes(JSON.parse(savedShapes) || [])
      dispatch({
        type: ACTIONS.HYDRATE,
        payload: {
          shapes: JSON.parse(savedShapes),
          zoomScale: JSON.parse(savedZoom),
          translation: JSON.parse(savedTranslation),
        },
      })
    } catch (e) {
      console.error('Failed to load saved data!')
    }
  }, [])

  const zoomIn = useCallback(() => {
    dispatch({ type: ACTIONS.ZOOM_IN })
  }, [])

  const zoomOut = useCallback(() => {
    dispatch({ type: ACTIONS.ZOOM_OUT })
  }, [])

  const translate = useCallback(
    (translation) => {
      dispatch({
        type: ACTIONS.SET_PAN,
        payload: translation,
      })
    },
    [dispatch]
  )

  const clear = useCallback(() => dispatch({ type: ACTIONS.CLEAR_SHAPES }), [])

  const centerViewport = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_PAN_ZOOM })
  }, [dispatch])

  const addShape = useCallback(
    (shape) => {
      const newShape = { ...shape, id: shapes.length }
      dispatch({ type: ACTIONS.ADD_SHAPE, payload: newShape })
      return newShape
    },
    [shapes]
  )

  const removeShape = useCallback((shape) => {
    if (shape.id === undefined) {
      throw new Error('Cannot remove shape without an ID')
    }

    dispatch({
      type: ACTIONS.REMOVE_SHAPE,
      payload: shape,
    })
  }, [])

  const removeSelectedShape = useCallback(() => {
    dispatch({
      type: ACTIONS.REMOVE_SELECTED_SHAPE,
    })
  }, [])

  const updateShape = useCallback((shape, selectAfterUpdate = false) => {
    dispatch({
      type: ACTIONS.UPDATE_SHAPE,
      payload: shape,
      selectAfterUpdate,
    })
  }, [])

  const selectShape = useCallback((shape) => {
    dispatch({
      type: ACTIONS.SELECT_SHAPE,
      payload: shape,
    })
  }, [])

  const unselectShape = useCallback(() => {
    dispatch({
      type: ACTIONS.SELECT_SHAPE,
      payload: null,
    })
  }, [])

  const selectTool = useCallback((tool) => {
    dispatch({
      type: ACTIONS.SELECT_TOOL,
      payload: tool,
    })
  }, [])

  const appState = {
    data: {
      shapes,
      actions: {
        addShape,
        removeShape,
        updateShape,
        removeSelectedShape,
      },
    },
    toolbar: {
      selected: selectedTool,
      actions: {
        selectTool,
      },
    },
    canvas: {
      gridSize,
      zoomScale,
      zoomScalePercent: parseInt(zoomScale * 100, 10),
      translation,
      canDraw: canDraw(selectedTool),
      selectedShape,
      actions: {
        zoomIn,
        zoomOut,
        translate,
        clear,
        centerViewport,
        selectShape,
        unselectShape,
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
