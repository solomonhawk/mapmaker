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

  const { removeSelectedShape } = state.data.actions
  const { unselectShape } = state.canvas.actions

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Backspace') {
        removeSelectedShape()
      }
    },
    [removeSelectedShape]
  )

  const onResize = useCallback(() => {
    setCanvasSize(canvasRef.current.getBoundingClientRect())
  }, [canvasRef])

  useEffect(() => {
    if (canvasRef.current && !canvasSize) {
      setCanvasSize(canvasRef.current.getBoundingClientRect())
    }
  }, [canvasRef, canvasSize])

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown)
    return () => document.body.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  return (
    <div className="canvas" ref={canvasRef} onClick={unselectShape}>
      {canvasSize ? (
        <PanContainer>
          <ZoomContainer>
            <PointerContainer
              container={canvasRef.current}
              viewport={canvasSize}
            >
              <Cursor viewport={canvasSize} />

              {state.canvas.canDraw ? (
                <ActiveTool
                  container={canvasRef.current}
                  viewport={canvasSize}
                />
              ) : null}
            </PointerContainer>

            <Grid viewport={canvasSize} />
          </ZoomContainer>
        </PanContainer>
      ) : null}
    </div>
  )
}

export default Canvas
