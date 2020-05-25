import 'what-input'

import React, { useReducer, useCallback, useEffect } from 'react'
// import Menu from './domains/menu/components/menu'
import Toolbar from './domains/toolbar/components/toolbar'
import Canvas from './domains/canvas/components/canvas'
import { AppState } from './services/app-state'
import { Tools } from './domains/toolbar'
import Controls from './domains/canvas/components/controls'
import without from 'lodash-es/without'
import ShapesList from './data/shapes-list'
import { createShape } from './data/shapes'

import './App.css'

const GRID_BASE_SIZE = 50
const MAX_ZOOM = 4
const MIN_ZOOM = 0.125

const STORAGE_KEY = 'mapmaker-shapes'
const STORAGE_KEY_ZOOM = 'mapmaker-zoom'
const STORAGE_KEY_PAN = 'mapmaker-pan'

function canDraw(selectedTool) {
  return [Tools.LINE, Tools.RECT, Tools.CIRCLE].includes(selectedTool)
}

const initialSelectedShapes = []
const initialSelectedShapeIds = []
const initialZoomScale = 0.5
const initialTranslation = { x: 0, y: 0 }

const ACTIONS = {
  HYDRATE: 'HYDRATE',

  CLEAR_SHAPES: 'CLEAR_SHAPES',
  ADD_SHAPE: 'ADD_SHAPE',
  UPDATE_SHAPE: 'UPDATE_SHAPE',
  REMOVE_SHAPE: 'REMOVE_SHAPE',
  REMOVE_SELECTED_SHAPES: 'REMOVE_SELECTED_SHAPES',

  SELECT_SHAPE: 'SELECT_SHAPE',
  DESELECT_SHAPES: 'DESELECT_SHAPES',

  GROUP_SHAPES: 'GROUP_SHAPES',
  UNGROUP_SHAPES: 'UNGROUP_SHAPES',

  PROMOTE_SHAPE: 'PROMOTE_SHAPE',
  DEMOTE_SHAPE: 'DEMOTE_SHAPE',

  SELECT_TOOL: 'SELECT_TOOL',

  SET_ZOOM: 'SET_ZOOM',
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
  SET_PAN: 'SET_PAN',
  RESET_PAN_ZOOM: 'RESET_PAN_ZOOM',
}

