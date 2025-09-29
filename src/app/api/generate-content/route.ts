import { NextRequest, NextResponse } from 'next/server'
import { AIContentService } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, tone, length, keywords } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const result = await AIContentService.generateContent({
      topic,
      tone: tone || 'professional',
      length: length || 'medium',
      keywords: keywords || []
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
