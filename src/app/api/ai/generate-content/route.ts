import { NextRequest, NextResponse } from 'next/server'
import { AIContentService } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { topic, tone, length, keywords } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const content = await AIContentService.generateContent({
      topic,
      tone: tone || 'professional',
      length: length || 'medium',
      keywords: keywords || []
    })
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error in generate-content API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    )
  }
}
