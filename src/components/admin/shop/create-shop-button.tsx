"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShopDialog } from "./shop-dialog"

export function CreateShopButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Product
      </Button>
      <ShopDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
