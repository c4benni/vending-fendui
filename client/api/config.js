import Axios from 'axios'

const instance = Axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 2500,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

export default instance
