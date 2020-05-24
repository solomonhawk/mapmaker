import React from 'react'

function Line({ id, points: [start, end], scaleFactor }) {
  const s = (v) => v * scaleFactor

  return (
    <path
      key={id}
      d={`M ${s(start.x)} ${s(start.y)} L ${s(end.x)} ${s(end.y)}`}
      stroke-width="2"
      stroke="#333"
    />
  )
}

export default Line
