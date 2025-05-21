import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const menuApi = {
  // Получение категорий
  getCategories() {
    return api.get('/Menu/categories')
  },

  createCategory(category) {
    return api.post('/menu/categories', category)
  },

  updateCategory(id, category) {
    return api.put(`/menu/categories/${id}`, category)
  },

  deleteCategory(id) {
    return api.delete(`/menu/categories/${id}`)
  },

  // Получение блюд
  getMenuItems(params = {}) {
    return api.get('/Menu/items', { params })
  },

  createMenuItem(item) {
    const formData = new FormData()
    Object.keys(item).forEach(key => {
      if (key === 'image' && item[key] instanceof File) {
        formData.append('image', item[key])
      } else {
        formData.append(key, item[key])
      }
    })
    return api.post('/menu/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateMenuItem(id, item) {
    const formData = new FormData()
    Object.keys(item).forEach(key => {
      if (key === 'image' && item[key] instanceof File) {
        formData.append('image', item[key])
      } else {
        formData.append(key, item[key])
      }
    })
    return api.put(`/menu/items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteMenuItem(id) {
    return api.delete(`/menu/items/${id}`)
  },

  uploadItemImage(id, imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    return api.post(`/menu/items/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export const orderApi = {
  // Создание заказа
  createOrder(orderData) {
    return api.post('/Orders', orderData)
  }
}

export const tableApi = {
  getTables() {
    return api.get('/Tables')
  }
}

export default api 