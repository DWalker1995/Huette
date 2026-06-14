// api/claude.js — Vercel serverless function
// Proxies requests to Anthropic API, keeping your key server-side

const ALLOWED_ORIGINS = [
  'https://myhuette.com',
  'https://www.myhuette.com',
  // Keep localhost for local dev
  'http://localhost:3000',
  'http://localhost:5173',
];

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Block requests from disallowed origins
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY environment variable is not set.' });
  }

  try {
    const body = req.body;

    // Validate the request has at least a model and messages
    if (!body?.model || !body?.messages) {
      return res.status(400).json({ error: 'Request must include model and messages.' });
    }

    // Rate limit guard: cap max_tokens to prevent runaway costs
    if (body.max_tokens && body.max_tokens > 2000) {
      body.max_tokens = 2000;
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({
        error: data?.error?.message || 'Anthropic API error',
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
