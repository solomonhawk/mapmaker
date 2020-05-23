import React from "react"
import "./grid.css"
import { useAppState } from "../../../../services/app-state"

function Grid() {
  console.log("render grid")
  const state = useAppState()

  const { translation, gridSize, zoomScale } = state.canvas

  const translateX = translation.x // * zoomScale;
  const translateY = translation.y // * zoomScale;

  return (
    <div
      className="grid backdrop-enabled"
      style={{
        backgroundSize: 100 * zoomScale,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="smallGrid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="#afd8de"
              stroke-width="1"
            />
          </pattern>

          <pattern
            id="grid"
            width={gridSize * 2}
            height={gridSize * 2}
            x="50%"
            y="50%"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${translateX} ${translateY})`}
          >
            {zoomScale < 0.5 ? null : (
              <rect
                width={gridSize * 2}
                height={gridSize * 2}
                fill="url(#smallGrid)"
              />
            )}
            <path
              d={`M ${gridSize * 2} 0 L 0 0 0 ${gridSize * 2}`}
              fill="none"
              stroke="#afd8de"
              stroke-width="2"
            />
          </pattern>

          <pattern
            id="vCenter"
            x="50%"
            width="100%"
            height="1"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${translateX} ${translateY})`}
          >
            <path
              transform="translate(0.5 0)"
              d="M 0 0 V 1"
              fill="none"
              stroke="#85b7c9"
              stroke-width="1"
            />
          </pattern>

          <pattern
            id="hCenter"
            y="50%"
            height="100%"
            width="1"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${translateX} ${translateY})`}
          >
            <path
              transform="translate(0 0.5)"
              d="M 0 0 H 1"
              fill="none"
              stroke="#85b7c9"
              stroke-width="1"
            />
          </pattern>
        </defs>

        {/* Grid Pattern */}
        <rect width="100%" height="100%" x="0" y="0" fill="url(#grid)" />

        {/* Vertical Centerline */}
        <rect width="100%" height="100%" x="0" y="0" fill="url(#vCenter)" />

        {/* Horizontal Centerline */}
        <rect width="100%" height="100%" x="0" y="0" fill="url(#hCenter)" />
      </svg>
    </div>
  )
}

export default Grid
