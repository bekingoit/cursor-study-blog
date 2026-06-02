import React from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Typography, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { Navbar, Footer, Loader } from '@/components'
import { useBlog, useComments } from '@/hooks'
import { LAYOUT } from '@/constants/ui'
import { BlogHeader, BlogContent, CommentForm, CommentList } from './components'

const { Title } = Typography

function BlogDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { blog, loading: blogLoading } = useBlog(id)
  const { comments, loading: commentsLoading, refetch } = useComments(id)
  const { token } = theme.useToken()

  if (blogLoading || !blog) {
    return <Loader />
  }

  return (
    <Flex
      vertical
      style={{ background: token.colorBgBase, minHeight: '100vh' }}
    >
      <Navbar />

      <Flex
        vertical
        align="center"
        gap={token.marginXL * 2}
        style={{ flex: 1, padding: `${token.marginXL * 2}px 0` }}
      >
        <Flex
          vertical
          align="center"
          gap={token.marginXL}
          style={{ width: '100%', maxWidth: 1376, padding: `0 ${token.paddingLG}px` }}
        >
          <BlogHeader blog={blog} />

          <BlogContent content={blog.description} />

          <Flex
            vertical
            align="center"
            gap={token.marginXL}
            style={{ width: '100%', maxWidth: LAYOUT.COMMENTS_MAX_WIDTH }}
          >
            <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
              {t('blogDetail.comments.title')}
            </Title>

            <CommentForm blogId={id} onSuccess={refetch} />

            <CommentList comments={comments} loading={commentsLoading} />
          </Flex>
        </Flex>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default BlogDetail

