import express from 'express'
import { 
  addComment, 
  createBlog,
  deleteBlogById, 
  generateBlogBody,
  getAllBlogs, 
  getBlogById, 
  getBlogComments, 
  publishBlog,
  unpublishBlog 
} from '../controllers/blogController.js'
import auth from '../middleware/auth.js'
import authorizeRoles from '../middleware/authorizeRoles.js'
import upload from '../middleware/multer.js'
import { commentLimiter, generateLimiter } from '../middleware/rateLimiter.js'
import { validateComment, validateCreateBlog, validateGenerateRequest } from '../validators/blogValidator.js'

const blogRouter = express.Router()

// Public routes
blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)
blogRouter.post('/add-comment', commentLimiter, validateComment, addComment)
blogRouter.post('/comments', getBlogComments)

// Apply auth middleware to all routes below this point
blogRouter.use(auth)

// Protected routes
blogRouter.post('/create', authorizeRoles('admin', 'author'), upload.single('image'), validateCreateBlog, createBlog)
blogRouter.post('/generate', authorizeRoles('admin', 'author'), generateLimiter, validateGenerateRequest, generateBlogBody)
blogRouter.post('/delete', deleteBlogById)
blogRouter.post('/publish', publishBlog)
blogRouter.post('/unpublish', unpublishBlog)

export default blogRouter