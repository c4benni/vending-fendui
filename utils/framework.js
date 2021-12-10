class Theme {
  constructor() {
    this.current = '...'
  }

  get is() {
    return this.current
  }

  set is(val) {
    this.current = val
  }

  get light() {
    return /light/i.test(this.current)
  }

  get dark() {
    return /dark/i.test(this.current)
  }

  set light(val) {
    if (val) {
      this.current = 'light'
    } else this.current = 'dark'
  }

  set dark(val) {
    if (val) {
      this.current = 'dark'
    } else this.current = 'light'
  }
}

export class C4UiLib {
  constructor(observable) {
    this.theme = observable(new Theme())
    this.componentZIndex = []
    this.overlays = []
    this.htmlOverlayClassAdded = false
    this.loadedImages = []
    this.currencies = {
      naira: '₦'
    }
    this.mounted = false
    this.loadEventFired = false
  }
}
