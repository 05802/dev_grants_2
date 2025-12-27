# Agent Handover: PEN Grant Platform

## Project Overview

**PEN** is an internal tool for writing grant applications with AI assistance. It uses a "test-driven" approach where evaluation criteria become tests for grant content.

**Repository**: `dev_grants_2`
**Current Branch**: `claude/review-implementation-efficiency-1sijm`
**Status**: Ready for Cloudflare deployment

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  React + TypeScript + Vite                                  │
│  - QuestionEditor: Write/edit grant responses               │
│  - ModelSelector: Choose AI model per task                  │
│  - VersionControl: Switch between answer versions           │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ fetch('/api/llm', { ... })
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Pages Function                       │
│              functions/api/llm.ts                           │
│                                                             │
│  - Receives: { provider, model, messages, system, ... }    │
│  - Adds API key from env vars                              │
│  - Proxies to OpenAI or Anthropic                          │
│  - Returns response                                         │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   OpenAI API            │     │   Anthropic API         │
│   api.openai.com        │     │   api.anthropic.com     │
└─────────────────────────┘     └─────────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| `functions/api/llm.ts` | Cloudflare Pages Function - proxies LLM API calls |
| `src/config/models.json` | AI model definitions (edit to add/modify models) |
| `src/services/ai/llmOrchestrator.ts` | Frontend LLM client (calls /api/llm) |
| `src/stores/applicationStore.ts` | Zustand store for grant application state |
| `public/_redirects` | SPA routing fallback |
| `CONFIG.md` | Quick configuration reference |

---

## Task 1: Initialize Cloudflare Pages

### Prerequisites
- Cloudflare account (free tier is sufficient)
- GitHub repository access
- API keys: OpenAI and/or Anthropic

### Step 1: Install Wrangler CLI (if not installed)

```bash
npm install -g wrangler
wrangler --version
```

### Step 2: Authenticate with Cloudflare

```bash
wrangler login
# Browser opens for OAuth
wrangler whoami
# Should show your Cloudflare account
```

### Step 3: Create Cloudflare Pages Project

**Option A: Via Cloudflare Dashboard (Recommended for first setup)**

1. Go to https://dash.cloudflare.com → Pages
2. Click "Create a project" → "Connect to Git"
3. Authorize GitHub access if prompted
4. Select the `dev_grants_2` repository
5. Configure build settings:

| Setting | Value |
|---------|-------|
| Project name | `pen-grant-platform` |
| Production branch | `main` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |

6. Click "Save and Deploy"

**Option B: Via Wrangler CLI**

```bash
cd /path/to/dev_grants_2
wrangler pages project create pen-grant-platform
# Follow prompts, select GitHub integration
```

### Step 4: Configure Environment Variables

Go to Cloudflare Dashboard → Pages → pen-grant-platform → Settings → Environment Variables

Add these variables for **Production** environment:

| Variable | Value | Encrypt |
|----------|-------|---------|
| `OPENAI_API_KEY` | `sk-...` | Yes |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Yes |
| `NODE_VERSION` | `20` | No |

**Note**: Variable names do NOT have `VITE_` prefix - they're server-side only.

### Step 5: Trigger Initial Deployment

If not already deployed, push to trigger:

```bash
git push origin main
```

Or trigger manually in Dashboard → Deployments → "Retry deployment"

### Step 6: Verify Deployment

1. Check deployment logs in Cloudflare Dashboard
2. Once deployed, visit the provided URL (e.g., `https://pen-grant-platform.pages.dev`)
3. Open browser DevTools → Network tab
4. Click "Generate" on a question
5. Verify `/api/llm` request succeeds (200 status)

---

## Task 2: Local Development Setup

### Step 1: Install Dependencies

```bash
cd /path/to/dev_grants_2
npm install
```

### Step 2: Create Local Environment File

```bash
cp .env.example .dev.vars
```

Edit `.dev.vars`:
```
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
```

### Step 3: Run Development Server

**Frontend only** (no API proxy):
```bash
npm run dev
# http://localhost:5173
# API calls will fail - use for UI development only
```

**Full stack with Functions** (recommended):
```bash
npx wrangler pages dev dist --live-reload
# Build first if needed: npm run build
```

Or use this combined approach:
```bash
# Terminal 1: Build in watch mode
npm run build -- --watch

# Terminal 2: Run wrangler with live reload
npx wrangler pages dev dist
```

---

## Task 3: First-Use Testing Checklist

After deployment, verify these work:

### Basic Functionality
- [ ] App loads without console errors
- [ ] Questions display in sidebar
- [ ] Word counter updates as you type
- [ ] Model selector dropdown works

### AI Integration
- [ ] Select a question
- [ ] Choose an AI model (e.g., "GPT-4o")
- [ ] Click "Generate"
- [ ] Verify response appears
- [ ] Check Network tab: `/api/llm` returns 200

### Version Control
- [ ] Generate multiple versions
- [ ] Switch between versions
- [ ] Verify content changes correctly

