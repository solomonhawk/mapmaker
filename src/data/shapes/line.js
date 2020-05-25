import Shape from './shape'
import { Tools } from '../../domains/toolbar'

export default class Rect extends Shape {
  static defaults = {
    type: Tools.LINE,
    points: [],
  }

  onCreate() {
    this.points = this.controlPoints

    const [start, end] = this.points

    this.width = Math.abs(end.x - start.x)
    this.height = Math.abs(end.y - start.y)

    this.length = Math.max(this.width, this.height)
  }

  bounds() {
    const [start, end] = this.controlPoints

    this.width = Math.abs(end.x - start.x)
    this.height = Math.abs(end.y - start.y)

    const minY = Math.min(start.y, end.y)
    const maxX = Math.max(start.x, end.x)

    this.x = maxX - this.width
    this.y = minY

    return {
      top: this.y,
      left: this.x,
      right: this.x + this.width,
      bottom: this.y + this.height,
      width: this.width,
      height: this.height,
    }
  }

  area() {
    return 0
  }

  valid() {
    return this.length > 0
  }
}
