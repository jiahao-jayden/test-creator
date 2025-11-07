import { desc, eq, ilike, or } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import db from "@/db"
import { shops } from "@/db/schema"

const createShopSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Image must be a valid URL"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),
  description: z.string().min(1, "Description is required"),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    let query = db.select().from(shops).$dynamic()

    if (search) {
      query = query.where(
        or(
          ilike(shops.name, `%${search}%`),
          ilike(shops.description, `%${search}%`),
        ),
      )
    }

    const results = await query.orderBy(desc(shops.createdAt)).limit(limit).offset(offset)

    let filteredResults = results
    if (minPrice || maxPrice) {
      filteredResults = results.filter((shop) => {
        const price = Number.parseFloat(shop.price)
        if (minPrice && price < Number.parseFloat(minPrice)) return false
        if (maxPrice && price > Number.parseFloat(maxPrice)) return false
        return true
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredResults,
      pagination: {
        limit,
        offset,
        total: filteredResults.length,
      },
    })
  } catch (error) {
    console.error("Error fetching shops:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shops",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createShopSchema.parse(body)

    const [newShop] = await db
      .insert(shops)
      .values({
        ...validatedData,
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: newShop,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 },
      )
    }

    console.error("Error creating shop:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create shop",
      },
      { status: 500 },
    )
  }
}
