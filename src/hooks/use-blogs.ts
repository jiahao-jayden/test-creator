import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Blog, CreateBlogInput, UpdateBlogInput } from "@/types/blog"

const BLOGS_QUERY_KEY = ["blogs"] as const

async function fetchBlogs(params?: {
  search?: string
  tag?: string
  limit?: number
  offset?: number
}) {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set("search", params.search)
  if (params?.tag) searchParams.set("tag", params.tag)
  if (params?.limit) searchParams.set("limit", params.limit.toString())
  if (params?.offset) searchParams.set("offset", params.offset.toString())

  const url = `/api/blogs${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch blogs")
  }

  const data = await response.json()
  return data.data as Blog[]
}

async function fetchBlogById(id: string) {
  const response = await fetch(`/api/blogs/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch blog")
  }

  const data = await response.json()
  return data.data as Blog
}

async function fetchBlogBySlug(slug: string) {
  const response = await fetch(`/api/blogs/slug/${slug}`)

  if (!response.ok) {
    throw new Error("Failed to fetch blog")
  }

  const data = await response.json()
  return data.data as Blog
}

async function createBlog(data: CreateBlogInput) {
  const response = await fetch("/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create blog")
  }

  const result = await response.json()
  return result.data as Blog
}

async function updateBlog(id: string, data: UpdateBlogInput) {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update blog")
  }

  const result = await response.json()
  return result.data as Blog
}

async function deleteBlog(id: string) {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete blog")
  }

  return response.json()
}

export function useBlogs(params?: {
  search?: string
  tag?: string
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: [...BLOGS_QUERY_KEY, params],
    queryFn: () => fetchBlogs(params),
  })
}

export function useBlog(id: string | null) {
  return useQuery({
    queryKey: [...BLOGS_QUERY_KEY, id],
    queryFn: () => fetchBlogById(id!),
    enabled: !!id,
  })
}

export function useBlogBySlug(slug: string | null) {
  return useQuery({
    queryKey: [...BLOGS_QUERY_KEY, "slug", slug],
    queryFn: () => fetchBlogBySlug(slug!),
    enabled: !!slug,
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BLOGS_QUERY_KEY,
        refetchType: "active",
      })
    },
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogInput }) => updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BLOGS_QUERY_KEY,
        refetchType: "active",
      })
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BLOGS_QUERY_KEY,
        refetchType: "active",
      })
    },
  })
}
