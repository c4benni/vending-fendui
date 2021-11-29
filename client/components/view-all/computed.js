import { capitalize, extractQueryVariables, getObjectPath } from '../utils/main'

export default {
  formatQuery() {
    const query = this.$route.query

    const required = (query['v-a-z'] || '')
      .replace(/:/g, '_')
      .split('_')
      .map((x) => `v-${x}`)
      .filter((x) => /^v-.+/.test(x))

    const passedRequired = query['v-a-z']
      ? Object.keys(query).filter((x) => /^v-/.test(x) && required.includes(x))
          .length == required?.length
      : true

    if (!passedRequired) {
      return {
        error: true,
        title: '404',
        lowerTitle: '404',
        passedRequired: false
      }
    }

    const extract = (str) => extractQueryVariables(str, query['v-cst'] || '')

    const path = extract((query['v-ph'] || '').replace(/:/g, '.'))

    let formattedTestPath = extract(
      (query['v-tt'] || '').replace(/:/g, '.')
    ).replace(/undefined|null/g, '')

    if (!formattedTestPath) {
      formattedTestPath = null
    }

    const queryFor = extract(query['v-f'])

    const showingFor =
      queryFor == 're' ? 'recipe' : queryFor == 'ee' ? 'explore' : queryFor

    const queryInnerFor = extract(query['v-f'])

    const innerShowingFor =
      queryInnerFor == 're'
        ? 'recipe'
        : queryInnerFor == 'ee'
        ? 'explore'
        : queryInnerFor

    const getFetched = () => {
      const fetched = query['v-fd']

      if (!fetched || fetched == ':t') {
        return true
      }

      if (fetched == ':f') {
        return false
      }

      if (fetched == ':c') {
        const hasTest = formattedTestPath

        const testPath = hasTest
          ? getObjectPath({ obj: this.$store.state, path: formattedTestPath })
          : true

        const test = typeof testPath == 'boolean' && testPath

        return hasTest
          ? test
          : Array.isArray(getObjectPath({ obj: this.$store.state, path }))
      }

      return false
    }

    const rpc = (path) => {
      // returns key value array (str:obj)

      const getQuery = query[path] || ''

      if (!getQuery) {
        return []
      }

      let name = extract(
        ((getQuery.match(/^.+\s+?{/g) || [])[0] || '').replace(/\s+?{/, '')
      )

      if (name == 'f_sis') {
        name = '$similarItems'
      }
      if (name == 'f_bee') {
        name = '$buildExplore'
      }
      if (name == 'f_ce') {
        name = '$cuisines'
      }
      if (name == 'f_cy') {
        name = '$category'
      }

      if (name == 'f_cs') {
        name = '$cuisinesItems'
      }

      if (name == 'f_cis') {
        name = '$categoriesItems'
      }

      if (name == 'f_cns') {
        name = '$collectionItems'
      }

      const allowedFunctions = [
        '$similarItems',
        '$buildExplore',
        '$cuisines',
        '$category',
        '$cuisinesItems',
        '$categoriesItems',
        '$collectionItems'
      ]

      if (!allowedFunctions.includes(name)) {
        return []
      }

      const args = Object.fromEntries?.([
        ((getQuery.match(/{.+}/g) || ['_'])[0] || '')
          .replace(/{|}/g, '')
          .split(':')
          .map((x) => extract(x)) || {}
      ])

      return [name, args]
    }

    return {
      title: capitalize(extract(query['v-t'] || '')),
      lowerTitle: extract(query['v-t']),
      showingFor,
      innerShowingFor: innerShowingFor.replace(/undefined|null/, ''),
      isRecipe: showingFor == 'recipe',
      fetched: getFetched(),
      path,
      testPath: formattedTestPath,
      required,
      pageLimit: extract(query['v-lim'] || '10'),
      passedRequired,
      rpc: rpc('v-gt'),
      innerGet: query['v-igt']
    }
  }
}
