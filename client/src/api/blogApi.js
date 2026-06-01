import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const blogApi = {
  getAll: async () => {
    return await axios.get(API_ENDPOINTS.BLOGS_ALL)
  },

  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.BLOG_BY_ID(id))
  },

  create: async (formData) => {
    return await axios.post(API_ENDPOINTS.BLOG_CREATE, formData)
  },

  update: async (id, formData) => {
    return await axios.put(API_ENDPOINTS.BLOG_UPDATE(id), formData)
  },

  delete: async (id) => {
    return await axios.delete(API_ENDPOINTS.BLOG_DELETE(id))
  },

  deleteBlog: async (id) => {
    return await axios.post(API_ENDPOINTS.BLOG_DELETE_POST, { id })
  },

  publish: async (id) => {
    return await axios.post(API_ENDPOINTS.BLOG_PUBLISH, { id })
  },

  unpublish: async (id) => {
    return await axios.post(API_ENDPOINTS.BLOG_UNPUBLISH, { id })
  },

  generate: async (prompt) => {
    return await axios.post(API_ENDPOINTS.BLOG_GENERATE, { prompt })
  }
}
