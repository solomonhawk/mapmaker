import React, { useEffect, useCallback, useState } from 'react'
import { PointerContext } from './context'

function PointerContainer({ container, viewport, children }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const onMouseMove = useCallback(
    (e) => {
      setPointer({
        x: e.clientX - viewport.left,
        y: e.clientY - viewport.top,
      })
    },
    [viewport, setPointer]
  )

  useEffect(() => {
    container.addEventListener('mousemove', onMouseMove)

    return () => container.removeEventListener('mousemove', onMouseMove)
  }, [container, onMouseMove])

  return (
    <PointerContext.Provider value={pointer}>
      {children}
    </PointerContext.Provider>
  )
}

export default PointerContainer
