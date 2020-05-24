import React, { useCallback, useState, useEffect } from 'react'
import { useAppState } from '../../../../services/app-state'

import './pan-container.css'
import { Tools } from '../../../toolbar/constants'

const initialDragState = {
  dragging: false,
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,
}

function PanContainer({ children }) {
  const state = useAppState()
  const [previousTool, setPreviousTool] = useState(false)
  const [canDrag, setCanDrag] = useState(false)
  const [dragState, setDragState] = useState(initialDragState)

  const { translation } = state.canvas
  const { translate } = state.canvas.actions

  const dragEnabled = canDrag || state.toolbar.selected === Tools.PAN

  const onKeyDown = useCallback((e) => {
    if (e.key === ' ') {
      setPreviousTool(state.toolbar.selected)
      setCanDrag(true)
      state.toolbar.actions.selectTool(Tools.PAN)
    }
  }, [])

  const onKeyUp = useCallback(
    (e) => {
      if (previousTool) {
        state.toolbar.actions.selectTool(previousTool)
        setPreviousTool(null)
        setCanDrag(false)
      }
    },
    [previousTool, state.toolbar.actions]
  )

  const onBeginDrag = useCallback(
    (e) => {
      if (dragEnabled) {
        setDragState((dragState) => ({
          ...dragState,
          dragging: true,
          startX: e.clientX,
          startY: e.clientY,
        }))
      }
    },
    [dragEnabled]
  )

  const onEndDrag = useCallback((e) => {
    setDragState(initialDragState)
  }, [])

  const onDrag = useCallback(
    (e) => {
      if (dragState.dragging) {
        const deltaX = e.clientX - dragState.startX
        const deltaY = e.clientY - dragState.startY

        translate({
          x: translation.x + deltaX,
          y: translation.y + deltaY,
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, dragState]
  )

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown)
    document.body.addEventListener('keyup', onKeyUp)

    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
      document.body.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  useEffect(() => {
    document.body.addEventListener('mousedown', onBeginDrag)

    return () => {
      document.body.removeEventListener('mousedown', onBeginDrag)
    }
  }, [onBeginDrag])

  useEffect(() => {
    document.body.addEventListener('mouseup', onEndDrag)

    return () => {
      document.body.removeEventListener('mouseup', onEndDrag)
    }
  }, [onEndDrag])

  useEffect(() => {
    document.body.addEventListener('mousemove', onDrag)

    return () => {
      document.body.removeEventListener('mousemove', onDrag)
    }
  }, [onDrag])

  return (
    <div
      className="pan-container viewport-container"
      style={{
        cursor: dragEnabled ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  )
}

export default PanContainer
