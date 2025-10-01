import { NextRequest, NextResponse } from 'next/server'
import { AIContentService } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { topic, count } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const ideas = await AIContentService.generateIdeas(topic, count || 5)
    
    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Error in generate-ideas API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}
