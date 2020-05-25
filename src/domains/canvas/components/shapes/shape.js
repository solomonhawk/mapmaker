import React from 'react'
import Line from './line'
import Rect from './rect'
import Circle from './circle'
import Group from './group'
import { Tools } from '../../../toolbar'

const shapeMap = {
  [Tools.LINE]: Line,
  [Tools.RECT]: Rect,
  [Tools.CIRCLE]: Circle,
  [Tools.GROUP]: Group,
}

function Shape({ shape, ...props }) {
  if (!(shape.type in shapeMap)) {
    throw new Error(`Unkown shape! "${shape.type}"`)
  }

  const Component = shapeMap[shape.type]

  return <Component type={shape.type} shape={shape} {...props} />
}

export default Shape
