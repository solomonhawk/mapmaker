import React from 'react'

function Rect({ id, points: [start, end], scaleFactor }) {
  const s = (v) => v * scaleFactor

  const startX = Math.min(s(start.x), s(end.x))
  const startY = Math.min(s(start.y), s(end.y))
  const endX = Math.max(s(start.x), s(end.x))
  const endY = Math.max(s(start.y), s(end.y))

  return (
    <rect
      key={id}
      x={startX}
      y={startY}
      width={endX - startX}
      height={endY - startY}
      stroke-width="2"
      stroke="#333"
      fill="transparent"
    />
  )
}

export default Rect
