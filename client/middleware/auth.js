export default function ({ store, redirect, route }) {
  const app = store.$router.app
  // redirect if not logged in and path isnt / and app mounted
  const appMounted = app?.$c4?.mounted

  if (!appMounted) {
    return
  }

  const session = store.state.user
  const loginPage = route.path == '/'

  if (!session && !loginPage) {
    return redirect({
      path: '/',
      query: {
        login: true
      }
    })
  }
  // redirect back to dashboard if a logged in user is trying to access login page
  else if (session && loginPage) {
    return redirect('/dashboard')
  }
}
