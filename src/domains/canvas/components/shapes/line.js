import React from 'react'

function Line({ points: [start, end], selected, onSelect, scaleFactor }) {
  const s = (v) => v * scaleFactor
  const pathData = `M ${s(start.x)} ${s(start.y)} L ${s(end.x)} ${s(end.y)}`

  return (
    <>
      <path d={pathData} strokeWidth="2" stroke="#333" />
      {/* Clickable region */}
      <path
        tabIndex={0}
        className="shape"
        d={pathData}
        strokeWidth="10"
        stroke="#05bdeb"
        strokeOpacity={selected ? 0.3 : 0}
        strokeLinecap="round"
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

export default Line
