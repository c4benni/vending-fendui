/* eslint-disable promise/param-names */
/* eslint-disable camelcase */
/* eslint-disable valid-typeof */
/* eslint-disable no-new-func */

export const distinctArray = (val, arr, reverse) =>
  reverse
    ? [...new Set([...[val].flat(2), ...arr])]
    : [...new Set([...arr, ...[val].flat(2)])]

export function shopSectionComputed(name) {
  return {
    state() {
      return this.$store.state.shopSections[name]
    },
    supabase() {
      return this.$store.getters.supabase
    }
  }
}

export const closestDialog = (e) =>
  e?.currentTarget?.closest?.('.ui-dialog')?._uiAction || {}

export function breakpointsClasses() {
  const breakpoints = this.$store.state.breakpoints
  if (!breakpoints?.is) {
    return ''
  }

  const classList = [
    `br-${breakpoints.is}`,
    `or-${breakpoints.orientationAlias}`
  ]

  if (/xxs|xs/.test(breakpoints.is)) {
    classList.push('xs-down')
  }

  if (/xs|sm|md|lg|xl/.test(breakpoints.is)) {
    classList.push('xs-up')
  }

  if (/sm|xs|xxs/.test(breakpoints.is)) {
    classList.push(...['sm-down', 'mini-device'])
  }

  if (/sm|md|lg|xl/.test(breakpoints.is)) {
    classList.push('sm-up')
  }

  if (/md|sm|xs|xxs/.test(breakpoints.is)) {
    classList.push('md-down')
  }

  if (/md|lg|xl/.test(breakpoints.is)) {
    classList.push(...['md-up', 'large-device'])
  }

  if (/lg|md|sm|xs|xxs/.test(breakpoints.is)) {
    classList.push('md-down')
  }

  if (/lg|xl/.test(breakpoints.is)) {
    classList.push(...['lg-up'])
  }

  return classList.join(' ')
}

export const functionalEmit = ({ event, payload, c }) =>
  c?.data?.on?.[event]?.(payload)

export const promiser = (val = true) => {
  return new Promise((r) => r(val))
}

export const mediaListener = ({ media, callback }) => {
  try {
    media.addEventListener('change', callback)
  } catch (e) {
    if (/undefined is not a function/i.test(e.message)) {
      media?.addListener?.(callback)
    }
  }
}

export function setTouchDevice() {
  this.$commit('UPDATE', {
    path: 'supportsBackdrop',
    value: isIOS() || CSS.supports('backdrop-filter', 'blur(0px)')
  })

  const touchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0

  this.$commit('UPDATE', {
    path: 'isTouchDevice',
    value: touchDevice
  })

  if (!setTouchDevice.mediaSet) {
    const strictTouch = (value) =>
      this.$commit('UPDATE', {
        path: 'isStrictTouchDevice',
        value
      })

    const media = window.matchMedia('(pointer: coarse)')

    strictTouch(media.matches)

    setTouchDevice.mediaSet = true

    mediaListener({
      media,
      callback: (e) => {
        strictTouch(e.matches)
      }
    })
  }
}

export function Copy({ text, onSuccess = () => {}, onError = () => {} }) {
  return new Promise((r) => {
    const oldBrowser = () => {
      try {
        let psuedoInput = document.createElement('input')
        psuedoInput.classList.add('sr-only')
        psuedoInput.setAttribute('tabindex', '-1')
        psuedoInput.setAttribute('aria-hidden', 'true')
        psuedoInput.value = text
        document.body.appendChild(psuedoInput)
        psuedoInput.select()

        document.execCommand('copy')
        document.body.removeChild(psuedoInput)
        onSuccess()
        psuedoInput = 0
      } catch (e) {
        if (e) {
          onError()
        }
      } finally {
        r()
      }
    }

    if ('clipboard' in navigator) {
      try {
        navigator.clipboard.writeText(text)
        onSuccess()
        r()
      } catch (e) {
        if (e) {
          oldBrowser()
        }
      }
    } else oldBrowser()
  })
}

export function getType(x) {
  const $type = typeof x
  const isArray = (val) => Array.isArray(val)

  if (isArray(x)) {
    return 'array'
  }
  if ($type == 'object' && !isArray(x)) {
    return 'object'
  }
  return $type
}

export const isHTML = (x) => x instanceof HTMLElement

