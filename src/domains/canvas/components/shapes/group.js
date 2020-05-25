import React from 'react'
import Shapes from '.'

function Group({ shape, selected }) {
  const { shapes } = shape
  const bounds = shape.bounds()

  return (
    <g>
      <rect
        className="shape"
        x={bounds.top}
        y={bounds.left}
        width={bounds.width}
        height={bounds.height}
        fill="none"
      />
      <Shapes
        shapes={shapes}
        selectedShapeIds={selected ? shape.shapes.map((s) => s.id) : []}
      />
    </g>
  )
}

export default Group
