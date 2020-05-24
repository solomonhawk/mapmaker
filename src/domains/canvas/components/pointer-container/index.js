import React from 'react'
import { PointerContext } from './context'

import './pointer-container.css'

class PointerContainer extends React.Component {
  state = {
    x: 0,
    y: 0,
  }

  render() {
    const { children } = this.props

    return (
      <div
        className="pointer-container viewport-container"
        onMouseMove={this.handleMouseMove}
      >
        <PointerContext.Provider value={this.state}>
          {children}
        </PointerContext.Provider>
      </div>
    )
  }

  handleMouseMove = (e) => {
    const { viewport } = this.props
    this.setState({
      x: e.clientX - viewport.left,
      y: e.clientY - viewport.top,
    })
  }
}

export default PointerContainer
