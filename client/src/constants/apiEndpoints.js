export const API_ENDPOINTS = {
  // Blog endpoints
  BLOGS_ALL: '/api/blog/all',
  BLOG_BY_ID: (id) => `/api/blog/${id}`,
  BLOG_CREATE: '/api/blog',
  BLOG_UPDATE: (id) => `/api/blog/${id}`,
  BLOG_DELETE: (id) => `/api/blog/${id}`,
  BLOG_PUBLISH: '/api/blog/publish',
  BLOG_UNPUBLISH: '/api/blog/unpublish',
  BLOG_COMMENTS: (id) => `/api/blog/${id}/comments`,
  BLOG_ADD_COMMENT: '/api/blog/add-comment',

  // Admin endpoints
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_BLOGS: '/api/admin/blogs',
  ADMIN_COMMENTS: '/api/admin/comments',
  ADMIN_COMMENT_APPROVE: '/api/admin/approve-comment',
  ADMIN_COMMENT_UNAPPROVE: '/api/admin/unapprove-comment',
  ADMIN_COMMENT_DELETE: '/api/admin/delete-comment'
}

