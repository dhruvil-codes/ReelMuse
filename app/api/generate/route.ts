import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { topic } = await req.json()

  if (!topic) {
    return NextResponse.json({ error: 'No topic provided' }, { status: 400 })
  }

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `You are an expert in viral short-form video scripting. 

Return exactly 3 ideas in the following JSON format:

[
  {
    "id": 1,
    "hook": "...",
    "summary": "...",
    "fullScript": {
      "hook": "...",
      "body": "...",
      "ending": "..."
    },
    "musicSuggestions": ["...", "...", "..."],
    "brollPrompts": ["...", "...", "..."]
  },
  ...
]

Return ONLY JSON, no extra text.`
          },
          {
            role: 'user',
            content: `Give me 3 video ideas for: ${topic}`
          }
        ]
      })
    })

    const data = await aiResponse.json()
    const raw = data.choices?.[0]?.message?.content || '[]'

    let ideas = []
    try {
      ideas = JSON.parse(raw)
    } catch (parseError) {
      console.error('❌ Failed to parse JSON from OpenAI:', raw)
      return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 500 })
    }

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('❌ Backend Error:', error)
    return NextResponse.json({ error: 'Something went wrong in the backend' }, { status: 500 })
  }
}
