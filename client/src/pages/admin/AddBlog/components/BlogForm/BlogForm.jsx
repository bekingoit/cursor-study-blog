import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Form, Input, Select, Upload, Button, Typography, Flex, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { UPLOAD, DEFAULTS } from '@/constants/ui'
import { useBlogGenerator, useCreateBlog } from '@/hooks'
import { createBlogPublishSchema, createBlogDraftSchema } from '@/schemas'
import './BlogForm.css'

const { Text } = Typography

const categoryOptions = BLOG_CATEGORIES.filter((cat) => cat !== 'All')

function BlogForm() {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const { t } = useTranslation()
  const [imagePreview, setImagePreview] = useState(null)

  const publishSchema = useMemo(() => createBlogPublishSchema(t), [t])
  const draftSchema = useMemo(() => createBlogDraftSchema(t), [t])

  const defaultValues = useMemo(() => ({
    title: '',
    subTitle: '',
    category: DEFAULTS.CATEGORY,
    description: '',
    image: undefined
  }), [])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    getValues,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(publishSchema),
    defaultValues
  })

  const watchedImage = watch('image')

  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()

  const resetFormState = useCallback(() => {
    reset(defaultValues)
    setImagePreview(null)
    if (quillRef.current) {
      quillRef.current.root.innerHTML = ''
    }
  }, [reset, defaultValues])

  const onPublish = useCallback(async (values) => {
    const blog = {
      title: values.title,
      subTitle: values.subTitle,
      description: values.description,
      category: values.category,
      isPublished: true
    }

    const result = await createBlog(blog, values.image)

    if (result.success) {
      resetFormState()
    }
  }, [createBlog, resetFormState])

  const handlePublishSubmit = useCallback(() => {
    if (quillRef.current) {
      setValue('description', quillRef.current.root.innerHTML, { shouldValidate: true })
    }
    handleSubmit(onPublish)()
  }, [setValue, handleSubmit, onPublish])

  const handleSaveDraft = useCallback(async () => {
    clearErrors()

    if (quillRef.current) {
      setValue('description', quillRef.current.root.innerHTML, { shouldValidate: false })
    }

    const values = getValues()
    const parsed = draftSchema.safeParse(values)

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field) {
          setError(field, { type: 'manual', message: issue.message })
        }
      })
      return
    }

    const description = values.description || '<p><br></p>'

    const blog = {
      title: values.title,
      subTitle: values.subTitle || '',
      description,
      category: values.category || DEFAULTS.CATEGORY,
      isPublished: false
    }

    const result = await createBlog(blog, values.image)

    if (result.success) {
      resetFormState()
    }
  }, [clearErrors, getValues, setValue, draftSchema, setError, createBlog, resetFormState])

  const handleGenerateContent = useCallback(async () => {
    const title = getValues('title')
    if (!title?.trim()) {
      toast.error(t('messages.error.blogTitle'))
      return
    }

    const result = await generateContent(title)
    if (result.success && quillRef.current) {
      quillRef.current.root.innerHTML = result.content
      setValue('description', result.content, { shouldValidate: false })
    }
  }, [generateContent, getValues, setValue, t])

  const handleBeforeUpload = useCallback((file, onChange) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      toast.error(t('messages.error.imageType'))
      return false
    }
    const isLt5M = file.size / 1024 / 1024 < UPLOAD.MAX_SIZE_MB
    if (!isLt5M) {
      toast.error(t('messages.error.imageSize'))
      return false
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)

    onChange(file)
    clearErrors('image')
    return false
  }, [t, clearErrors])

  const handleImageRemove = useCallback((onChange) => {
    onChange(undefined)
    setImagePreview(null)
  }, [])

  useEffect(() => {
    if (!watchedImage || !(watchedImage instanceof File)) {
      setImagePreview(null)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(watchedImage)
  }, [watchedImage])

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: t('admin.addBlog.titlePlaceholder')
      })

      quillRef.current.on('text-change', () => {
        if (quillRef.current) {
          setValue('description', quillRef.current.root.innerHTML, {
            shouldValidate: false
          })
        }
      })
    }
  }, [t, setValue])

  return (
    <Form
      layout="vertical"
      component="form"
      onFinish={handlePublishSubmit}
      className="admin-add-blog-form"
    >
      <Form.Item
        label={t('admin.addBlog.uploadThumbnail')}
        validateStatus={errors.image ? 'error' : ''}
        help={errors.image?.message}
      >
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Upload
              listType="picture-card"
              className="admin-upload"
              maxCount={1}
              accept={UPLOAD.ACCEPTED_TYPES}
              showUploadList={false}
              fileList={value ? [value] : []}
              beforeUpload={(file) => handleBeforeUpload(file, onChange)}
              onRemove={() => handleImageRemove(onChange)}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="admin-upload-preview"
                />
              ) : (
                <Flex vertical align="center" justify="center">
                  <PlusOutlined />
                  <Text className="admin-upload-text">{t('admin.addBlog.uploadButton')}</Text>
                </Flex>
              )}
            </Upload>
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.addBlog.titleLabel')}
        validateStatus={errors.title ? 'error' : ''}
        help={errors.title?.message}
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder={t('admin.addBlog.titlePlaceholder')}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.addBlog.subtitleLabel')}
        validateStatus={errors.subTitle ? 'error' : ''}
        help={errors.subTitle?.message}
      >
        <Controller
          name="subTitle"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder={t('admin.addBlog.titlePlaceholder')}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.addBlog.categoryLabel')}
        validateStatus={errors.category ? 'error' : ''}
        help={errors.category?.message}
      >
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder={t('admin.addBlog.categoryPlaceholder')}
            >
              {categoryOptions.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.addBlog.bodyLabel')}
        required
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description?.message}
      >
        <div className="admin-editor-wrapper">
          <div ref={editorRef} className="admin-editor" />
          <Button
            size="small"
            onClick={handleGenerateContent}
            loading={isGenerating}
            disabled={isGenerating || isCreating}
            className="admin-editor-ai-button"
          >
            {t('admin.addBlog.generateAI')}
          </Button>
        </div>
      </Form.Item>

      <Form.Item className="admin-form-actions-item">
        <Space size="middle">
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating}
            disabled={isCreating || isGenerating}
          >
            {t('admin.addBlog.publishButton')}
          </Button>
          <Button
            type="button"
            onClick={handleSaveDraft}
            loading={isCreating}
            disabled={isCreating || isGenerating}
            className="admin-draft-button"
          >
            {t('admin.addBlog.saveDraft')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default BlogForm
