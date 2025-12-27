# PEN - Grant Application Platform

IDE for writing grant applications using AI assistance. Uses a "test-driven" approach where evaluation criteria become tests for your content.

## Quick Start

```bash
npm install
npm run dev
```

Configure API keys and deploy: see [CONFIG.md](./CONFIG.md)

## Features

- **AI-Assisted Writing**: Generate and iterate on grant responses
- **Configurable Models**: Use GPT-4, Claude, etc. for different tasks
- **Version Control**: Track all versions of each answer
- **Word Count**: Real-time tracking with visual limits
- **Evaluation**: Test responses against scoring criteria

## How It Works

1. Select a grant question
2. Choose an AI model
3. Generate content
4. Edit and refine
5. Switch between versions as needed

## Tech Stack

- React + TypeScript + Vite
- Zustand (state)
- Tailwind + Radix UI
- Cloudflare Pages + Functions

## Project Structure

```
src/
  config/models.json     # AI model configs (edit to add models)
  services/ai/           # LLM orchestration
  stores/                # Zustand state
  components/            # UI
functions/
  api/llm.ts             # API proxy (Cloudflare Function)
```
