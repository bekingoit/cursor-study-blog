export const validateComment = (req, res, next) => {
  const { blog, name, content } = req.body
  const errors = []

  if (!blog) errors.push('Blog ID is required')
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters')
  if (!content || content.trim().length < 5) errors.push('Content must be at least 5 characters')

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}

const VALID_CATEGORIES = ['Technology', 'Startup', 'Lifestyle', 'Finance']

const parseBoolean = (value) => value === true || value === 'true'

export const validateCreateBlog = (req, res, next) => {
  const { title, subTitle, description, category, isPublished } = req.body
  const errors = []
  const publishMode = parseBoolean(isPublished)

  const trimmedTitle = title?.trim()
  const trimmedSubTitle = subTitle?.trim()
  const trimmedDescription = description?.trim()
  const trimmedCategory = category?.trim()

  if (!trimmedTitle || trimmedTitle.length < 5) {
    errors.push('Title must be at least 5 characters')
  }

  if (!trimmedCategory) {
    errors.push('Category is required')
  } else if (!VALID_CATEGORIES.includes(trimmedCategory)) {
    errors.push('Category is invalid')
  }

  if (publishMode && (!trimmedSubTitle || trimmedSubTitle.length < 5)) {
    errors.push('Subtitle must be at least 5 characters to publish')
  }

  if (publishMode && (!trimmedDescription || trimmedDescription.length < 50)) {
    errors.push('Article body must be at least 50 characters to publish')
  }

  if (publishMode && !req.file) {
    errors.push('Thumbnail image is required to publish')
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

export const validateGenerateRequest = (req, res, next) => {
  const { title, category, subtitle, instruction } = req.body
  const errors = []

  if (!title || title.trim().length < 5) {
    errors.push('Title must be at least 5 characters')
  }

  if (!category || !VALID_CATEGORIES.includes(category.trim())) {
    errors.push('Category is invalid')
  }

  if (subtitle && subtitle.trim().length > 160) {
    errors.push('Subtitle cannot exceed 160 characters')
  }

  if (instruction && instruction.trim().length > 500) {
    errors.push('Instruction cannot exceed 500 characters')
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

