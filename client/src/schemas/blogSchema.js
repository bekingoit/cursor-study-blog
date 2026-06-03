import { z } from 'zod'
import { isEmptyRichText, richTextPlainLength } from '@/utils/html'

export function createBlogPublishSchema(t) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, t('validation.titleRequired'))
      .min(3, t('validation.titleMin')),
    subTitle: z
      .string()
      .trim()
      .min(1, t('validation.subtitleRequired')),
    category: z
      .string()
      .trim()
      .min(1, t('validation.categoryRequired')),
    description: z
      .string()
      .refine((html) => !isEmptyRichText(html), {
        message: t('messages.error.blogDescription')
      })
      .refine((html) => richTextPlainLength(html) >= 10, {
        message: t('validation.descriptionMin')
      }),
    image: z
      .instanceof(File, { message: t('validation.thumbnailRequired') })
  })
}

export function createBlogDraftSchema(t) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, t('messages.error.blogTitleMin')),
    subTitle: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    image: z.union([z.instanceof(File), z.undefined(), z.null()]).optional()
  })
}
