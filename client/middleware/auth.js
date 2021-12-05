export default function ({ store, redirect, route }) {
  const app = store.$router.app
  // redirect if not logged in and path isnt / and app mounted
  const appMounted = app?.$c4?.mounted

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
  redirectUnauthorized('seller', ['deposit', 'reset'])
}
