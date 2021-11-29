async function savedAndRecent({ table, newValue }) {
  await this.$IDB({
    action: 'delete',
    args: {
      from: table,
      clear: true
    }
  })

  this.$IDB({
    action: 'insert',
    args: {
      into: table,
      values: [
        {
          path: 'all',
          items: newValue
        }
      ]
    }
  })
}

export const watchers = {
  async '$store.state.savedItems'(n) {
    if (
      this.$store.state.idbUpdateStamp &&
      this.$store.state.appLoaded &&
      this.$store.getters.pageEntered
    ) {
      await this.$sleep()

      this.$store.state.idbUpdateStamp &&
        savedAndRecent.call(this, { table: 'saved', newValue: n })
    }
  },

  async '$store.state.recentlyViewed'(n) {
    if (
      this.$store.state.idbUpdateStamp &&
      this.$store.state.appLoaded &&
      this.$store.getters.pageEntered
    ) {
      await this.$sleep()

      this.$store.state.idbUpdateStamp &&
        savedAndRecent.call(this, { table: 'recently_viewed', newValue: n })
    }
  },

  async '$store.state.$store'(n) {
    if (
      this.$store.state.idbUpdateStamp &&
      this.$store.state.appLoaded &&
      this.$store.getters.pageEntered
    ) {
      await this.$sleep()

      await this.$IDB({
        action: 'delete',
        args: {
          from: 'merch',
          clear: true
        }
      })

      await this.$IDB({
        action: 'insert',
        args: {
          into: 'merch',
          values: Object.values(n?.merch || {}).filter((x) => x.product_code)
        }
      })
    }
  },

  async canStoreSectionInIDB(n) {
    await this.$sleep()

    const updateIDB = async () => {
      const values = []

      Object.entries(this.$store.state.shopSection).forEach((x) => {
        const section = {
          key: x[0],
          value: x[1]
        }

        if (section.key == 'buildError') {
          return
        }

        values.push(section)
      })

      await this.$IDB({
        action: 'delete',
        args: {
          from: 'shop_section',
          clear: true
        }
      })

      await this.$IDB({
        action: 'insert',
        args: {
          into: 'shop_section',
          values
        }
      })
    }

    updateIDB()
  }
}
