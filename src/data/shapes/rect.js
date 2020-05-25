import Shape from './shape'
import { Tools } from '../../domains/toolbar'

export default class Rect extends Shape {
  static defaults = {
    type: Tools.RECT,
    points: [],
  }

  onCreate() {
    const [start, end] = this.controlPoints

    this.width = Math.abs(end.x - start.x)
    this.height = Math.abs(end.y - start.y)

    const minY = Math.min(start.y, end.y)
    const maxX = Math.max(start.x, end.x)

    this.x = maxX - this.width
    this.y = minY

    this.points = [
      {
        x: this.x,
        y: this.y,
      },
      {
        x: maxX,
        y: minY + this.height,
      },
    ]
  }

  bounds() {
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
    return this.width * this.height
  }

  valid() {
    return this.width > 0 && this.height > 0
  }
}
