import api from './api'

export default {
  getMenuItems() {
    return api.get('/menuitems')
  },
  createMenuItem(data) {
    return api.post('/menuitems', data)
  }
}