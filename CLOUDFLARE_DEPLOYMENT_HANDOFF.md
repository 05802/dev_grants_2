# Cloudflare Pages Deployment - Mac CLI Implementation Handoff

## 📋 Overview

This document provides step-by-step instructions for deploying the PEN Grant Application Platform to Cloudflare Pages using Mac command line tools. This follows the Git Integration workflow recommended by Cloudflare.

**Project:** PEN - Grant Application Writing Platform
**Repository:** dev_grants_2
**Current Branch:** `claude/mac-cli-agent-handoff-2QEhT`
**Build Tool:** Vite
**Framework:** React + TypeScript

---

## 🎯 Deployment Strategy: Git Integration

**Why Git Integration?**
- ✅ Automatic deployments on every push
- ✅ Build happens on Cloudflare's servers
- ✅ Preview URLs for every branch/PR
- ✅ Free for reasonable usage (100k requests/day)
- ✅ Global CDN distribution
- ✅ Zero-config HTTPS

---

## 📦 Project Context

### Build Configuration
- **Build Command:** `npm run build`
- **Build Output:** `dist/` (Vite default)
- **Node Version:** 18.x, 20.x, or 22.x (prefer 20.x for stability)
- **Package Manager:** npm

### Environment Variables Required
The application requires the following environment variables (from `.env.example`):
- `VITE_OPENAI_API_KEY` - OpenAI API key (already configured as GitHub secret: `OPENAI_API_KEY_GRANTDEV`)
- `VITE_ANTHROPIC_API_KEY` - Anthropic API key (optional)
- `VITE_LOCAL_LLM_KEY` - Custom LLM API key (optional)

### Current Repository Status
```
Branch: claude/mac-cli-agent-handoff-2QEhT
Status: Clean working directory
Recent commits:
  - 1525499 Create webpack.yml
  - 1dca64a Initial implementation of PEN platform
```

---

## 🛠️ Prerequisites

### 1. Cloudflare Account Setup
Before starting, ensure you have:
- [ ] Cloudflare account created (free tier is sufficient)
- [ ] Access to the GitHub repository where this code resides
- [ ] Mac with Homebrew installed

### 2. Install Wrangler CLI (Cloudflare's CLI Tool)

```bash
# Install Wrangler globally via npm
npm install -g wrangler

# Verify installation
wrangler --version
```

### 3. Authenticate with Cloudflare

```bash
# Login to Cloudflare (will open browser for OAuth)
wrangler login

# Verify authentication
wrangler whoami
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Verify Local Build

Before deploying, ensure the project builds successfully:

```bash
# Navigate to project directory
cd /path/to/dev_grants_2

# Install dependencies (if not already installed)
npm install

# Test build locally
npm run build

# Verify dist/ directory was created
ls -la dist/

# Test preview (optional but recommended)
npm run preview
```

**Expected Result:** Build completes successfully and `dist/` directory contains compiled assets.

---

### Step 2: Create Cloudflare Pages Project

#### Option A: Using Cloudflare Dashboard (Recommended for First-Time Setup)

1. **Go to Cloudflare Dashboard**
   ```bash
   # Open Cloudflare Pages in browser
   open "https://dash.cloudflare.com/?to=/:account/pages"
   ```

2. **Connect to Git Provider**
   - Click "Create a project"
   - Click "Connect to Git"
   - Choose "GitHub"
   - Authorize Cloudflare to access your repositories
   - Select the `dev_grants_2` repository

3. **Configure Build Settings**
   ```
   Project name: pen-grant-platform (or your preferred name)
   Production branch: main (or your default branch)
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: (leave empty)
   Environment variables:
     - VITE_OPENAI_API_KEY = [value from GitHub secret]
     - NODE_VERSION = 20
   ```

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for initial build to complete (2-5 minutes)

#### Option B: Using Wrangler CLI (Advanced)

```bash
# Create new Pages project via CLI
wrangler pages project create pen-grant-platform

# Follow the interactive prompts:
# - Production branch: main
# - Do you want to set up automatic deployments? Yes

# Connect to GitHub repository
# (This will open browser for OAuth authorization)
```

---

### Step 3: Configure Environment Variables

#### Via Cloudflare Dashboard:

```bash
# Open your project settings
open "https://dash.cloudflare.com/pages"
```

Navigate to: **Your Project → Settings → Environment Variables**

Add the following:

**Production:**
- `VITE_OPENAI_API_KEY`: Copy value from GitHub secret `OPENAI_API_KEY_GRANTDEV`
- `NODE_VERSION`: `20`

**Preview (Optional - for branch deployments):**
- `VITE_OPENAI_API_KEY`: Same as production (or use a test key)
- `NODE_VERSION`: `20`

#### Via Wrangler CLI:

```bash
# Set production environment variable
wrangler pages secret put VITE_OPENAI_API_KEY --project-name=pen-grant-platform

