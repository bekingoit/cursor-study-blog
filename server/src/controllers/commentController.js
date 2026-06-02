import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages.js'

export const addComment = asyncHandler(async (req, res) => {
  const { blog, name, content } = req.body

  const blogExists = await Blog.findById(blog)
  if (!blogExists) {
    return res.status(404).json({ success: false, message: ERROR_MESSAGES.BLOG_NOT_FOUND })
  }

  const comment = await Comment.create({
    blog,
    name: name.trim(),
    content: content.trim()
  })

  res.status(201).json({
    success: true,
    message: SUCCESS_MESSAGES.COMMENT_ADDED,
    comment
  })
})

export const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params

  const comments = await Comment.find({ blog: blogId, isApproved: true })
    .sort({ createdAt: -1 })

  res.json({
    success: true,
    count: comments.length,
    comments
  })
})

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({})
    .populate('blog', 'title')
    .sort({ createdAt: -1 })

  res.json({
    success: true,
    count: comments.length,
    comments
  })
})

export const approveComment = asyncHandler(async (req, res) => {
  const { id } = req.body

  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(404).json({ success: false, message: ERROR_MESSAGES.COMMENT_NOT_FOUND })
  }

  comment.isApproved = true
  await comment.save()

  res.json({ success: true, message: SUCCESS_MESSAGES.COMMENT_APPROVED })
})

export const unapproveComment = asyncHandler(async (req, res) => {
  const { id } = req.body

  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(404).json({ success: false, message: ERROR_MESSAGES.COMMENT_NOT_FOUND })
  }

  comment.isApproved = false
  await comment.save()

  res.json({ success: true, message: SUCCESS_MESSAGES.COMMENT_UNAPPROVED })
})

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.body

  const comment = await Comment.findByIdAndDelete(id)
  if (!comment) {
    return res.status(404).json({ success: false, message: ERROR_MESSAGES.COMMENT_NOT_FOUND })
  }

  res.json({ success: true, message: SUCCESS_MESSAGES.COMMENT_DELETED })
})
