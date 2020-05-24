import React, { useRef, useEffect, useState } from 'react'
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

  useEffect(() => {
    if (canvasRef.current && !canvasSize) {
      setCanvasSize(canvasRef.current.getBoundingClientRect())
    }
  }, [canvasRef, canvasSize])

  window.canvasRef = canvasRef.current

  return (
    <div className="canvas" ref={canvasRef}>
      {canvasSize ? (
        <PanContainer>
          <ZoomContainer>
            <PointerContainer viewport={canvasSize}>
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