### Error Handling
- [ ] Test with invalid API key → should show error message
- [ ] Test with missing API key → should show "not configured" error

---

## Task 4: Common Issues & Solutions

### Issue: "OPENAI_API_KEY not configured"

**Cause**: Environment variable not set in Cloudflare
**Fix**:
1. Dashboard → Pages → Settings → Environment Variables
2. Add `OPENAI_API_KEY` (not `VITE_OPENAI_API_KEY`)
3. Redeploy

### Issue: 404 on `/api/llm`

**Cause**: Functions not deployed
**Fix**:
1. Verify `functions/api/llm.ts` exists
2. Check Cloudflare build logs for errors
3. Ensure build output includes functions

### Issue: CORS errors in console

**Cause**: Browser trying to call API directly
**Fix**: This shouldn't happen with current architecture. Check:
1. `llmOrchestrator.ts` uses `fetch('/api/llm', ...)`
2. Not calling external APIs from browser

### Issue: Build fails on Cloudflare

**Cause**: Usually Node version or dependency issues
**Fix**:
1. Set `NODE_VERSION=20` in environment variables
2. Test build locally: `npm run build`
3. Check Cloudflare build logs

### Issue: Local dev API calls fail

**Cause**: Running `npm run dev` instead of wrangler
**Fix**: Use `wrangler pages dev dist` for full stack

---

## Task 5: Next Development Steps

### Immediate (Ready to implement)

1. **Evaluation System**: Implement scoring against criteria
   - Files: `src/stores/applicationStore.ts` (has `evaluationResults`)
   - Add evaluation prompts to `src/services/ai/prompts.ts`

2. **Logframe Generator**: AI-assisted logical framework creation
   - Add new prompts for logframe generation
   - Build UI component for logframe editing

3. **Export Functionality**: PDF/DOCX export
   - Add dependencies: `npm install jspdf docx`
   - Create export service

### Future Enhancements

- Streaming responses (SSE from Cloudflare Function)
- Rate limiting on API proxy
- Usage tracking/analytics
- Multi-user collaboration

---

## Configuration Quick Reference

### Add a New AI Model

Edit `src/config/models.json`:

```json
{
  "id": "my-new-model",
  "name": "Display Name",
  "provider": "openai",
  "contextWindow": 128000,
  "parameters": {
    "modelName": "gpt-4o-mini",
    "temperature": 0.7,
    "maxTokens": 4000
  }
}
```

### Add a New LLM Provider

1. Update `functions/api/llm.ts`:
```typescript
if (provider === 'my-provider') {
  // Add API call logic
}
```

2. Add model config to `src/config/models.json`
3. Add env var to Cloudflare

### Modify API Proxy Behavior

Edit `functions/api/llm.ts`:
- Add request validation
- Modify request/response transformation
- Add logging or rate limiting

---

## Environment Variables Summary

| Variable | Where | Purpose |
|----------|-------|---------|
| `OPENAI_API_KEY` | Cloudflare env vars | OpenAI API access |
| `ANTHROPIC_API_KEY` | Cloudflare env vars | Anthropic API access |
| `NODE_VERSION` | Cloudflare env vars | Build Node version |

For local dev, copy these to `.dev.vars` file.

---

## Commands Reference

```bash
# Development
npm run dev              # Vite dev server (frontend only)
npm run build            # Production build
npm run preview          # Preview production build
npx wrangler pages dev dist  # Full stack with Functions

# Deployment
git push origin main     # Triggers Cloudflare deployment

# Cloudflare CLI
wrangler login           # Authenticate
wrangler whoami          # Check auth status
wrangler pages project list              # List projects
wrangler pages deployment list --project-name=pen-grant-platform
```

---

## Repository Structure

```
dev_grants_2/
├── functions/
│   └── api/
│       └── llm.ts              # API proxy (Cloudflare Function)
├── public/
│   └── _redirects              # SPA routing
├── src/
│   ├── config/
│   │   └── models.json         # AI model definitions
│   ├── components/
│   │   ├── ui/                 # Base components
│   │   ├── editor/             # Question editor
│   │   └── shared/             # Model selector
│   ├── services/
│   │   ├── ai/
│   │   │   ├── llmOrchestrator.ts  # LLM client
│   │   │   └── prompts.ts          # Prompt templates
│   │   └── generator/
│   │       └── contentGenerator.ts # Content generation
│   ├── stores/
│   │   ├── applicationStore.ts # Main state
│   │   └── aiStore.ts          # AI preferences
│   └── types/                  # TypeScript definitions
├── .dev.vars                   # Local env vars (git-ignored)
├── .env.example                # Env var template
├── CONFIG.md                   # Quick config reference
├── HANDOVER.md                 # This document
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Contact & Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Cloudflare Functions**: https://developers.cloudflare.com/pages/functions/
- **Vite Docs**: https://vitejs.dev/
- **Zustand Docs**: https://zustand-demo.pmnd.rs/

---

*Last Updated: 2024-12-27*
*Status: Ready for Cloudflare deployment*
