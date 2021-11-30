export default function state() {
  return {
    noPageAnimation: false,
    isMozilla: false,
    worker: null,
    rootModal: {
      tag: 'ui-sheet',
      active: false,
      meta: {
        uid: null
      },
      transitionState: ''
    },
    pageVisible: true,
    isTouchDevice: null,
    isStrictTouchDevice: null,
    beforeCreateCalled: false,
    breakpoints: {},
    appLoaded: false,
    appMounted: false,
    showPageLoading: false,

    fetched: {
      components: {},
      pages: {}
    },
    greeting: '',

    pageTransition: '',
    pageTransitionState: 'beforeEnter',

    vmodel: {
      search: '',
      loadingBar: false,
      clearSaved: {
        active: false,
        meta: {}
      }
    },

    // for route to reset
    initialVModel: {
      search: ''
    },

    savedItems: [],

    recentlyViewed: [],

    sortSaved: 'datedesc',

    supportsBackdrop: false,

    vectorIcons: {
      working:
        'https://itwmctclrhnoeqnsakvq.supabase.in/storage/v1/object/sign/media/working.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS93b3JraW5nLnBuZyIsImlhdCI6MTYzNTI1MDIxOCwiZXhwIjoxOTUwNjEwMjE4fQ.-xx0RJLQaKI__Koz9Jbk5ASAhM4WcvDk7ZZ-09LYCAg'
    },

    header: {
      text: '',
      showOnMobile: false
    },

    explore: {
      expanded: {}
    },

    exploreSections: {
      cuisines: {},
      categories: {},
      collections: {}
    },

    recipes: {},

    fetchTimeStamps: {},

    idb: {
      uid: null,
      init: false
    },

    exploreBuilt: false,

    windowHeight: 0
  }
}
