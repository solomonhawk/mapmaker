import React, { useRef, useEffect, useState, useCallback } from 'react'
import Grid from '../grid'
import Cursor from '../cursor'
import ActiveTool from '../active-tool'
import PointerContainer from '../pointer-container'
import ZoomContainer from '../zoom-container'
import PanContainer from '../pan-container'
import { useAppState } from '../../../../services/app-state'
import cx from 'classnames'
import Controls from '../controls'
import './canvas.css'

function lower(str) {
  if (str) {
    return str.toLowerCase()
  }

  return null
}

function Canvas() {
  const state = useAppState()
  const canvasRef = useRef()
  const [canvasSize, setCanvasSize] = useState(null)

  const { removeSelectedShapes } = state.data.actions
  const { deselectShapes } = state.canvas.actions
  const { selected: selectedTool } = state.toolbar
  const { selectedShapeIds } = state.canvas

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Backspace') {
        removeSelectedShapes()
      }
    },
    [removeSelectedShapes]
  )

  const onClick = useCallback(() => {
    if (!state.canvas.canDraw) {
      deselectShapes()
    }
  }, [state.canvas.canDraw, deselectShapes])

  const onResize = useCallback(() => {
    setCanvasSize(canvasRef.current.getBoundingClientRect())
  }, [canvasRef])

  useEffect(() => {
    if (canvasRef.current && !canvasSize) {
      setCanvasSize(canvasRef.current.getBoundingClientRect())
    }
  }, [canvasRef, canvasSize])

  // Backspace
  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown)
    return () => document.body.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  return (
    <div
      ref={canvasRef}
      tabIndex={0}
      onClick={onClick}
      className={cx('canvas', {
        [`tool-${lower(selectedTool)}`]: !!selectedTool,
        'has-selection': selectedShapeIds.length,
      })}
    >
      {canvasSize ? (
        <PanContainer>
          <ZoomContainer>
            <PointerContainer
              container={canvasRef.current}
              viewport={canvasSize}
            >
              {state.canvas.canDraw ? <Cursor viewport={canvasSize} /> : null}

              <Grid viewport={canvasSize}>
                {state.canvas.canDraw ? (
                  <ActiveTool
                    container={canvasRef.current}
                    viewport={canvasSize}
                  />
                ) : null}
              </Grid>

              <Controls viewport={canvasSize} />
            </PointerContainer>
          </ZoomContainer>
        </PanContainer>
      ) : null}
    </div>
  )
}

export default Canvas
