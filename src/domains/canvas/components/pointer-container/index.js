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
// class PointerContainer extends React.Component {
//   state = {
//     x: 0,
//     y: 0,
//   }

//   render() {
//     const { children } = this.props

//     return (
//       <div
//         className="pointer-container viewport-container"
//         onMouseMove={this.handleMouseMove}
//       >
//         <PointerContext.Provider value={this.state}>
//           {children}
//         </PointerContext.Provider>
//       </div>
//     )
//   }

//   handleMouseMove = (e) => {
//     const { viewport } = this.props
//     this.setState({
//       x: e.clientX - viewport.left,
//       y: e.clientY - viewport.top,
//     })
//   }
// }

export default PointerContainer
