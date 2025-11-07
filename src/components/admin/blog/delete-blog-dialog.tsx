"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteBlog } from "@/hooks/use-blogs"
import type { Blog } from "@/types/blog"

interface DeleteBlogDialogProps {
  blog: Blog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBlogDialog({ blog, open, onOpenChange }: DeleteBlogDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteBlog = useDeleteBlog()

  async function handleDelete() {
    if (!blog) return

    setIsDeleting(true)
    try {
      await deleteBlog.mutateAsync(blog.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting blog:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Blog</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{blog?.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
