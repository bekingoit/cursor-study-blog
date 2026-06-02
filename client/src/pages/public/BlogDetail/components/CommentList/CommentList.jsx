import React from 'react'
import { List, Typography, Flex, Spin, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { DATE_FORMATS } from '@/constants/ui'
import './CommentList.css'

const { Text, Paragraph } = Typography

function CommentList({ comments, loading }) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Flex justify="center" className="comment-list-loading">
        <Spin />
      </Flex>
    )
  }

  if (!comments.length) {
    return (
      <Empty
        description={t('blogDetail.comments.noComments')}
        className="comment-list-empty"
      />
    )
  }

  return (
    <Flex vertical gap="middle" className="comment-list">
      <List
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item className="comment-list-item">
            <Flex vertical gap="small" className="comment-list-item-content">
              <Flex justify="space-between" align="center" wrap="wrap" gap="small">
                <Text strong>{comment.name}</Text>
                <Text type="secondary">
                  {moment(comment.createdAt).format(DATE_FORMATS.DISPLAY)}
                </Text>
              </Flex>
              <Paragraph className="comment-list-item-text">
                {comment.content}
              </Paragraph>
            </Flex>
          </List.Item>
        )}
      />
    </Flex>
  )
}

export default CommentList
