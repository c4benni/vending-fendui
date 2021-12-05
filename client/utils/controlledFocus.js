import { isHTML } from './main'
export class ControlledFocus {
  constructor({
    root,
    children,
    loop = true,
    preventScroll = false,
    closest,
    uid
  }) {
    this.uid = uid

    ControlledFocus.savedRoots = {
      ...(ControlledFocus.savedRoots || {})
    }

    ControlledFocus.savedRoots.items = {
      ...(ControlledFocus.savedRoots.items || {})
    }

    ControlledFocus.timeStamp = ControlledFocus.timeStamp || Date.now()

    ControlledFocus.savedRoots.items[uid] = [
      ...(ControlledFocus.savedRoots.items[uid] || [])
    ]

    if (!ControlledFocus.savedRoots.items[uid].length) {
      this.root = root
      this.$children = this.root?.querySelectorAll?.(`${children}`)
    } else {
      this.$children = ControlledFocus.savedRoots.items[uid]
    }

    this.root = 0
    this.loop = loop
    this.preventScroll = preventScroll
    this.closest = closest || children

    this.focusableNodes =
      this.$children &&
      [...this.$children].filter((x) => {
        const validFocusable =
          isHTML(x) &&
          x.tabIndex > -1 &&
          x.getAttribute('tabindex') > -1 &&
          !x.getAttribute('disabled')

        return validFocusable
          ? this.closest
            ? x.closest(this.closest)
            : x
          : false
      })

    if (!ControlledFocus.savedRoots.items[uid]?.length) {
      ControlledFocus.savedRoots.items[uid] = this.focusableNodes
    }

    this.$children = 0

    this.index =
      this.focusableNodes?.length &&
      this.focusableNodes.indexOf(
        this.focusableNodes.find((x) =>
          x.isSameNode(x.ownerDocument.activeElement)
        )
      )
  }

  forward(count = 0) {
    if (!this.focusableNodes.length) {
      return
    }
    const getIndex =
      this.index + 1 + count > this.focusableNodes.length - 1
        ? this.loop
          ? 0
          : this.focusableNodes.length - 1
        : this.index + 1 + count

    this.focusableNodes[getIndex].focus({ preventScroll: this.preventScroll })

    this.destroy()
  }

  backward(count = 0) {
    if (!this.focusableNodes.length) {
      return
    }

    const getIndex =
      this.index - 1 - count < 0
        ? this.loop
          ? this.focusableNodes.length - 1
          : 0
        : this.index - 1 - count

    this.focusableNodes[getIndex].focus({ preventScroll: this.preventScroll })

    this.destroy()
  }

  destroy() {
    this.$children = 0
    this.root = 0
    this.focusableNodes = 0
  }

  clear() {
    ControlledFocus.savedRoots = {}
  }
}
