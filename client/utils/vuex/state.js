const mediaPath = 'vendingApp/vector/'

export default function state() {
  return {
    media: {
      register: `${mediaPath}bermuda-profitable-growth_mpihif`,
      login: `${mediaPath}bermuda-businessman_brbemo`,
      favIco: `${mediaPath}icons8-vending-machine-96_sfeaj1`,
      notFound: [
        `${mediaPath}pixeltrue-error-1_hdvys7`,
        `${mediaPath}jaconda-17_iemp36`,
        `${mediaPath}bermuda-page-not-found_ixpt7o`
      ],
      expired: [`${mediaPath}flamenco-logged-out_yjfeh2`],
      welcome: `${mediaPath}crayon-welcome-3_yscmh1`,
      alert: `${mediaPath}flamenco-652_mrnn3d`,
      empty: `${mediaPath}flame-2_kn885a`,
      upload: `${mediaPath}rush-1_fmqbfj`
    },

    user: null,

    greeting: '',

    breakpoints: {},

    mobileNav: false,

    notify: { message: null },

    authSleeping: false,

    dashboardProcessing: false,

    processingDone: null
  }
}
