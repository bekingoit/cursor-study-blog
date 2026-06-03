import { z } from 'zod'

const MAX_COMMENT_LENGTH = 650

export function createCommentSchema(t) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t('validation.nameRequired'))
      .min(2, t('validation.nameMin')),
    content: z
      .string()
      .trim()
      .min(1, t('validation.commentRequired'))
      .min(5, t('validation.commentMin'))
      .max(MAX_COMMENT_LENGTH, t('validation.commentMax'))
  })
}