const reducer = (state, action) => {
  console.group(action.type)
  console.log('State Before: ', { ...state })
  console.log('Action: ', action)
  console.groupEnd()

  switch (action.type) {
    // Startup

    case ACTIONS.HYDRATE:
      return {
        ...state,
        loading: false,
        zoomScale: action.payload.zoomScale || initialZoomScale,
        translation: action.payload.translation || initialTranslation,
        shapesList: new ShapesList(action.payload.shapes || []),
      }

    // Shapes

    case ACTIONS.CLEAR_SHAPES:
      return {
        ...state,
        shapesList: state.shapesList.reset(),
        selectedShapes: initialSelectedShapes,
      }

    case ACTIONS.ADD_SHAPE:
      const shape = { ...action.payload, id: ShapesList.generateId() }

      return {
        ...state,
        shapesList: state.shapesList.add(shape),
        selectedShapes: [shape],
        selectedShapeIds: [shape.id],
      }

    case ACTIONS.UPDATE_SHAPE: {
      return {
        ...state,
        shapesList: state.shapesList.update(action.payload),
        selectedShape: action.selectAfterUpdate
          ? [action.payload]
          : state.selectedShapes,
        selectedShapeIds: action.selectAfterUpdate
          ? [action.payload.id]
          : state.selectedShapeIds,
      }
    }

    case ACTIONS.REMOVE_SHAPE: {
      return {
        ...state,
        shapesList: state.shapesList.removeById(action.payload.id),
        selectedShapes: without(state.selectedShapes, action.payload),
        selectedShapeIds: without(state.selectedShapeIds, action.payload.id),
      }
    }

    case ACTIONS.PROMOTE_SHAPE: {
      return state
    }

    case ACTIONS.DEMOTE_SHAPE: {
      return state
    }

    case ACTIONS.REMOVE_SELECTED_SHAPES: {
      if (state.selectedShapes.length) {
        const shapesList = state.shapesList.removeManyById(
          state.selectedShapeIds
        )

        return {
          ...state,
          shapesList,
          selectedShapes: shapesList.shapes.length
            ? [shapesList.last().id]
            : initialSelectedShapes,
        }
      } else {
        return state
      }
    }

    case ACTIONS.SELECT_SHAPE: {
      const { shapesList, selectedShapeIds } = state

      if (!action.payload) {
        return {
          ...state,
          selectedShapes: initialSelectedShapes,
          selectedShapeIds: initialSelectedShapeIds,
        }
      }

      const { id, groupId } = action.payload
      const identifier = groupId || id

      if (action.toggle) {
        const selectedIds = action.isAlreadySelected
          ? without(selectedShapeIds, identifier)
          : [...selectedShapeIds, identifier]

        return {
          ...state,
          selectedShapes: shapesList.shapes.filter((s) =>
            selectedIds.includes(s.id)
          ),
          selectedShapeIds: selectedIds,
        }
      }

      return {
        ...state,
        selectedShapes: shapesList.shapes.filter((s) => s.id === identifier),
        selectedShapeIds: [identifier],
      }
    }

    case ACTIONS.DESELECT_SHAPES:
      return {
        ...state,
        selectedShapes: initialSelectedShapes,
        selectedShapeIds: initialSelectedShapeIds,
      }

    case ACTIONS.GROUP_SHAPES:
      return {
        ...state,
        shapesList: state.shapesList.groupShapes(
          state.selectedShapeIds,
          action.payload
        ),
        selectedShapes: [action.payload],
        selectedShapeIds: [action.payload.id],
      }

    case ACTIONS.UNGROUP_SHAPES:
      return {
        ...state,
        shapesList: state.shapesList.ungroupShapes(state.selectedShapeIds),
        selectedShapes: initialSelectedShapes,
        selectedShapeIds: initialSelectedShapeIds,
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
      debugger
      return state
  }
}

const initialState = {
  loading: false,
  shapesList: new ShapesList(),
  selectedTool: Tools.SELECT,
  selectedShapes: initialSelectedShapes,
  selectedShapeIds: initialSelectedShapeIds,
  zoomScale: initialZoomScale,
  translation: initialTranslation,
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    loading,
    shapesList,
    selectedTool,
    selectedShapes,
    selectedShapeIds,
    zoomScale,
    translation,
  } = state

  const gridSize = GRID_BASE_SIZE * zoomScale

  useEffect(() => {
    console.log('State After: ', state)
  }, [state])

  useEffect(() => {
    try {
      const savedShapes = localStorage.getItem(STORAGE_KEY)
      const savedZoom = localStorage.getItem(STORAGE_KEY_ZOOM)
      const savedTranslation = localStorage.getItem(STORAGE_KEY_PAN)

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

  const addShape = useCallback((shape) => {
    dispatch({ type: ACTIONS.ADD_SHAPE, payload: shape })
  }, [])

  const removeShape = useCallback((shape) => {
    if (shape.id === undefined) {
      throw new Error('Cannot remove shape without an ID')
    }

    dispatch({
      type: ACTIONS.REMOVE_SHAPE,
      payload: shape,
    })
  }, [])

  const removeSelectedShapes = useCallback(() => {
    dispatch({
      type: ACTIONS.REMOVE_SELECTED_SHAPES,
    })
  }, [])

  const updateShape = useCallback((shape, selectAfterUpdate = false) => {
    dispatch({
      type: ACTIONS.UPDATE_SHAPE,
      payload: shape,
      selectAfterUpdate,
    })
  }, [])

  const promoteShape = useCallback((shape) => {
    dispatch({
      type: ACTIONS.PROMOTE_SHAPE,
      payload: shape,
    })
  }, [])

  const demoteShape = useCallback((shape) => {
    dispatch({
      type: ACTIONS.DEMOTE_SHAPE,
      payload: shape,
    })
  }, [])

  const selectShape = useCallback(
    (shape, toggle = false) => {
      const isAlreadySelected = selectedShapeIds.includes(
        shape.groupId || shape.id
      )

      if (!toggle && isAlreadySelected) {
        return
      }

      dispatch({
        type: ACTIONS.SELECT_SHAPE,
        payload: shape,
        toggle,
        isAlreadySelected,
      })
    },
    [selectedShapeIds]
  )

  const deselectShapes = useCallback(() => {
    if (selectedShapeIds.length) {
      dispatch({
        type: ACTIONS.DESELECT_SHAPES,
      })
    }
  }, [selectedShapeIds])

  const groupSelected = useCallback(() => {
    const groupId = ShapesList.generateId()

    dispatch({
      type: ACTIONS.GROUP_SHAPES,
      payload: createShape(Tools.GROUP, {
        id: groupId,
        shapes: selectedShapes.map((s) => s.update({ groupId })),
      }),
    })
  }, [selectedShapes])

  const ungroupSelected = useCallback(() => {
    dispatch({
      type: ACTIONS.UNGROUP_SHAPES,
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
      shapes: shapesList.shapes,
      actions: {
        addShape,
        removeShape,
        updateShape,
        promoteShape,
        demoteShape,
        removeSelectedShapes,
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
      selectedShapes,
      selectedShapeIds,
      actions: {
        zoomIn,
        zoomOut,
        translate,
        clear,
        centerViewport,
        selectShape,
        deselectShapes,
        groupSelected,
        ungroupSelected,
      },
    },
  }

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shapesList.shapes))
    }
  }, [loading, shapesList])

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
        <div className="app-wrapper">
          <Canvas />
          <Toolbar />
          <Controls />
        </div>

        <div className="app-debug">
          <pre>{JSON.stringify(appState, null, 2)}</pre>
        </div>
      </div>
    </AppState.Provider>
  )
}

export default App
