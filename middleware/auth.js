import { isProduction } from '~/utils/main'

export default async function ({ store, redirect, route, req }) {
  const app = store.$router.app
  // redirect if not logged in and path isnt / and app mounted
  const appMounted = app?.$ui?.mounted

  if (req) {
if (isProduction && !req.connection.encrypted) {
  return redirect(process.env.BROWSER_BASE_URL)
}

const scheme = isProduction
  ? 'https://'
  : req.connection.encrypted
  ? 'https://'
  : 'http://'


    const host = req.headers.host

    const res = await fetch(`${scheme}${host}/api/v1/auth`, {
      headers: req.headers
    })

    const { data } = await res.json()

    store.commit('UPDATE', {
      path: 'user',
      value: data || null
    })
  }

  if (!appMounted) {
    return
  }

  const session = store.state.user
  const loginPage = route.path == '/'

  // redirect to homescreen if not logged in;
  if (!session && !loginPage) {
    return redirect({
      path: '/',
      query: {
        login: true
      }
    })
  }

  // redirect back to dashboard if a logged in user is trying to access login page
  if (session && loginPage) {
    return redirect('/dashboard')
  }

  const redirectUnauthorized = (role, paths) => {
    // redirect to 404 when user is accesses wrong routes;
    if (session?.role == role) {
      const unauthorized = paths

      const isUnauthorized = unauthorized.find((x) => {
        const regExp = new RegExp(`^/dashboard/${x}/?`)

        return regExp.test(route.path)
      })

      if (isUnauthorized) {
        return redirect('/dashboard/unauthorized')
      }
    }
  }

  redirectUnauthorized('buyer', ['create-product', 'my-products'])
  redirectUnauthorized('seller', ['deposit', 'reset', 'shop', 'shop?id=.+'])

  if (
    route.path == '/dashboard/create-product' &&
    store.state.dashboardProcessing &&
    !store.state.processingDone
  ) {
    return redirect('/dashboard/create-product')
  }
}
