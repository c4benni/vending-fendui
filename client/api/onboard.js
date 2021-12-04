import axios from './config'

export default {
  async onboard({ form, path }) {
    const res = await axios.post(`/user/${path}`, form)

    return res
  }
}
