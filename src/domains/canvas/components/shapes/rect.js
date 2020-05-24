import React from 'react'

function Rect({ points: [start, end], selected, onSelect, scaleFactor }) {
  const s = (v) => v * scaleFactor

  const startX = Math.min(s(start.x), s(end.x))
  const startY = Math.min(s(start.y), s(end.y))
  const endX = Math.max(s(start.x), s(end.x))
  const endY = Math.max(s(start.y), s(end.y))

  const rectProps = {
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    fill: 'none',
  }
  return (
    <>
      <rect {...rectProps} strokeWidth="2" stroke="#333" fill="none" />
      {/* Clickable region */}
      <rect
        className="shape"
        {...rectProps}
        strokeWidth="10"
        stroke="#05bdeb"
        fill="none"
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        pointerEvents="visible"
        strokeOpacity={selected ? 0.3 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  )
}

export default Rect
