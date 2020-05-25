import { Tools } from '../../domains/toolbar'
import Line from './line'
import Rect from './rect'
import Circle from './circle'
import Group from './group'

const shapeMap = {
  [Tools.LINE]: Line,
  [Tools.RECT]: Rect,
  [Tools.CIRCLE]: Circle,
  [Tools.GROUP]: Group,
}

export function createShape(type, attrs) {
  if (!(type in shapeMap)) {
    throw new Error(`Unknown shape! ${type}`)
  }

  return new shapeMap[type](attrs)
}
