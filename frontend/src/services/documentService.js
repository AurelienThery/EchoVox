import api from './api'

export const documentService = {
  async getAll() {
    const response = await api.get('/documents')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/documents/${id}`)
    return response.data
  },

  async create(documentData) {
    const response = await api.post('/documents', {
      document: documentData,
      auto_simplify: documentData.auto_simplify,
      locale: documentData.locale || 'fr',
    })
    return response.data
  },

  async update(id, documentData) {
    const response = await api.put(`/documents/${id}`, {
      document: documentData,
    })
    return response.data
  },

  async delete(id) {
    await api.delete(`/documents/${id}`)
  },

  async simplify(id, locale = 'fr') {
    const response = await api.post(`/documents/${id}/simplify`, { locale })
    return response.data
  },
}
