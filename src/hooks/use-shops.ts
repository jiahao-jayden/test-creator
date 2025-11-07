import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateShopInput, Shop, UpdateShopInput } from "@/types/shop"

const SHOPS_QUERY_KEY = ["shops"] as const

async function fetchShops(params?: {
  search?: string
  limit?: number
  offset?: number
  minPrice?: string
  maxPrice?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set("search", params.search)
  if (params?.limit) searchParams.set("limit", params.limit.toString())
  if (params?.offset) searchParams.set("offset", params.offset.toString())
  if (params?.minPrice) searchParams.set("minPrice", params.minPrice)
  if (params?.maxPrice) searchParams.set("maxPrice", params.maxPrice)

  const url = `/api/shops${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch shops")
  }

  const data = await response.json()
  return data.data as Shop[]
}

async function fetchShopById(id: string) {
  const response = await fetch(`/api/shops/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch shop")
  }

  const data = await response.json()
  return data.data as Shop
}

async function createShop(data: CreateShopInput) {
  const response = await fetch("/api/shops", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create shop")
  }

  const result = await response.json()
  return result.data as Shop
}

async function updateShop(id: string, data: UpdateShopInput) {
  const response = await fetch(`/api/shops/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update shop")
  }

  const result = await response.json()
  return result.data as Shop
}

async function deleteShop(id: string) {
  const response = await fetch(`/api/shops/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete shop")
  }

  return response.json()
}

export function useShops(params?: {
  search?: string
  limit?: number
  offset?: number
  minPrice?: string
  maxPrice?: string
}) {
  return useQuery({
    queryKey: [...SHOPS_QUERY_KEY, params],
    queryFn: () => fetchShops(params),
  })
}

export function useShop(id: string | null) {
  return useQuery({
    queryKey: [...SHOPS_QUERY_KEY, id],
    queryFn: () => fetchShopById(id!),
    enabled: !!id,
  })
}

export function useCreateShop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createShop,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SHOPS_QUERY_KEY,
        refetchType: "active",
      })
    },
  })
}

export function useUpdateShop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShopInput }) => updateShop(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SHOPS_QUERY_KEY,
        refetchType: "active",
      })
    },
  })
}

export function useDeleteShop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteShop,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SHOPS_QUERY_KEY,
        refetchType: "active",
      })
    },
  })
}
