import React, { useState } from 'react'
import { Form, Input, Button, Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { commentApi } from '@/api'
import toast from 'react-hot-toast'
import './CommentForm.css'

const { Title } = Typography
const { TextArea } = Input

function CommentForm({ blogId, onSuccess }) {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)

    try {
      const response = await commentApi.add({
        blog: blogId,
        name: values.name,
        content: values.content
      })

      if (response.data.success) {
        toast.success(t('messages.success.commentAdded'))
        form.resetFields()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(response.data.message || t('messages.error.generic'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex vertical gap="middle" className="comment-form">
      <Title level={4} className="comment-form-leave-title">
        {t('blogDetail.comments.leaveComment')}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="comment-form-fields"
      >
        <Form.Item
          label={t('blogDetail.comments.usernameLabel')}
          name="name"
          rules={[{ required: true, message: t('validation.usernameRequired') }]}
        >
          <Input
            placeholder={t('blogDetail.comments.usernamePlaceholder')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={t('blogDetail.comments.commentLabel')}
          name="content"
          rules={[{ required: true, message: t('validation.commentRequired') }]}
        >
          <TextArea
            placeholder={t('blogDetail.comments.commentPlaceholder')}
            maxLength={650}
            showCount
            rows={6}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {t('blogDetail.comments.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default CommentForm
