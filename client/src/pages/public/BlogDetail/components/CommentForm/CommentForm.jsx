import React, { useCallback, useMemo } from 'react'
import { Form, Input, Button, Typography, Flex, theme } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { createCommentSchema } from '@/schemas'
import './CommentForm.css'

const { Title } = Typography
const { TextArea } = Input

const MAX_COMMENT_LENGTH = 650

function CommentForm({ onSubmit, loading = false }) {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const schema = useMemo(() => createCommentSchema(t), [t])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', content: '' }
  })

  const onFormSubmit = useCallback(async (values) => {
    const result = await onSubmit({
      name: values.name,
      content: values.content
    })

    if (result?.success) {
      reset()
    }
  }, [onSubmit, reset])

  return (
    <Flex
      vertical
      gap={token.marginXS}
      style={{ width: '100%' }}
    >
      <Title
        level={3}
        style={{
          margin: 0,
          marginBottom: token.marginXS,
          fontWeight: token.fontWeightStrong,
          color: token.colorTextBase
        }}
      >
        {t('comment.title')}
      </Title>

      <Form
        layout="vertical"
        component="form"
        onFinish={handleSubmit(onFormSubmit)}
        style={{ width: '100%' }}
      >
        <Form.Item
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
          style={{ marginBottom: token.marginSM }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('comment.namePlaceholder')}
                size="large"
                style={{
                  borderRadius: token.borderRadiusLG
                }}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.content ? 'error' : ''}
          help={errors.content?.message}
          style={{ marginBottom: token.marginSM }}
        >
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder={t('comment.contentPlaceholder')}
                rows={5}
                size="large"
                maxLength={MAX_COMMENT_LENGTH}
                showCount={{
                  formatter: ({ count, maxLength }) => `${count}/${maxLength}`
                }}
                style={{
                  borderRadius: token.borderRadiusLG
                }}
              />
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || isSubmitting}
            size="large"
            style={{
              borderRadius: token.borderRadiusLG
            }}
          >
            {t('common.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default CommentForm
