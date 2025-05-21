import api from './api'

export default {
  getTables() {
    return api.get('/tables')
  },
  updateTable(id, data) {
    return api.put(`/tables/${id}`, data)
  },
  deleteTable(id) {
    return api.delete(`/tables/${id}`)
  }
}