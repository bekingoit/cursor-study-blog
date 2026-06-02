import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Flex, Input, Select, Spin, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { ROUTES } from '@/constants/routes'
import { useAppContext } from '@/context/AppContext'
import { useBlogGenerator, useCreateBlog } from '@/hooks'
import './AddBlog.css'

const { Title, Text } = Typography
const { TextArea } = Input

const initialForm = {
  title: '',
  subTitle: '',
  category: '',
  description: ''
}

function AddBlog() {
  const { t } = useTranslation()
  const { navigate } = useAppContext()
  const { createBlog, loading: isSubmitting } = useCreateBlog()
  const { generateBody } = useBlogGenerator()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const categoryOptions = useMemo(
    () => BLOG_CATEGORIES.filter((item) => item !== 'All').map((item) => ({ value: item, label: item })),
    []
  )

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl('')
      return
    }

    const nextUrl = URL.createObjectURL(imageFile)
    setImagePreviewUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [imageFile])

  const onChangeField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const validate = (publishMode) => {
    if (!form.title.trim()) {
      toast.error(t('validation.titleRequired'))
      return false
    }
    if (!form.category) {
      toast.error(t('validation.categoryRequired'))
      return false
    }
    if (!publishMode) {
      return true
    }
    if (!form.subTitle.trim()) {
      toast.error(t('validation.subtitleRequired'))
      return false
    }
    if (!form.description.trim()) {
      toast.error(t('messages.error.blogDescription'))
      return false
    }
    if (!imageFile) {
      toast.error(t('messages.error.blogThumbnail'))
      return false
    }
    return true
  }

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('messages.error.imageType'))
      event.target.value = ''
      return
    }

    const maxSizeBytes = 5 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(t('messages.error.imageSize'))
      event.target.value = ''
      return
    }

    setImageFile(file)
  }

  const handleCreate = async (publishMode) => {
    if (!validate(publishMode)) return

    const payload = new FormData()
    payload.append('title', form.title.trim())
    payload.append('subTitle', form.subTitle.trim())
    payload.append('category', form.category)
    payload.append('description', form.description.trim())
    payload.append('isPublished', publishMode)
    if (imageFile) {
      payload.append('image', imageFile)
    }

    const result = await createBlog(payload, {
      successMessage: publishMode ? t('messages.success.blogPublished') : 'Draft saved successfully'
    })

    if (result.success) {
      navigate(ROUTES.ADMIN_ARTICLES)
    }
  }

  const handleGenerate = async () => {
    if (!form.title.trim()) {
      toast.error(t('messages.error.blogTitle'))
      return
    }
    if (!form.category) {
      toast.error(t('validation.categoryRequired'))
      return
    }

    setIsGenerating(true)
    const previousBody = form.description

    const result = await generateBody({
      title: form.title.trim(),
      subtitle: form.subTitle.trim(),
      category: form.category,
      instruction: previousBody.trim()
    })

    if (result.success) {
      onChangeField('description', result.data.content || '')
      toast.success(result.data.message || 'Content generated successfully')
    } else {
      onChangeField('description', previousBody)
      toast.error(result.message || t('messages.error.generic'))
    }

    setIsGenerating(false)
  }

  const disableForm = isGenerating

  return (
    <Flex vertical className="admin-add-blog">
      <Title level={1} className="admin-add-blog-title">{t('admin.addBlog.title')}</Title>

      <div className="admin-add-blog-form-wrapper" aria-busy={disableForm}>
        {disableForm && (
          <div className="admin-add-blog-overlay">
            <Spin size="large" />
          </div>
        )}

        <Flex vertical className="admin-add-blog-form">
          <Text className="admin-add-blog-label">{t('admin.addBlog.uploadThumbnail')}</Text>
          <button
            type="button"
            className="admin-upload-box"
            onClick={() => fileInputRef.current?.click()}
            disabled={disableForm || isSubmitting}
          >
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="thumbnail preview" className="admin-upload-preview" />
            ) : (
              <Flex vertical align="center" justify="center" gap={4}>
                <PlusOutlined />
                <span>{t('admin.addBlog.uploadButton')}</span>
              </Flex>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="admin-hidden-input"
            onChange={handleImageSelect}
            disabled={disableForm || isSubmitting}
          />

          <Text className="admin-add-blog-label">{t('admin.addBlog.titleLabel')}</Text>
          <Input
            placeholder={t('admin.addBlog.titlePlaceholder')}
            value={form.title}
            onChange={(e) => onChangeField('title', e.target.value)}
            disabled={disableForm || isSubmitting}
          />

          <Text className="admin-add-blog-label">{t('admin.addBlog.subtitleLabel')}</Text>
          <Input
            placeholder={t('admin.addBlog.titlePlaceholder')}
            value={form.subTitle}
            onChange={(e) => onChangeField('subTitle', e.target.value)}
            disabled={disableForm || isSubmitting}
          />

          <Text className="admin-add-blog-label">{t('admin.addBlog.categoryLabel')}</Text>
          <Select
            placeholder={t('admin.addBlog.categoryPlaceholder')}
            options={categoryOptions}
            value={form.category || undefined}
            onChange={(value) => onChangeField('category', value)}
            disabled={disableForm || isSubmitting}
          />

          <Text className="admin-add-blog-label">{t('admin.addBlog.bodyLabel')}</Text>
          <div className="admin-add-blog-body-wrap">
            <TextArea
              rows={10}
              placeholder={t('admin.addBlog.titlePlaceholder')}
              value={form.description}
              onChange={(e) => onChangeField('description', e.target.value)}
              disabled={disableForm || isSubmitting}
            />
            <Button
              className="admin-add-blog-generate"
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={disableForm || isSubmitting}
            >
              {t('admin.addBlog.generateAI')}
            </Button>
          </div>

          <Flex gap={12} className="admin-add-blog-actions">
            <Button
              type="primary"
              onClick={() => handleCreate(true)}
              loading={isSubmitting}
              disabled={disableForm}
            >
              {t('admin.addBlog.publishButton')}
            </Button>
            <Button
              onClick={() => handleCreate(false)}
              loading={isSubmitting}
              disabled={disableForm}
            >
              {t('admin.addBlog.saveDraft')}
            </Button>
          </Flex>
        </Flex>
      </div>
    </Flex>
  )
}

export default AddBlog