# Set Node version (this goes in wrangler.toml, see Step 4)
```

---

### Step 4: Create Cloudflare Configuration File (Optional)

Create `wrangler.toml` in the project root for advanced configuration:

```bash
# Create wrangler.toml
cat > wrangler.toml << 'EOF'
name = "pen-grant-platform"
compatibility_date = "2024-12-27"

[build]
command = "npm run build"
cwd = "."
watch_dir = "src"

[build.upload]
format = "service-worker"
dir = "dist"

[[env.production]]
name = "pen-grant-platform"
route = ""
zone_id = ""

[env.production.vars]
NODE_VERSION = "20"
EOF
```

**Note:** This file is optional if you're using Git Integration via dashboard.

---

### Step 5: Configure Build Settings in Cloudflare

Ensure these settings are configured in Cloudflare Pages:

| Setting | Value |
|---------|-------|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (empty) |
| Node version | 20.x |
| Install command | `npm install` |
| Environment variables | See Step 3 |

---

### Step 6: Push to Trigger Deployment

Since you're using Git Integration, deployments are triggered by pushing to GitHub:

```bash
# Ensure you're on the correct branch
git checkout claude/mac-cli-agent-handoff-2QEhT

# Check current status
git status

# If you made changes (like adding wrangler.toml), commit them
git add wrangler.toml CLOUDFLARE_DEPLOYMENT_HANDOFF.md
git commit -m "Add Cloudflare Pages configuration and deployment handoff"

# Push to trigger deployment
git push -u origin claude/mac-cli-agent-handoff-2QEhT
```

**What happens next:**
1. Cloudflare detects the push
2. Builds the project on Cloudflare's servers
3. Deploys to a preview URL (since it's not the main branch)
4. You'll receive a preview URL like: `https://abc123.pen-grant-platform.pages.dev`

---

### Step 7: Monitor Deployment

#### Via Cloudflare Dashboard:

```bash
# Open deployments page
open "https://dash.cloudflare.com/pages"
```

Navigate to: **Your Project → Deployments**

#### Via Wrangler CLI:

```bash
# List all deployments
wrangler pages deployment list --project-name=pen-grant-platform

# Get deployment status
wrangler pages deployment tail --project-name=pen-grant-platform
```

---

### Step 8: Test Deployment

Once deployment completes:

```bash
# Cloudflare will provide a URL like:
# https://abc123.pen-grant-platform.pages.dev

# Open in browser
open "https://[your-deployment-url].pages.dev"

# Test critical functionality:
# 1. Application loads
# 2. No console errors
# 3. AI model selector appears
# 4. (If API key is configured) Test AI generation
```

---

## 🔧 Advanced Configuration

### Custom Domain Setup

```bash
# Add custom domain via CLI
wrangler pages domain add yourdomain.com --project-name=pen-grant-platform

# Or via dashboard:
open "https://dash.cloudflare.com/pages"
# Navigate to: Your Project → Custom Domains → Set up a custom domain
```

### Build Caching

Cloudflare Pages automatically caches `node_modules/`. To optimize:

```json
// Add to package.json
{
  "engines": {
    "node": "20.x",
    "npm": "10.x"
  }
}
```

### Branch Preview Deployments

Every branch push creates a preview deployment:
- `main` → Production: `https://pen-grant-platform.pages.dev`
- `feature-branch` → Preview: `https://feature-branch.pen-grant-platform.pages.dev`
- Pull requests get automatic preview URLs

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Deployment completes without errors
- [ ] Application loads at the provided URL
- [ ] No console errors in browser DevTools
- [ ] Environment variables are accessible (check Network tab for API calls)
- [ ] Static assets (CSS, JS, images) load correctly
- [ ] Application functionality works as expected
- [ ] Preview URLs generate for branch pushes
- [ ] Build times are reasonable (< 5 minutes)

---

## 🐛 Troubleshooting

### Build Fails with "Module not found"

**Solution:**
```bash
# Check package.json for correct dependencies
npm install
npm run build

# If build succeeds locally, ensure Cloudflare has correct Node version
# Set NODE_VERSION environment variable to 20
```

### Environment Variables Not Working

**Solution:**
1. Verify variables are prefixed with `VITE_` (Vite requirement)
2. Check they're set in Cloudflare Dashboard → Settings → Environment Variables
3. Redeploy to pick up new environment variables

```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger rebuild for env vars"
git push
```

### Build Timeout

**Solution:**
```bash
# Optimize build by adding to vite.config.ts:
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
```

### Deployment Stuck in "Building" Status

**Solution:**
```bash
# Cancel deployment via CLI
wrangler pages deployment cancel --project-name=pen-grant-platform

# Or via dashboard: Deployments → Click deployment → Cancel
```

