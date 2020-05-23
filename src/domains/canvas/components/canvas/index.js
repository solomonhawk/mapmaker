import React from "react";
import Grid from "../grid";
import Cursor from "../cursor";
import Controls from "../controls";
import PointerContainer from "../pointer-container";
import ZoomContainer from "../zoom-container";
import PanContainer from "../pan-container";

import "./canvas.css";

function Canvas() {
  return (
    <div className="canvas">
      <PanContainer>
        <ZoomContainer>
          <PointerContainer>
            <Cursor />
            <Controls />
            <Grid />
          </PointerContainer>
        </ZoomContainer>
      </PanContainer>
    </div>
  );
}

export default Canvas;
