import Shape from './shape'
import { Tools } from '../../domains/toolbar'
import sum from 'lodash-es/sum'
import { createShape } from '.'

export default class Group extends Shape {
  static defaults = {
    type: Tools.GROUP,
    shapes: [],
  }

  onCreate() {
    this.count = this.shapes.length
    this.shapes = this.shapes.map((s) => createShape(s.type, s))
  }

  area() {
    return sum(this.shapes.map((s) => s.area()))
  }

  valid() {
    return this.shapes.length > 0
  }

  bounds() {
    const childBounds = this.shapes.map((s) => s.bounds())

    const { left, top, right, bottom } = childBounds.reduce(
      (b, cb) => {
        return {
          left: Math.min(b.left, cb.left),
          right: Math.max(b.right, cb.right),
          top: Math.min(b.top, cb.top),
          bottom: Math.max(b.bottom, cb.bottom),
        }
      },
      {
        left: Infinity,
        right: -Infinity,
        top: Infinity,
        bottom: -Infinity,
      }
    )

    const dimensions = {
      width: right - left,
      height: bottom - top,
    }

    return {
      top: top,
      left: left,
      right: right,
      bottom: bottom,
      width: dimensions.width,
      height: dimensions.height,
    }
  }
}
