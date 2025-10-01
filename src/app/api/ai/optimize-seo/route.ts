import { NextRequest, NextResponse } from 'next/server'
import { AIContentService } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { content, targetKeywords } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const optimized = await AIContentService.optimizeSEO({
      content,
      targetKeywords: targetKeywords || []
    })
    
    return NextResponse.json(optimized)
  } catch (error) {
    console.error('Error in optimize-seo API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to optimize SEO' },
      { status: 500 }
    )
  }
}
