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
import { useDeleteShop } from "@/hooks/use-shops"
import type { Shop } from "@/types/shop"

interface DeleteShopDialogProps {
  shop: Shop | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteShopDialog({ shop, open, onOpenChange }: DeleteShopDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteShop = useDeleteShop()

  async function handleDelete() {
    if (!shop) return

    setIsDeleting(true)
    try {
      await deleteShop.mutateAsync(shop.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting shop:", error)
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
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{shop?.name}"? This action cannot be undone.
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
