export default class Shape {
  static defaults = {}

  constructor(attrs = {}) {
    Object.assign(this, this.constructor.defaults, attrs)
    this.onCreate()
  }

  onCreate() {}

  update(attrs) {
    return new this.constructor({ ...this, ...attrs })
  }

  bounds() {}

  area() {}

  valid() {}
}
