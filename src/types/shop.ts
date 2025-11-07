import type { shops } from "@/db/schema"

export type Shop = typeof shops.$inferSelect

export type CreateShopInput = {
  name: string
  image: string
  price: string
  description: string
}

export type UpdateShopInput = {
  name?: string
  image?: string
  price?: string
  description?: string
}

export type ShopListResponse = {
  success: boolean
  data: Shop[]
  pagination: {
    limit: number
    offset: number
    total: number
  }
}

export type ShopResponse = {
  success: boolean
  data: Shop
}

export type ErrorResponse = {
  success: false
  error: string
  details?: unknown
}
