export function quantizedViewportCenter(viewport, { translation, gridSize }) {
  return {
    x: ((viewport.width / 2) % gridSize) + (translation.x % gridSize),
    y: ((viewport.height / 2) % gridSize) + (translation.y % gridSize),
  }
}

export function mapPointerToGrid(pointer, offset, { gridSize }) {
  return {
    x: Math.round((pointer.x - offset.x) / gridSize) * gridSize + offset.x,
    y: Math.round((pointer.y - offset.y) / gridSize) * gridSize + offset.y,
  }
}

export function mapPointerToGridOrigin(
  position,
  viewport,
  { zoomScale, translation }
) {
  return {
    x: (position.x - translation.x - viewport.width / 2) / zoomScale,
    y: (position.y - translation.y - viewport.height / 2) / zoomScale,
  }
}
