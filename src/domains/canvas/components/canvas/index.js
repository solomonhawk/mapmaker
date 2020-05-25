import React, { useRef, useEffect, useState, useCallback } from 'react'
import Grid from '../grid'
import Cursor from '../cursor'
import ActiveTool from '../active-tool'
import PointerContainer from '../pointer-container'
import ZoomContainer from '../zoom-container'
import PanContainer from '../pan-container'
import { useAppState } from '../../../../services/app-state'

import './canvas.css'

function Canvas() {
  const state = useAppState()
  const canvasRef = useRef()
  const [canvasSize, setCanvasSize] = useState(null)

  const { removeSelectedShapes } = state.data.actions
  const { deselectShapes } = state.canvas.actions

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
    <div className="canvas" ref={canvasRef} tabIndex={0} onClick={onClick}>
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
            </PointerContainer>
          </ZoomContainer>
        </PanContainer>
      ) : null}
    </div>
  )
}

export default Canvas
