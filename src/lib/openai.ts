import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

const openai = new OpenAI({
  apiKey: apiKey,
})

export interface ContentGenerationOptions {
  topic: string
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative'
  length?: 'short' | 'medium' | 'long'
  keywords?: string[]
}

export interface SEOOptimizationOptions {
  content: string
  targetKeywords?: string[]
}

export class AIContentService {
  // Generate blog post content
  static async generateContent(options: ContentGenerationOptions): Promise<{
    title: string
    content: string
    excerpt: string
    seoTitle: string
    seoDescription: string
    tags: string[]
  }> {
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please check your environment variables.')
    }

    const { topic, tone = 'professional', length = 'medium', keywords = [] } = options

    const lengthInstructions = {
      short: 'Write a concise article (300-500 words)',
      medium: 'Write a comprehensive article (800-1200 words)',
      long: 'Write a detailed article (1500-2500 words)'
    }

    const toneInstructions = {
      professional: 'Use a professional and authoritative tone',
      casual: 'Use a casual and conversational tone',
      friendly: 'Use a warm and approachable tone',
      authoritative: 'Use an expert and confident tone'
    }

    const prompt = `
Write a ${tone} blog post about "${topic}".

Requirements:
- ${lengthInstructions[length]}
- ${toneInstructions[tone]}
- Include relevant keywords: ${keywords.join(', ')}
- Make it engaging and valuable for readers
- Include practical insights and actionable advice

Please provide the response in this exact JSON format:
{
  "title": "Compelling blog post title",
  "content": "Full blog post content with proper formatting",
  "excerpt": "Brief 2-3 sentence summary",
  "seoTitle": "SEO-optimized title (50-60 characters)",
  "seoDescription": "SEO meta description (150-160 characters)",
  "tags": ["tag1", "tag2", "tag3"]
}
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer and SEO specialist. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      console.log('OpenAI Response:', response) // Debug log

      // Try to parse JSON, with fallback handling
      try {
        const parsed = JSON.parse(response)
        return parsed
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        console.error('Raw Response:', response)
        
        // Fallback: try to extract JSON from response if it's wrapped in markdown
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0])
          } catch (e) {
            console.error('Fallback JSON parse failed:', e)
          }
        }
        
        throw new Error('Invalid JSON response from AI')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      if (error instanceof Error) {
        throw new Error(`Failed to generate content: ${error.message}`)
      }
      throw new Error('Failed to generate content')
    }
  }

  // Optimize content for SEO
  static async optimizeSEO(options: SEOOptimizationOptions): Promise<{
    optimizedTitle: string
    optimizedDescription: string
    suggestions: string[]
    keywordDensity: Record<string, number>
  }> {
    const { content, targetKeywords = [] } = options

    const prompt = `
Analyze this content for SEO optimization:

Content: "${content}"

Target keywords: ${targetKeywords.join(', ')}

Please provide the response in this exact JSON format:
{
  "optimizedTitle": "SEO-optimized title (50-60 characters)",
  "optimizedDescription": "SEO meta description (150-160 characters)",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "keywordDensity": {"keyword1": 0.02, "keyword2": 0.015}
}
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Analyze content and provide optimization suggestions. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(response)
    } catch (error) {
      console.error('Error optimizing SEO:', error)
      throw new Error('Failed to optimize SEO')
    }
  }

  // Generate content ideas
  static async generateIdeas(topic: string, count: number = 5): Promise<string[]> {
    const prompt = `
Generate ${count} engaging blog post ideas about "${topic}".

Requirements:
- Make them specific and actionable
- Focus on trending or evergreen topics
- Consider different angles and perspectives
- Make titles compelling and click-worthy

Return as a JSON array of strings:
["idea1", "idea2", "idea3", "idea4", "idea5"]
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative content strategist. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(response)
    } catch (error) {
      console.error('Error generating ideas:', error)
      throw new Error('Failed to generate ideas')
    }
  }

  // Improve existing content
  static async improveContent(content: string): Promise<{
    improvedContent: string
    improvements: string[]
  }> {
    const prompt = `
Improve this blog post content for better readability, engagement, and SEO:

Content: "${content}"

Please provide the response in this exact JSON format:
{
  "improvedContent": "Enhanced version of the content",
  "improvements": ["improvement1", "improvement2", "improvement3"]
}
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert editor and content strategist. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(response)
    } catch (error) {
      console.error('Error improving content:', error)
      throw new Error('Failed to improve content')
    }
  }
}
