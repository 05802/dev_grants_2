# Configuration

## Deployment (Cloudflare Pages)

1. Connect repo to Cloudflare Pages via dashboard
2. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `20`
3. Environment variables (Settings → Environment Variables):
   - `OPENAI_API_KEY` - OpenAI key
   - `ANTHROPIC_API_KEY` - Anthropic key

Deploys automatically on push.

## Local Development

```bash
npm install
npm run dev          # http://localhost:5173
wrangler pages dev   # Test with Functions
```

## AI Models

Edit `src/config/models.json` to add/modify models:

```json
{
  "id": "my-model",
  "name": "Display Name",
  "provider": "openai",        // or "anthropic"
  "contextWindow": 128000,
  "parameters": {
    "modelName": "gpt-4o",     // API model ID
    "temperature": 0.7,
    "maxTokens": 4000
  }
}
```

## File Structure

```
functions/api/llm.ts   - API proxy (runs on Cloudflare edge)
src/config/models.json - Model definitions
src/services/ai/       - LLM orchestration
public/_redirects      - SPA routing
```

## Architecture

```
Browser → /api/llm → Cloudflare Function → OpenAI/Anthropic API
              ↓
         API keys stored in
         Cloudflare env vars
         (never exposed to client)
```
