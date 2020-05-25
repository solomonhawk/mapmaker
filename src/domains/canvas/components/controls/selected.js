import React from 'react'
import { Tools } from '../../../toolbar'

function countShapes(count, shape) {
  if (shape.type === Tools.GROUP) {
    return shape.shapes.reduce(countShapes, count)
  }

  return count + 1
}

function Selected({ selectedShapes, group, ungroup }) {
  const count = selectedShapes.reduce(countShapes, 0)
  const groups = selectedShapes.filter((s) => s.type === Tools.GROUP)
  const allGrouped = groups.length === selectedShapes.length

  if (count < 2) {
    return null
  }

  return (
    <div className="selected-count">
      <span className="selected-count-icon">❏</span>
      <span className="selected-count-text">{count} shapes selected</span>

      <button className="selected-btn" onClick={group} disabled={allGrouped}>
        Group
      </button>

      <button
        className="selected-btn"
        onClick={ungroup}
        disabled={!groups.length}
      >
        Ungroup
      </button>
    </div>
  )
}

export default Selected
