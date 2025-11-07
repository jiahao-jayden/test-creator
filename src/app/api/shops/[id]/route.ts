import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import db from "@/db"
import { shops } from "@/db/schema"

const updateShopSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const [shop] = await db.select().from(shops).where(eq(shops.id, id)).limit(1)

    if (!shop) {
      return NextResponse.json(
        {
          success: false,
          error: "Shop not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: shop,
    })
  } catch (error) {
    console.error("Error fetching shop:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shop",
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateShopSchema.parse(body)

    const [existingShop] = await db.select().from(shops).where(eq(shops.id, id)).limit(1)

    if (!existingShop) {
      return NextResponse.json(
        {
          success: false,
          error: "Shop not found",
        },
        { status: 404 }
      )
    }

    const [updatedShop] = await db
      .update(shops)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(shops.id, id))
      .returning()

    return NextResponse.json({
      success: true,
      data: updatedShop,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error("Error updating shop:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update shop",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [existingShop] = await db.select().from(shops).where(eq(shops.id, id)).limit(1)

    if (!existingShop) {
      return NextResponse.json(
        {
          success: false,
          error: "Shop not found",
        },
        { status: 404 }
      )
    }

    await db.delete(shops).where(eq(shops.id, id))

    return NextResponse.json({
      success: true,
      message: "Shop deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting shop:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete shop",
      },
      { status: 500 }
    )
  }
}
