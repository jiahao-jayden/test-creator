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
import { useCreateShop, useUpdateShop } from "@/hooks/use-shops"
import type { Shop } from "@/types/shop"

const shopFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Image must be a valid URL"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),
  description: z.string().min(1, "Description is required"),
})

type ShopFormValues = z.infer<typeof shopFormSchema>

interface ShopDialogProps {
  shop?: Shop | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShopDialog({ shop, open, onOpenChange }: ShopDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const createShop = useCreateShop()
  const updateShop = useUpdateShop()
  const isSubmitting = createShop.isPending || updateShop.isPending

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: "",
      image: "",
      price: "",
      description: "",
    },
  })

  useEffect(() => {
    if (shop) {
      form.reset({
        name: shop.name,
        image: shop.image,
        price: shop.price,
        description: shop.description,
      })
      setUploadedFiles([])
    } else {
      form.reset({
        name: "",
        image: "",
        price: "",
        description: "",
      })
      setUploadedFiles([])
    }
  }, [shop, form])

  async function onSubmit(data: ShopFormValues) {
    try {
      if (shop) {
        await updateShop.mutateAsync({ id: shop.id, data })
      } else {
        await createShop.mutateAsync(data)
      }

      onOpenChange(false)

      if (!shop) {
        form.reset()
      }
    } catch (error) {
      console.error("Error submitting shop:", error)
    }
  }

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return

    setIsUploading(true)
    try {
      const file = files[0]
      const result = await fileUtils.uploadFile(file)
      form.setValue("image", result.url)
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
          <DialogTitle>{shop ? "Edit Product" : "Create New Product"}</DialogTitle>
          <DialogDescription>
            {shop
              ? "Update your product details below"
              : "Fill in the details to create a new product"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amazing Product"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="99.99"
                      type="number"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the price in decimal format (e.g., 99.99)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
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
                    {isUploading ? "Uploading..." : "Upload a product image (max 5MB)"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description here..."
                      className="resize-none"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Describe your product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isSubmitting ? "Saving..." : shop ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
