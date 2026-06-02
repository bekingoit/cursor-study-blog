import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import generateWithGemini from '../configs/gemini.js'
import { transformBlogImage, transformBlogsImages } from '../utils/imageUrl.js'
import { asyncHandler } from '../helpers/asyncHandler.js'

// Helper to delete image file
const deleteImageFile = (imagePath) => {
  if (!imagePath) return

  // Extract filename from URL path (handle both relative and full URLs)
  const urlPath = imagePath.replace(/^https?:\/\/[^/]+/, '')
  const filename = urlPath.split('/').pop()
  const fullPath = path.join(process.cwd(), 'uploads', 'blogs', filename)

  // Only delete if file exists and is in uploads directory
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath)
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }
}

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isPublished: true })
  res.json({
    success: true,
    count: blogs.length,
    blogs: transformBlogsImages(blogs, req)
  })
})

export const getBlogById = asyncHandler(async (req, res) => {
  const { blogId } = req.params
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ success: false, message: 'Invalid blog id' })
  }
  const blog = await Blog.findById(blogId)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }
  res.json({ success: true, blog: transformBlogImage(blog, req) })
})

export const deleteBlogById = asyncHandler(async (req, res) => {
  const { id } = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog id' })
  }

  // Find the blog first to get the image path
  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }
  
  if (blog.image) {
    // Delete the associated image file
    deleteImageFile(blog.image)
  }

  await Blog.findByIdAndDelete(id)

  // Delete all comments associated with the blog
  await Comment.deleteMany({ blog: id })

  res.json({ success: true, message: 'Blog deleted successfully' })
})

export const publishBlog = asyncHandler(async (req, res) => {
  const { id } = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog id' })
  }
  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }
  blog.isPublished = true
  await blog.save()
  res.json({ success: true, message: 'Blog published successfully' })
})

export const unpublishBlog = asyncHandler(async (req, res) => {
  const { id } = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog id' })
  }
  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }
  blog.isPublished = false
  await blog.save()
  res.json({ success: true, message: 'Blog unpublished successfully' })
})

export const addComment = asyncHandler(async (req, res) => {
  const { blog, name, content } = req.body
  await Comment.create({ blog, name, content })
  res.status(201).json({ success: true, message: 'Comment added for review' })
})

export const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.body
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ success: false, message: 'Invalid blog id' })
  }
  const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 })
  res.json({
    success: true,
    count: comments.length,
    comments
  })
})

export const createBlog = asyncHandler(async (req, res) => {
  const { title, subTitle, description, category, isPublished } = req.body
  const imagePath = req.file ? `/uploads/blogs/${req.file.filename}` : ''

  const blog = await Blog.create({
    title: title.trim(),
    subTitle: subTitle?.trim(),
    description: description?.trim() || '',
    category: category.trim(),
    author: req.user.userId,
    authorName: req.user.name || req.user.email,
    image: imagePath,
    isPublished: isPublished === true || isPublished === 'true'
  })

  res.status(201).json({
    success: true,
    message: blog.isPublished ? 'Blog published successfully' : 'Draft saved successfully',
    blog: transformBlogImage(blog, req)
  })
})

const buildPrompt = ({ title, category, subtitle, instruction }) => {
  return `You are an expert blog writing assistant.
Generate only the article body in markdown.

Input context:
- Title: ${title}
- Category: ${category}
- Subtitle: ${subtitle || 'N/A'}
- Additional instruction: ${instruction || 'None'}

Rules:
1. Do not generate title, subtitle, or category headings.
2. Use clear sections with markdown headings.
3. Keep tone practical and engaging.
4. Length: around 700-1000 words.
5. End with a concise conclusion section.
6. Return only markdown body content, with no code fences.`
}

export const generateBlogBody = asyncHandler(async (req, res) => {
  const { title, category, subtitle, instruction } = req.body
  const prompt = buildPrompt({
    title: title.trim(),
    category: category.trim(),
    subtitle: subtitle?.trim(),
    instruction: instruction?.trim()
  })

  const timeoutMs = 30000
  let content = ''
  try {
    content = await Promise.race([
      generateWithGemini(prompt),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation timed out')), timeoutMs)
      })
    ])
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: error.message || 'Generation failed'
    })
  }

  if (!content || !content.trim()) {
    return res.status(502).json({
      success: false,
      message: 'Generation returned an empty response'
    })
  }

  res.json({
    success: true,
    message: 'Content generated successfully',
    content: content.trim()
  })
})

