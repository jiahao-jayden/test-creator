import type { blogs } from "@/db/schema"

export type Blog = typeof blogs.$inferSelect

export type CreateBlogInput = {
  title: string
  slug: string
  content: string
  excerpt?: string
  author?: string
  tags?: string[]
  published?: string
}

export type UpdateBlogInput = {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  author?: string
  tags?: string[]
  published?: string
}

export type BlogListResponse = {
  success: boolean
  data: Blog[]
  pagination: {
    limit: number
    offset: number
    total: number
  }
}

export type BlogResponse = {
  success: boolean
  data: Blog
}

export type ErrorResponse = {
  success: false
  error: string
  details?: unknown
}
