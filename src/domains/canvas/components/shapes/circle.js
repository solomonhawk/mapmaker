import React from 'react'

function Line({ id, points: [start, end] }) {
  return <path key={id} d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} />
}

export default Line
