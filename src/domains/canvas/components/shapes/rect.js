import React from 'react'

function Rect({ shape, selected, onFocus, onSelect, scale }) {
  const { x, y, width, height } = shape
  // const minSide = Math.min(width, height)

  const rectProps = {
    x: scale(x),
    y: scale(y),
    width: scale(width),
    height: scale(height),
    fill: 'none',
  }

  return (
    <>
      <rect {...rectProps} strokeWidth="2" stroke="#333" fill="none" />
      {/* Clickable region */}
      <rect
        tabIndex={0}
        className="shape"
        {...rectProps}
        strokeWidth="10"
        stroke="#05bdeb"
        fill="none"
        pointerEvents="visible"
        strokeOpacity={selected ? 0.3 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
        onFocus={onFocus}
        onClick={(e) => {
          onSelect(e)
          e.stopPropagation()
        }}
      />
    </>
  )
}

export default Rect
