import React from "react";
import { PointerContext } from "./context";

import "./pointer-container.css";

class PointerContainer extends React.Component {
  state = {
    x: null,
    y: null,
  };

  render() {
    const { children } = this.props;

    return (
      <div className="pointer-container" onMouseMove={this.handleMouseMove}>
        <PointerContext.Provider value={this.state}>
          {children}
        </PointerContext.Provider>
      </div>
    );
  }

  handleMouseMove = (e) => {
    this.setState({
      x: e.clientX,
      y: e.clientY,
    });
  };
}

export default PointerContainer;
