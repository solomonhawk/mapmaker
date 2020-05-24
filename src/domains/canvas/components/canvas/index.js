import React, { useRef, useEffect, useState } from "react"
import Grid from "../grid"
import Cursor from "../cursor"
import Controls from "../controls"
import PointerContainer from "../pointer-container"
import ZoomContainer from "../zoom-container"
import PanContainer from "../pan-container"

import "./canvas.css"

function Canvas() {
  const canvasRef = useRef()
  const [canvasSize, setCanvasSize] = useState(null)

  useEffect(() => {
    if (canvasRef.current && !canvasSize) {
      setCanvasSize(canvasRef.current.getBoundingClientRect())
    }
  }, [canvasRef, canvasSize])

  return (
    <div className="canvas" ref={canvasRef}>
      {canvasSize ? (
        <PanContainer>
          <ZoomContainer>
            <PointerContainer viewport={canvasSize}>
              <Cursor viewport={canvasSize} />
            </PointerContainer>

            <Controls />
            <Grid />
          </ZoomContainer>
        </PanContainer>
      ) : null}
    </div>
  )
}

export default Canvas
