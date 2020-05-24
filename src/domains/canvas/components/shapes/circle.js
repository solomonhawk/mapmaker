import React from 'react'

function Circle({ points: [start, end], selected, onSelect, scaleFactor }) {
  const s = (v) => v * scaleFactor
  const deltaX = Math.abs(end.x - start.x)
  const deltaY = Math.abs(end.y - start.y)
  const r = s(Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
  // const r = s(Math.max(deltaX, deltaY))

  const circleProps = {
    cx: s(start.x),
    cy: s(start.y),
    fill: 'none',
    r,
  }

  return (
    <>
      <circle {...circleProps} strokeWidth="2" stroke="#333" />
      {/* Clickable region */}
      <circle
        tabIndex={0}
        {...circleProps}
        className="shape"
        strokeWidth="10"
        stroke="#05bdeb"
        strokeOpacity={selected ? 0.3 : 0}
        pointerEvents="visible"
        onFocus={() => {
          onSelect()
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      />
    </>
  )
}

export default Circle
