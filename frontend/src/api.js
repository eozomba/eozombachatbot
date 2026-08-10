const BASE = '/api'

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function createSession() {
  const res = await fetch(`${BASE}/session`, { method: 'POST' })
  return handle(res)
}

export async function sendMessage(message, sessionId) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
  })
  return handle(res)
}

export async function getQuickTopics() {
  const res = await fetch(`${BASE}/quick-topics`)
  return handle(res)
}

export async function getHistory(sessionId) {
  const res = await fetch(`${BASE}/chat/history/${sessionId}`)
  return handle(res)
}

export async function getFaqs(category = 'all', search = '') {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.append('category', category)
  if (search) params.append('search', search)
  const res = await fetch(`${BASE}/faqs?${params.toString()}`)
  return handle(res)
}

export async function getDepartments() {
  const res = await fetch(`${BASE}/departments`)
  return handle(res)
}

export async function estimateFees(payload) {
  const res = await fetch(`${BASE}/tools/estimate-fees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handle(res)
}

