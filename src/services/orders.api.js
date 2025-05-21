import api from './api'

export default {
  getOrders() {
    return api.get('/orders')
  },
  createOrder(data) {
    return api.post('/orders', data)
  },
  updateOrder(id, data) {
    return api.put(`/orders/${id}`, data)
  }
}