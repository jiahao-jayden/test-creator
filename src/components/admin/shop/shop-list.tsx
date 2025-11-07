"use client"

import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useShops } from "@/hooks/use-shops"
import type { Shop } from "@/types/shop"
import { DeleteShopDialog } from "./delete-shop-dialog"
import { ShopDialog } from "./shop-dialog"

export function ShopList() {
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [deletingShop, setDeletingShop] = useState<Shop | null>(null)

  const { data: shops, isLoading } = useShops({ limit: 100 })

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
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!shops || shops.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products yet</p>
        <p className="text-muted-foreground text-sm mt-2">
          Create your first product to get started
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <Card
            key={shop.id}
            className="flex flex-col"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">{shop.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 font-semibold">${shop.price}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              {shop.image && (
                <div className="relative w-full h-48 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={shop.image}
                    alt={shop.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3">{shop.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <div className="text-xs text-muted-foreground">
                {new Date(shop.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingShop(shop)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletingShop(shop)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ShopDialog
        shop={editingShop}
        open={!!editingShop}
        onOpenChange={(open) => !open && setEditingShop(null)}
      />

      <DeleteShopDialog
        shop={deletingShop}
        open={!!deletingShop}
        onOpenChange={(open) => !open && setDeletingShop(null)}
      />
    </>
  )
}
