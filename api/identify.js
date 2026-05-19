export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { images, prompt } = req.body

    const messages = [{
      role: 'user',
      content: [
        ...images.map(img => ({
          type: 'image',
          source: { type: 'base64', media_type: img.type, data: img.b64 }
        })),
        { type: 'text', text: prompt }
      ]
    }]

    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages,
    }

    // Add web search for listing/pricing calls (no images = pricing call)
    if (images.length === 0) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search' }]
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
