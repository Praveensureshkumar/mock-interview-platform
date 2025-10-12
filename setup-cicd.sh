#!/bin/bash

# 🚀 Quick CI/CD Setup Script
# Run this to set up your repository for CI/CD

echo "🔧 Setting up CI/CD for Mock Interview Platform..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this script from your project root."
    exit 1
fi

# Check current branch
current_branch=$(git branch --show-current)
echo "📍 Current branch: $current_branch"

# Create development branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/development; then
    echo "🌱 Creating development branch..."
    git checkout -b development
    git push -u origin development
else
    echo "✅ Development branch already exists"
fi

# Switch to main branch
echo "🔄 Switching to main branch..."
git checkout main

# Add and commit CI/CD files
echo "📝 Adding CI/CD configuration files..."
git add .github/workflows/
git add GITHUB_SECRETS_SETUP.md

if git diff --staged --quiet; then
    echo "✅ No changes to commit"
else
    git commit -m "feat: Add CI/CD pipeline with GitHub Actions

- Add production deployment workflow for main branch
- Add development testing workflow for development branch  
- Include security scanning and code quality checks
- Add comprehensive GitHub secrets setup guide

🚀 Ready for automated deployments!"
fi

# Push to main
echo "⬆️ Pushing changes to main branch..."
git push origin main

# Switch back to development for local work
echo "🔄 Switching back to development branch for local work..."
git checkout development

# Merge main into development to sync
echo "🔄 Syncing development with main..."
git merge main
git push origin development

echo ""
echo "🎉 CI/CD Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to GitHub → Settings → Secrets and variables → Actions"
echo "2. Add the secrets listed in GITHUB_SECRETS_SETUP.md"
echo "3. Set up branch protection rules (recommended)"
echo "4. Create a PR from development to main to test the pipeline"
echo ""
echo "🔀 Workflow:"
echo "• Work on 'development' branch for local development"
echo "• Create PR from 'development' → 'main' for production deployment"
echo "• Main branch automatically deploys to production"
echo ""
echo "✅ Happy coding! 🚀"