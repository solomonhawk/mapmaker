import without from 'lodash-es/without'
import { createShape } from './shapes'
import { v4 as uuid } from 'uuid'
import partition from 'lodash-es/partition'
import flatMap from 'lodash-es/flatMap'
import { Tools } from '../domains/toolbar'

export default class ShapesList {
  static generateId() {
    return uuid()
  }

  constructor(shapes = []) {
    this.setShapes(shapes)
  }

  get shapes() {
    return this._sortedShapes
  }

  setShapes(data) {
    const shapes = data.map(({ type, ...attrs }) => createShape(type, attrs))
    this._sortedShapes = this._sortShapes(shapes)
  }

  add(shape) {
    return new ShapesList(this.shapes.concat([shape]))
  }

  update(shape) {
    return new ShapesList(
      this.shapes.map((s) => (s.id === shape.id ? shape : s))
    )
  }

  remove(shape) {
    return new ShapesList(without(this.shapes, shape))
  }

  removeById(shapeId) {
    return new ShapesList(this.shapes.filter((s) => s.id !== shapeId))
  }

  removeManyById(shapeIds) {
    return new ShapesList(this.shapes.filter((s) => !shapeIds.includes(s.id)))
  }

  reset() {
    return new ShapesList()
  }

  last() {
    return this.shapes[this.shapes.length - 1]
  }

  groupShapes(selectedIds, group) {
    const remainingShapes = this.shapes.filter(
      (s) => !selectedIds.includes(s.id)
    )

    return new ShapesList(remainingShapes.concat([group]))
  }

  ungroupShapes(selectedIds) {
    const [selected, notSelected] = partition(this.shapes, (s) =>
      selectedIds.includes(s.id)
    )
    const [grouped, notGrouped] = partition(
      selected,
      (s) => s.type === Tools.GROUP
    )

    const ungroupedShapes = flatMap(grouped, (g) =>
      g.shapes.map((s) => s.update({ groupId: null }))
    )

    return new ShapesList(
      notSelected.concat(notGrouped).concat(ungroupedShapes)
    )
  }

  // private

  _sortShapes(shapes) {
    return shapes.slice().sort(byArea)
  }
}

function byArea(s1, s2) {
  const s1Area = s1.area()
  const s2Area = s2.area()

  if (s1Area > s2Area) {
    return -1
  } else if (s1Area < s2Area) {
    return 1
  } else {
    return 0
  }
}
