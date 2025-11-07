"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BlogDialog } from "./blog-dialog"

export function CreateBlogButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Blog
      </Button>
      <BlogDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