### API Keys Not Accessible

**Problem:** `import.meta.env.VITE_OPENAI_API_KEY` is undefined

**Solution:**
1. Ensure environment variable is set in Cloudflare (not just GitHub)
2. Variable must be prefixed with `VITE_`
3. Redeploy after adding variables

---

## 📊 Deployment Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Developer Workflow                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   git push origin    │
                   │      <branch>        │
                   └──────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare Pages Workflow                  │
├─────────────────────────────────────────────────────────────┤
│  1. Detect push via GitHub webhook                          │
│  2. Clone repository                                        │
│  3. Install dependencies (npm install)                      │
│  4. Run build command (npm run build)                       │
│  5. Upload dist/ to Cloudflare CDN                          │
│  6. Generate preview URL                                    │
│  7. Send status back to GitHub                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   Deployment Live    │
                   │  on Cloudflare CDN   │
                   └──────────────────────┘
```

---

## 🔗 Useful Commands Reference

```bash
# Authentication
wrangler login
wrangler whoami
wrangler logout

# Project Management
wrangler pages project list
wrangler pages project create <project-name>
wrangler pages project delete <project-name>

# Deployments
wrangler pages deployment list --project-name=<project-name>
wrangler pages deployment tail --project-name=<project-name>

# Direct Deployment (bypasses Git Integration)
wrangler pages deploy dist --project-name=<project-name>

# Environment Variables
wrangler pages secret put <KEY> --project-name=<project-name>
wrangler pages secret list --project-name=<project-name>

# Local Development with Cloudflare Functions (if needed later)
wrangler pages dev dist
```

---

## 📚 Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Pages Git Integration](https://developers.cloudflare.com/pages/configuration/git-integration/)

---

## 🔐 Security Considerations

### API Keys
- ✅ Store API keys in Cloudflare environment variables (encrypted)
- ✅ Never commit API keys to repository
- ✅ Use different keys for preview vs production
- ✅ Rotate keys periodically

### GitHub Integration
- ✅ Limit Cloudflare's repository access to only required repos
- ✅ Enable branch protection rules
- ✅ Require PR reviews before merging to main

### Access Control
- ✅ Restrict Cloudflare dashboard access to authorized team members
- ✅ Use Cloudflare Access for private deployments (if needed)
- ✅ Enable audit logs for deployment tracking

---

## 📞 Support & Escalation

If you encounter issues:

1. **Check Cloudflare Status**: https://www.cloudflarestatus.com/
2. **Cloudflare Community**: https://community.cloudflare.com/
3. **Cloudflare Support**: https://support.cloudflare.com/
4. **GitHub Repository Issues**: File an issue in the project repository

---

## ✅ Success Criteria

Deployment is successful when:

- [x] Git Integration is configured between GitHub and Cloudflare Pages
- [x] Environment variables are properly set in Cloudflare
- [x] Initial deployment completes without errors
- [x] Application is accessible via Cloudflare URL
- [x] Preview deployments work for non-production branches
- [x] Build times are under 5 minutes
- [x] Application functions correctly (AI features work with provided API key)

---

## 📝 Next Steps (Post-Deployment)

1. **Configure Custom Domain** (optional)
   - Add domain in Cloudflare Pages settings
   - Update DNS records

2. **Set up main branch deployment**
   - Merge `claude/mac-cli-agent-handoff-2QEhT` to main
   - Configure main branch as production branch

3. **Enable Analytics**
   - Enable Cloudflare Web Analytics for traffic insights

4. **Configure Redirects** (if needed)
   - Create `public/_redirects` file for SPA routing

5. **Set up Monitoring**
   - Configure Cloudflare alerts for failed deployments
   - Set up uptime monitoring

---

## 🎉 Quick Start Commands (Copy-Paste Sequence)

For a rapid deployment, execute these commands in sequence:

```bash
# 1. Verify you're in the correct directory
cd /path/to/dev_grants_2

# 2. Test local build
npm install && npm run build

# 3. Install Wrangler (if not already installed)
npm install -g wrangler

# 4. Login to Cloudflare
wrangler login

# 5. Verify authentication
wrangler whoami

# 6. Push code to trigger deployment (via Git Integration)
git checkout claude/mac-cli-agent-handoff-2QEhT
git push -u origin claude/mac-cli-agent-handoff-2QEhT

# 7. Monitor deployment in dashboard
open "https://dash.cloudflare.com/pages"
```

Then complete the Git Integration setup in the Cloudflare Dashboard as described in Step 2, Option A.

---

**Document Version:** 1.0
**Last Updated:** 2025-12-27
**Prepared For:** Mac CLI Agent Implementation
**Deployment Method:** Cloudflare Pages with Git Integration
