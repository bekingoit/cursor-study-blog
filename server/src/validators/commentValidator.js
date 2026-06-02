export const validateCommentInput = (req, res, next) => {
  const { blog, name, content } = req.body
  const errors = []

  if (!blog) {
    errors.push('Blog is required')
  }
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  if (!content || content.trim().length < 1) {
    errors.push('Comment is required')
  } else if (content.trim().length > 650) {
    errors.push('Comment must be at most 650 characters')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}
