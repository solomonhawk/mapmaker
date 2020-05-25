import React from 'react'

function Circle({ shape, selected, onFocus, onSelect, scale }) {
  const { x, y, radius } = shape

  const circleProps = {
    r: scale(radius),
    cx: scale(x),
    cy: scale(y),
    fill: 'none',
  }

  return (
    <>
      <circle {...circleProps} strokeWidth={2} stroke="#333" />

      {/* Clickable region */}
      <circle
        tabIndex={0}
        {...circleProps}
        className="shape"
        strokeWidth="10"
        stroke="#05bdeb"
        strokeOpacity={selected ? 0.3 : 0}
        pointerEvents="visible"
        onFocus={onFocus}
        onClick={(e) => {
          onSelect(e)
          e.stopPropagation()
        }}
      />
    </>
  )
}

export default Circle
