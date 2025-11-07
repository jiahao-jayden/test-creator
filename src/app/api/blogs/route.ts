import { desc, eq, ilike, or } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import db from "@/db"
import { blogs } from "@/db/schema"

const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const tag = searchParams.get("tag")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = db.select().from(blogs).$dynamic()

    if (search) {
      query = query.where(
        or(
          ilike(blogs.title, `%${search}%`),
          ilike(blogs.content, `%${search}%`),
          ilike(blogs.excerpt, `%${search}%`)
        )
      )
    }

    const results = await query.orderBy(desc(blogs.createdAt)).limit(limit).offset(offset)

    let filteredResults = results
    if (tag) {
      filteredResults = results.filter((blog) => blog.tags?.includes(tag))
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
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBlogSchema.parse(body)

    const existingBlog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, validatedData.slug))
      .limit(1)

    if (existingBlog.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug already exists",
        },
        { status: 400 }
      )
    }

    const [newBlog] = await db
      .insert(blogs)
      .values({
        ...validatedData,
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: newBlog,
      },
      { status: 201 }
    )
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

    console.error("Error creating blog:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create blog",
      },
      { status: 500 }
    )
  }
}
