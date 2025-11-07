import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import db from "@/db"
import { blogs } from "@/db/schema"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1)

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
    console.error("Error fetching blog by slug:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog",
      },
      { status: 500 }
    )
  }
}
