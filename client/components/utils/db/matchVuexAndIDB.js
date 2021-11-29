import { promiser } from '../main'

// all this does is to update vuex with data form idb. very useful on visibility change to update app based on lates idb value from same browser.
export default async function matchVuexAndIDB() {
  const db = this.$IDB

  // const updateShopSection = async () => {
  //   if (this.$store.state.$store.built) {
  //     return promiser()
  //   }

  //   const { data } = await db({
  //     action: 'select',
  //     args: {
  //       from: 'shop_section'
  //     }
  //   })

  //   if (data?.[0]) {
  //     const value = {}

  //     data.forEach((x) => {
  //       value[x.key] = x.value
  //     })

  //     this.$commit('UPDATE_', {
  //       path: 'shopSection',
  //       value
  //     })

  //     this.$commit('UPDATE_', {
  //       path: 'built',
  //       innerPath: '$store',
  //       value: true
  //     })

  //     console.log('d')
  //   }

  //   return promiser()
  // }

  // await updateShopSection()

  // const updateMerch = async () => {
  //   if (this.$store.state.$store.built) {
  //     // console.log(237)
  //     return promiser()
  //   }
  //   // console.log(23)

  //   const { data } = await db({
  //     action: 'select',
  //     args: {
  //       from: 'merch'
  //     }
  //   })

  //   if (data?.[0]) {
  //     const value = {}

  //     data.forEach((x) => {
  //       value[x.product_code] = x
  //     })

  //     // this.$commit('UPDATE_', {
  //     //   path: '$store',
  //     //   value: {
  //     //     built: true,
  //     //     merch: value
  //     //   }
  //     // })
  //   }

  //   return promiser()
  // }

  // await updateMerch()

  const updateBag = async () => {
    const { data } = await db({
      action: 'select',
      args: {
        from: 'bag'
      }
    })

    if (data?.[0]) {
      const value = {}

      data.forEach((x) => {
        if (!x.uid?.length) {
          return
        }

        value[x.ref] = x.uid?.length || x.uid || 0
      })

      this.$commit('UPDATE_', {
        path: 'bagItems',
        value
      })
    }

    return promiser()
  }

  await updateBag()

  const savedAndRecentlyViewed = async ({ table, vuexPath }) => {
    const { data, error } = await db({
      action: 'select',
      args: {
        from: table
      }
    })

    if (error) {
      return promiser()
    }

    if (data?.length) {
      // console.log(data, table)
      const result = data?.find?.((x) => x.path == 'all') || {}

      this.$commit('UPDATE_', {
        path: vuexPath,
        value: result.items
      })

      // console.log(vuexPath, result)
    }

    await this.$nextTick()

    return promiser(true)
  }

  await savedAndRecentlyViewed({ table: 'saved', vuexPath: 'savedItems' })

  await savedAndRecentlyViewed({
    table: 'recently_viewed',
    vuexPath: 'recentlyViewed'
  })

  // await updateVuex({ table: 'bag', path: 'bagItems' })

  const { data } = await db({
    action: 'select',
    args: { from: 'logger', query: 'updated_at' }
  })

  if (data?.[0]?.timeStamp) {
    this.$commit('UPDATE_', {
      path: 'idbUpdateStamp',
      value: data[0].timeStamp
    })
  }

  return promiser(true)
}