export function kebabCase(val) {
  if (typeof val === 'string') {
    return val
      .replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`)
      .replace(/-+/g, '-')
      .replace(/^-*/, '')
  }
  return val
}

function animationFrame(action) {
  if (!process.client) {
    return function () {}
  }
  const aF = 'AnimationFrame'

  if (action == 'request') {
    return (
      window[`${action}${aF}`] ||
      window[`webkitRequest${aF}`] ||
      window[`mozRequest${aF}`] ||
      window[`msRequest${aF}`]
    )
  }
  return (
    window[`${action}${aF}`] ||
    window[`webkitCancel${aF}`] ||
    window[`mozCancel${aF}`] ||
    window[`msCancel${aF}`]
  )
}

export class Debounce {
  constructor({ callback = () => {}, delay = 0, before = () => {} }) {
    this.callback = callback
    this.delay = delay
    this.timeout = null
    this.before = before
    this.running = false
  }

  get Delay() {
    if (typeof this.delay === 'function') {
      return this.delay()
    }
    return this.delay
  }

  init() {
    this.running = true
    this.before()
    this.timeout && window.clearTimeout(this.timeout)
    this.timeout = window.setTimeout(() => {
      this.running = false
      this.callback()
      window.clearTimeout(this.timeout)
      this.kill()
    }, this.Delay)
  }

  kill() {
    this.timeout = null
  }
}

export const rAF = animationFrame('request')
export const cAF = animationFrame('cancel')

export const nextFrame = () => {
  return new Promise((r) =>
    timeout({
      callback: r,
      delay: 16
    })
  )
}

export const nextAnimFrame = (callback) => {
  return new Promise((r) =>
    requestAnimationFrame(() => {
      r()
      callback?.()
    })
  )
}

export function timeout({
  callback = () => {},
  delay = 0,
  cancel = () => false,
  timeStamp,
  data = () => ({})
}) {
  // const $ = this?.$nextTick ? this : app;

  if (!timeout.worker) {
    timeout.worker = new Worker('workers/tw.js')
  }

  const worker = timeout.worker

  // let manualWorker = false

  const $data = data()

  const ts = timeStamp || performance.now()

  const evtCallback = (e) => {
    if (e.data.name == 'timeout') {
      if (e.data.timeStamp == ts) {
        // await nextFrame();
        !cancel($data) && callback($data)

        worker.removeEventListener('message', evtCallback, { passive: true })

        // if (manualWorker) {
        //   worker.terminate()
        // }
      }
    }
  }

  worker.addEventListener('message', evtCallback, {
    passive: true
  })

  worker.postMessage({
    name: 'timeout',
    timeStamp: ts,
    data: $data,
    delay
  })
}

export function sleep(d, idle, cb) {
  if (!process.client) {
    return new Promise((r) => r())
  }

  const D = convertSeconds(d)

  const idleCallback = (fn) =>
    (window.requestIdleCallback || window.setTimeout)(fn)
  const cancel_idleCallback = (id) =>
    (window.cancelIdleCallback || window.clearTimeout)(id)
  return new Promise((r) => {
    if (typeof D === 'number') {
      // this.$nextTick(() => {
      timeout.call(this, {
        callback: () => {
          if (!idle) {
            r()
            return cb?.() || true
          }
          const t = idleCallback(() => {
            r()
            cb?.()
            requestAnimationFrame(() => cancel_idleCallback(t))
          })
        },
        delay: D
      })
      // });
    }
    // this.$nextTick(() =>
    else
      requestAnimationFrame(() => {
        if (!idle) {
          r()
          return cb?.() || true
        }

        const t = idleCallback(() => {
          r()
          cb?.()
          requestAnimationFrame(() => cancel_idleCallback(t))
        })
      })
    // );
  })
}

export function zIndex() {
  this.$c4.componentZIndex.push(this)
  this.$c4.componentZIndex = [...new Set(this.$c4.componentZIndex)]

  const lengthTimes100 = 100 * this.$c4.componentZIndex.length

  return 10000 + this.$c4.componentZIndex.length + lengthTimes100
}

export function parser({ input, type, bind = null }) {
  const $ = new Function(
    `try{return ${input}}catch(e){if(e)throw new Error('invalid input')}`
  )
  const hasType = type && typeof type === 'string' && type.length
  const output = $.call(bind)
  const returnValue = !hasType
    ? output
    : type == 'array'
    ? Array.isArray(output)
      ? output
      : undefined
    : type == 'object'
    ? !Array.isArray(output) && typeof output === 'object'
      ? output
      : undefined
    : typeof output === type
    ? output
    : undefined
  return returnValue
}

export function getObjectPath({ obj, path }) {
  if (!path) {
    path = ''
  }
  let hit_undefined = false
  let output = obj
  const arr = path.split('.').filter((x) => x.length)

  arr.forEach((x) => {
    if (!hit_undefined) {
      const $path = x.trim().replace(/(\(.*\))$/, '')
      const args = parser({
        input: x.match(/(\(.*\))/g)?.[0]
      })

      if (output && typeof output[$path] !== 'undefined') {
        output = /(\(.*\))$/.test(x) ? output[$path](args) : output[$path]
      } else {
        hit_undefined = true
      }
    }
  })
  return output
}

export function convertSeconds(val, fallback) {
  if (isNaN(parseFloat(val)) || val === Infinity) {
    return fallback || 0
  }
  if (typeof val === 'number') {
    return Math.abs(val)
  }
  if (typeof val === 'string') {
    const seconds = /\d\s*s\s*$/.test(val)
    if (seconds) {
      return Math.abs(parseFloat(val) * 1000)
    }
    return Math.abs(parseFloat(val))
  }
}

export function camelCase(val) {
  if (typeof val === 'string') {
    return val.replace(/-./g, (x) => x.toUpperCase()[1])
  }
  return val
}

export function formatString(str) {
  return capitalize(
    `${str}`.replace(/\.|\?|!\s+\w/gi, (x) => `${x}`.toUpperCase())
  )
}

export function capitalize(val) {
  if (typeof val === 'string') {
    return val.replace(/^\s*\w{1,1}/g, (x) => x.toUpperCase())
  }
  return val
}

export function capitalizeAll(val) {
  if (typeof val === 'string') {
    return capitalize(val).replace(/\s+\w{1,1}/g, (x) => x.toUpperCase())
  }
  return val
}

export function eventKey(e) {
  let key = ''
  const spaceBar = /^space$/i.test(e.code) || e.keyCode === 32
  const enterKey = /^enter$/i.test(e.code) || e.keyCode === 13
  const esc = /^escape$/i.test(e.code) || e.keyCode === 27
  const tab = /^tab$/i.test(e.code) || e.keyCode === 9
  const arrowUp = /^arrowup$/i.test(e.code) || e.keyCode === 38
  const arrowRight = /^arrowright$/i.test(e.code) || e.keyCode === 39
  const arrowDown = /^arrowdown$/i.test(e.code) || e.keyCode === 40
  const arrowLeft = /^arrowleft$/i.test(e.code) || e.keyCode === 37
  const slash = /^slash/i.test(e.code) || e.key == '/' || e.keyCode == 191
  const backspace =
    /^backspace/i.test(e.code) || e.keyCode == 8 || /^backspace/i.test(e.key)
  const Delete =
    /^delete/i.test(e.code) || e.keyCode == 46 || /^delete/i.test(e.key)

  if (backspace) {
    key = 'backkey'
    return key
  }

  if (Delete) {
    key = 'delete'
    return key
  }

  if (arrowUp) {
    key = 'arrow_up'
    return key
  }
  if (arrowLeft) {
    key = 'arrow_left'
    return key
  }
  if (arrowDown) {
    key = 'arrow_down'
    return key
  }
  if (arrowRight) {
    key = 'arrow_right'
    return key
  }
  if (spaceBar) {
    key = 'spacebar'
    return key
  }
  if (enterKey) {
    key = 'enter'
    return key
  }
  if (esc) {
    key = 'esc'
    return key
  }
  if (tab) {
    key = 'tab'
    return key
  }
  if (slash) {
    key = 'slash'
    return key
  }
  return key
}

export function hackTabKey(e, cb = () => {}, evtKey) {
  const key = evtKey || eventKey(e)

  if (key == 'tab') {
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()

      cb(e, key)
    }
  }

  return key
}

export function vibrate(d = 1) {
  typeof navigator.mozVibrate == 'function'
    ? navigator.mozVibrate(d)
    : navigator?.vibrate?.(d)
}

export const computedBR = {
  breakpoints() {
    return this.$store.state.breakpoints
  }
}

export const sortBy = (remove = []) => {
  return [
    {
      title: 'Area: A to Z',
      value: 'areadesc'
    },
    {
      title: 'Area: Z to A',
      value: 'areaasc'
    },
    {
      title: 'Title: A-Z',
      value: 'titledesc'
    },
    {
      title: 'Title: Z-A',
      value: 'titleasc'
    },

    // {
    //   title: 'Release: New to Old',
    //   value: 'stockdesc',
    // },
    // {
    //   title: 'Release: Old to New',
    //   value: 'stockasc',
    // },

    {
      title: 'Likes: High to low',
      value: 'likedesc'
    },
    {
      title: 'Likes: Low to high',
      value: 'likeasc'
    }
  ].filter((x) => !remove.includes(x.value))
}

export function isIOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

export const extractQueryVariables = (str, variable) => {
  const declarations = (variable || '').replace(/\$/g, '\\$').split(',')

  let output = str

  declarations.forEach((x) => {
    const entries = [x.split(':')]
    entries.forEach((e) => {
      const key = e[0]
      const value = e[1]

      const regExp = new RegExp(`${key}`, 'g')

      output = (output || '').replace(regExp, value)
    })
  })

  return output
}

export const setCSSVariable = (str) => {
  if (/^--\w+/i.test(str)) {
    return `var(${str})`
  }
  return str
}

export const btnClasses = `bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 dark:bg-blue-500 dark:text-black dark:hover:bg-blue-600 dark:hover:bg-opacity-70 dark:active:bg-blue-700 dark:active:bg-opacity-60`

export const formatAmount = (amount) => {
  const parseAmount = parseFloat(amount)

  if (isNaN(parseAmount)) {
    return null
  }

  if (parseAmount < 100) {
    return `¢${parseAmount}`
  } else return `$${(parseAmount / 100).toFixed(2)}`
}
