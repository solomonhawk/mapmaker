import React from 'react'

function Line({ shape, selected, onFocus, onSelect, scale }) {
  const { points } = shape
  const [start, end] = points

  // const shorterDimension = Math.min(
  //   Math.abs(end.x - start.x),
  //   Math.abs(end.y - start.y)
  // )

  const pathData = `M ${scale(start.x)} ${scale(start.y)} L ${scale(
    end.x
  )} ${scale(end.y)}`

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
        onFocus={onFocus}
        onClick={(e) => {
          onSelect(e)
          e.stopPropagation()
        }}
      />
    </>
  )
}

export default Line
