"use client"

import { BlogList } from "@/components/admin/blog-list"
import { CreateBlogButton } from "@/components/admin/create-blog-button"

export default function AdminPage() {
  return (
    <div className="w-full px-8 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground mt-2">Create, edit, and manage your blog posts</p>
        </div>
        <CreateBlogButton />
      </div>
      <BlogList />
    </div>
  )
}
