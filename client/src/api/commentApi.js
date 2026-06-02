import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const commentApi = {
  getByBlog: async (id) => {
    return await axios.get(API_ENDPOINTS.BLOG_COMMENTS(id))
  },

  add: async ({ blog, name, content }) => {
    return await axios.post(API_ENDPOINTS.BLOG_ADD_COMMENT, { blog, name, content })
  },

  getAllAdmin: async () => {
    return await axios.get(API_ENDPOINTS.ADMIN_COMMENTS)
  },

  approve: async (id) => {
    return await axios.post(API_ENDPOINTS.ADMIN_COMMENT_APPROVE, { id })
  },

  unapprove: async (id) => {
    return await axios.post(API_ENDPOINTS.ADMIN_COMMENT_UNAPPROVE, { id })
  },

  remove: async (id) => {
    return await axios.post(API_ENDPOINTS.ADMIN_COMMENT_DELETE, { id })
  }
}
