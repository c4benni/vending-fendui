export default {
  pageEntered(s) {
    return /afterEnter/i.test(s.pageTransitionState)
  },
  headerHeight(s) {
    const breakpoints = s.breakpoints

    const xxs = breakpoints.is == 'xxs'

    const md = /md/.test(breakpoints.is)

    const lg = /lg/.test(breakpoints.is)
    const xl = /xl/.test(breakpoints.is)

    if (xxs) {
      return '40px'
    }

    if (md) {
      return '50px'
    }

    if (lg) {
      return '54px'
    }

    if (xl) {
      return '62px'
    }

    return '44px'
  }
}
