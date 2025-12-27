# PEN - Grant Application Writing Platform

PEN is a specialized IDE-like web application for writing, testing, and iterating on grant applications. It uses an innovative "test-driven development" metaphor where evaluation criteria become "tests" for your grant application content.

## What's New

### Latest Updates (December 2025)
- ✅ **Cloudflare Pages Deployment**: Complete deployment handoff documentation added ([`CLOUDFLARE_DEPLOYMENT_HANDOFF.md`](./CLOUDFLARE_DEPLOYMENT_HANDOFF.md))
- ✅ **Enhanced Documentation**: Added detailed explanations of core functions and architecture
- ✅ **Deployment Ready**: Pre-configured for Git Integration workflow with automatic deployments

## Key Features

- **Configurable AI Models**: Use different AI models (GPT-4, GPT-3.5, Claude, etc.) for different tasks
- **Pane-Specific Model Selection**: Select different models for editing, evaluation, and logframe generation
- **Question Editor**: Write and generate grant application responses with AI assistance
- **Word Count Tracking**: Real-time word count with visual indicators for limits
- **Version Control**: Track different versions of your answers with full history
- **Evaluation System**: Test your responses against evaluation criteria
- **Logframe Support**: Create and manage logical frameworks
- **Cloud Deployment Ready**: Pre-configured for Cloudflare Pages deployment

## Architecture Highlights

### Configurable AI System

The platform uses a JSON configuration file (`src/config/models.json`) to define available AI models. This allows you to:

- Add new models without code changes
- Configure model-specific parameters (temperature, max tokens, etc.)
- Use different models for different contexts (editor vs evaluator)
- Switch between providers (OpenAI, Anthropic, custom)

### Simplified Editor

The editor focuses on whole-document or whole-section generation. Complex inline AI editing features are excluded to prioritize:

- Stability and reliability
- Flexibility in model configuration
- Clear separation of AI-assisted and manual editing

## Core Functions Explained

### AI Integration
- **LLMOrchestrator** (`src/services/ai/llmOrchestrator.ts`): Manages communication with AI providers (OpenAI, Anthropic). Handles API authentication, request formatting, and response parsing for different LLM providers.

- **ContentGenerator** (`src/services/generator/contentGenerator.ts`): Orchestrates AI-powered content generation for grant questions. Builds context from application details, applies evaluation criteria, and generates responses using selected AI models.

### State Management
- **ApplicationStore** (`src/stores/applicationStore.ts`): Central state management for grant applications using Zustand. Handles questions, answers, version control, and evaluation results.

- **AIStore** (`src/stores/aiStore.ts`): Manages AI model configurations and user preferences. Allows different model selection for different contexts (editor, evaluator, logframe).

### UI Components
- **QuestionEditor**: Main interface for writing and editing grant responses with AI assistance
- **WordCounter**: Real-time word count tracking with visual indicators when approaching limits
- **ModelSelector**: Dropdown interface for selecting AI models per context

### Content Generation Flow
1. User selects a grant question
2. Chooses preferred AI model from ModelSelector
3. ContentGenerator builds context from application data and evaluation criteria
4. LLMOrchestrator sends request to selected AI provider
5. Generated content is saved as a new version in ApplicationStore
6. User can edit, regenerate, or switch between versions

## Project Structure

```
pen-app/
├── src/
│   ├── config/              # Configuration files
│   │   └── models.json      # AI model definitions
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   ├── editor/          # Editor components
│   │   ├── shared/          # Shared components (ModelSelector)
│   │   └── ...
│   ├── stores/              # Zustand state management
│   │   ├── aiStore.ts       # AI model preferences
│   │   └── applicationStore.ts
│   ├── services/
│   │   ├── ai/              # LLM orchestration
│   │   └── generator/       # Content generation
│   └── types/               # TypeScript definitions
├── .env.example             # Environment variable template
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An API key from OpenAI and/or Anthropic

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and add your API keys:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your API keys:
   ```
   VITE_OPENAI_API_KEY=sk-your-openai-api-key
   VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

### Cloudflare Pages (Recommended)

PEN is optimized for deployment on Cloudflare Pages with automatic Git integration. This provides:

- Automatic deployments on every push
- Preview URLs for branches and pull requests
- Global CDN distribution
- Zero-config HTTPS
- Free tier for reasonable usage (100k requests/day)

**Quick Start:**
1. See [`CLOUDFLARE_DEPLOYMENT_HANDOFF.md`](./CLOUDFLARE_DEPLOYMENT_HANDOFF.md) for complete deployment instructions
2. Install Wrangler CLI: `npm install -g wrangler`
3. Authenticate: `wrangler login`
4. Connect your repository via Cloudflare Dashboard
5. Configure build settings:
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: `20`
6. Add environment variables in Cloudflare Dashboard

For detailed step-by-step instructions, troubleshooting, and advanced configuration, refer to the comprehensive deployment handoff document.

### Other Deployment Options

The application is a standard Vite/React app and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Simply run `npm run build` and upload the `dist/` directory.

## Usage

### Selecting Models

Each pane (Editor, Evaluator, Logframe) has a model selector in its header. Click the CPU icon to choose which AI model to use for that specific context.

### Generating Content

1. Select a question from the sidebar
2. Choose your preferred model from the dropdown in the editor toolbar
3. Click "Generate Answer" to create AI-generated content
4. Edit the generated content manually as needed

### Adding New Models

Edit `src/config/models.json` to add new models:

```json
{
  "id": "unique-model-id",
  "name": "Display Name",
  "provider": "openai",
  "contextWindow": 128000,
  "apiKeyEnvVar": "VITE_OPENAI_API_KEY",
  "parameters": {
    "modelName": "gpt-4-turbo-preview",
    "temperature": 0.7,
    "maxTokens": 4000
  }
}
```

Add the corresponding environment variable to your `.env` file.

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **AI Integration**: OpenAI SDK, Anthropic API

## Configuration

### Model Configuration

Models are configured in `src/config/models.json`. Each model configuration includes:

- `id`: Unique identifier
- `name`: Display name
- `provider`: API provider (openai, anthropic, custom)
- `contextWindow`: Maximum context length
- `apiKeyEnvVar`: Environment variable name for the API key
- `parameters`: Model-specific parameters

### Environment Variables

Required environment variables (see `.env.example`):

- `VITE_OPENAI_API_KEY`: OpenAI API key
- `VITE_ANTHROPIC_API_KEY`: Anthropic API key (optional)
- `VITE_LOCAL_LLM_KEY`: Custom LLM API key (optional)

## Development Roadmap

- [x] Core editor functionality
- [x] AI model configuration system
- [x] Word count tracking
- [x] Version management
- [x] Cloudflare Pages deployment configuration
- [ ] Evaluation system implementation
- [ ] Logframe generator
- [ ] Export functionality (PDF, DOCX)
- [ ] Collaboration features
- [ ] Template library

## Contributing

This is a development platform for grant writing. Contributions are welcome!

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
