export default function IDB(payload) {
  const action = payload?.action
  const args = payload?.args

  const timeStamp = performance.now()

  if (!IDB.worker) {
    IDB.worker = new Worker('workers/iw.js')
  }

  return new Promise((resolve, reject) => {
    if (action && args) {
      const evtCallback = (e) => {
        const removeListener = () =>
          IDB.worker.removeEventListener('message', evtCallback)

        if (e.data.name == 'idb') {
          if (e.data.error) {
            const reason = {
              error: true,
              message:
                e.data.errorObject?.message ||
                `unexpected: idb worker threw an error`
            }
            return resolve(reason)
          }

          const sameIdCallback = () => {
            removeListener()

            const resolveData = { data: e.data.data }

            if (e.error) {
              const reason = {
                error: true,
                message: `unexpected: idb worker threw an error`
              }

              return resolve(reason)
            } else {
              resolve(resolveData)

              return true
            }
          }

          return timeStamp == e.data.timeStamp && sameIdCallback()
        } else removeListener()
      }

      IDB.worker.addEventListener('message', evtCallback)

      IDB.worker.postMessage({
        name: 'idb',
        timeStamp,
        action,
        args
      })
    } else {
      resolve({ data: true })
    }
  })
}
