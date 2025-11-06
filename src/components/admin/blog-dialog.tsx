"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { fileUtils } from "@wecode-team/we0-lib"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { Textarea } from "@/components/ui/textarea"
import { useCreateBlog, useUpdateBlog } from "@/hooks/use-blogs"
import type { Blog } from "@/types/blog"

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  tags: z.string().optional(),
  coverImage: z.string().optional(),
})

type BlogFormValues = z.infer<typeof blogFormSchema>

interface BlogDialogProps {
  blog?: Blog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BlogDialog({ blog, open, onOpenChange }: BlogDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const createBlog = useCreateBlog()
  const updateBlog = useUpdateBlog()
  const isSubmitting = createBlog.isPending || updateBlog.isPending

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      author: "",
      tags: "",
      coverImage: "",
    },
  })

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt || "",
        author: blog.author || "",
        tags: blog.tags?.join(", ") || "",
        coverImage: (blog as any).coverImage || "",
      })
      setUploadedFiles([])
    } else {
      form.reset({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author: "",
        tags: "",
        coverImage: "",
      })
      setUploadedFiles([])
    }
  }, [blog, form])

  async function onSubmit(data: BlogFormValues) {
    try {
      const payload = {
        ...data,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      }

      if (blog) {
        await updateBlog.mutateAsync({ id: blog.id, data: payload })
      } else {
        await createBlog.mutateAsync(payload)
      }

      onOpenChange(false)

      if (!blog) {
        form.reset()
      }
    } catch (error) {
      console.error("Error submitting blog:", error)
    }
  }

  const handleTitleChange = (value: string) => {
    form.setValue("title", value)
    if (!blog) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      form.setValue("slug", slug)
    }
  }

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return

    setIsUploading(true)
    try {
      const file = files[0]
      const result = await fileUtils.uploadFile(file)
      form.setValue("coverImage", result.url)
      setUploadedFiles(files)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blog ? "Edit Blog" : "Create New Blog"}</DialogTitle>
          <DialogDescription>
            {blog
              ? "Update your blog post details below"
              : "Fill in the details to create a new blog post"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My awesome blog post"
                      {...field}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-awesome-blog-post"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version of the title (lowercase, hyphens only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short summary of your blog post..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={() => (
                <FormItem>
                  <FormLabel>Cover Image (Optional)</FormLabel>
                  <FormControl>
                    <Dropzone
                      accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] }}
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      onDrop={handleImageUpload}
                      src={uploadedFiles}
                      disabled={isUploading}
                    >
                      <DropzoneContent />
                      <DropzoneEmptyState />
                    </Dropzone>
                  </FormControl>
                  <FormDescription>
                    {isUploading
                      ? "Uploading..."
                      : "Upload a cover image for your blog post (max 5MB)"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="# Your blog content here...&#10;&#10;You can use **markdown** syntax!"
                      className="font-mono text-sm resize-none"
                      rows={15}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Write your content using Markdown syntax</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tech, tutorial, react"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Comma-separated tags</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
