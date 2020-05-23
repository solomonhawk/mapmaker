import React, { useCallback } from "react"
import { useAppState } from "../../../../services/app-state"
import { useThrottleCallback } from "@react-hook/throttle"

import "./zoom-container.css"

function ZoomContainer({ children }) {
  const state = useAppState()

  const { zoomIn, zoomOut } = state.canvas.actions

  // TODO: get rid of stale synthetic event error
  const onScroll = useCallback((e) => {
    e.persist() // This doesn't do it

    if (e.deltaY < 0) {
      zoomIn()
    } else if (e.deltaY > 0) {
      zoomOut()
    }
  }, [])

  const onScrollThrottled = useThrottleCallback(onScroll, 10, true)

  return (
    <div
      className="zoom-container"
      onScroll={onScrollThrottled}
      onWheel={onScrollThrottled}
    >
      {children}
    </div>
  )
}

export default ZoomContainer
