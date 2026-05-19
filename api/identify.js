export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

const ANTHROPIC_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': process.env.ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-beta': 'web-search-2025-03-05',
}

async function callAnthropic(body) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: ANTHROPIC_HEADERS,
    body: JSON.stringify(body),
  })
  const text = await response.text()
  let data
  try { data = JSON.parse(text) } catch { data = { error: { message: text } } }
  return { ok: response.ok, status: response.status, data }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { images, prompt, system } = req.body
    const isListingCall = images.length === 0

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
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      ...(system && { system }),
      messages,
    }

    if (isListingCall) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search' }]
    }

    // Loop to handle multi-turn tool_use (web search makes multiple turns)
    let lastData
    for (let i = 0; i < 5; i++) {
      const { ok, status, data } = await callAnthropic(body)
      lastData = data

      if (!ok) return res.status(status).json(data)

      // If Claude is done, return final response
      if (data.stop_reason !== 'tool_use') {
        return res.status(200).json(data)
      }

      // Append assistant turn + tool results and loop
      messages.push({ role: 'assistant', content: data.content })
      const toolResults = data.content
        .filter(b => b.type === 'tool_use')
        .map(b => ({ type: 'tool_result', tool_use_id: b.id, content: '' }))
      messages.push({ role: 'user', content: toolResults })
      body.messages = messages
    }

    // Fallback: return whatever we have
    res.status(200).json(lastData)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
