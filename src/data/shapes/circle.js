import Shape from './shape'
import { Tools } from '../../domains/toolbar'

export default class Circle extends Shape {
  static defaults = {
    type: Tools.CIRCLE,
    radius: 0,
    x: 0,
    y: 0,
  }

  onCreate() {
    const [start, end] = this.controlPoints

    const deltaX = Math.abs(end.x - start.x)
    const deltaY = Math.abs(end.y - start.y)

    this.x = start.x
    this.y = start.y

    this.radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
  }

  bounds() {
    const x = this.x - this.radius
    const y = this.y - this.radius
    const width = this.radius * 2
    const height = this.radius * 2

    return {
      x,
      y,
      top: y,
      left: x,
      bottom: y + height,
      right: x + width,
      width,
      height,
    }
  }

  area() {
    return Math.PI * Math.pow(this.radius, 2)
  }

  valid() {
    return this.radius > 0
  }
}
