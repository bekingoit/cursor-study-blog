import React from 'react'
import { Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import BlogForm from './components/BlogForm'
import '../shared/AdminTable.css'
import './AddBlog.css'

const { Title } = Typography

function AddBlog() {
  const { t } = useTranslation()

  return (
    <Flex vertical className="admin-add-blog">
      <Title level={1} className="admin-add-blog-title">
        {t('admin.addBlog.title')}
      </Title>

      <BlogForm />
    </Flex>
  )
}

export default AddBlog
