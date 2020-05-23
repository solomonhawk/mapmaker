import React from "react";
import { useAppState } from "../../../../services/app-state";
import "./controls.css";

function Controls() {
  console.log("render controls");
  const state = useAppState();

  const { zoomScalePercent, actions } = state.canvas;

  return (
    <div className="canvas-controls">
      <div className="canvas-zoom">{zoomScalePercent}%</div>

      <button className="canvas-control" onClick={actions.zoomOut}>
        -
      </button>

      <button className="canvas-control" onClick={actions.zoomIn}>
        +
      </button>
    </div>
  );
}

export default Controls;
