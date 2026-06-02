import express from 'express'
import { 
  adminLogin, 
  getAllBlogsAdmin, 
  getDashboard 
} from '../controllers/adminController.js'
import {
  getAllComments,
  approveComment,
  unapproveComment,
  deleteComment
} from '../controllers/commentController.js'
import auth from '../middleware/auth.js'
import { loginLimiter } from '../middleware/rateLimiter.js'

const adminRouter = express.Router()

// Apply strict rate limiting to login endpoint
adminRouter.post('/login', loginLimiter, adminLogin)

// Apply auth middleware to all routes below this point
adminRouter.use(auth)

adminRouter.get('/dashboard', getDashboard)
adminRouter.get('/blogs', getAllBlogsAdmin)
adminRouter.get('/comments', getAllComments)
adminRouter.post('/approve-comment', approveComment)
adminRouter.post('/unapprove-comment', unapproveComment)
adminRouter.post('/delete-comment', deleteComment)

export default adminRouter