export function quantizedViewportCenter(viewport, { translation, gridSize }) {
  return {
    x: ((viewport.width / 2) % gridSize) + (translation.x % gridSize),
    y: ((viewport.height / 2) % gridSize) + (translation.y % gridSize),
  }
}
