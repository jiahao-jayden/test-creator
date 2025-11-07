import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import db from "@/db"
import { blogs } from "@/db/schema"

const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: blog,
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog",
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateBlogSchema.parse(body)

    const [existingBlog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)

    if (!existingBlog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      )
    }

    if (validatedData.slug && validatedData.slug !== existingBlog.slug) {
      const [duplicateBlog] = await db
        .select()
        .from(blogs)
        .where(eq(blogs.slug, validatedData.slug))
        .limit(1)

      if (duplicateBlog) {
        return NextResponse.json(
          {
            success: false,
            error: "Slug already exists",
          },
          { status: 400 }
        )
      }
    }

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id))
      .returning()

    return NextResponse.json({
      success: true,
      data: updatedBlog,
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

    console.error("Error updating blog:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update blog",
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

    const [existingBlog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)

    if (!existingBlog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      )
    }

    await db.delete(blogs).where(eq(blogs.id, id))

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete blog",
      },
      { status: 500 }
    )
  }
}
