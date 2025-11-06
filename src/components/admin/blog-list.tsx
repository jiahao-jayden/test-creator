"use client"

import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useBlogs } from "@/hooks/use-blogs"
import type { Blog } from "@/types/blog"
import { BlogDialog } from "./blog-dialog"
import { DeleteBlogDialog } from "./delete-blog-dialog"

export function BlogList() {
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null)

  const { data: blogs, isLoading } = useBlogs({ limit: 100 })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No blogs yet</p>
        <p className="text-muted-foreground text-sm mt-2">
          Create your first blog post to get started
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            className="flex flex-col"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">/{blog.slug}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {blog.excerpt ? (
                <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
              ) : (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {blog.content.substring(0, 150)}...
                </p>
              )}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-secondary rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <div className="text-xs text-muted-foreground">
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingBlog(blog)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletingBlog(blog)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <BlogDialog
        blog={editingBlog}
        open={!!editingBlog}
        onOpenChange={(open) => !open && setEditingBlog(null)}
      />

      <DeleteBlogDialog
        blog={deletingBlog}
        open={!!deletingBlog}
        onOpenChange={(open) => !open && setDeletingBlog(null)}
      />
    </>
  )
}
