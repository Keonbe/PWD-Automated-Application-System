# Git Collaboration Guide: Merging, Pull Requests & Conflict Resolution

## Table of Contents
- [Creating Feature Branches](#creating-feature-branches)
- [Merging to Main](#merging-to-main)
- [Pull Request Workflow](#pull-request-workflow)
- [Merge Conflict Resolution](#merge-conflict-resolution)
- [Best Practices for Collaboration](#best-practices-for-collaboration)
- [Troubleshooting](#troubleshooting)
- [Pull Request Template](#pull-request-template)

---

## Creating Branch for Features

### VS Code Method
1. **Click branch name** in bottom-left status bar
2. **Select "Create new branch..."**
3. **Enter branch name**: `your-branch-name`
4. **Choose "main"** as starting point

### Git Bash CLI
```bash
# Create and switch to new branch
git checkout -b your-branch-name

# Or create from specific commit
git checkout -b your-branch-name main
```

---

## Merging to Main

### Method 1: Direct Merge [VS Code] (**Not Recommended for Team Use**)
1. **Switch to main branch:**
   - Click branch name → Select "main"
2. **Pull latest changes:**
   - Source Control (Ctrl+Shift+G) → Three dots → "Pull"
3. **Merge feature branch:**
   - Command Palette (Ctrl+Shift+P) → "Git: Merge Branch"
   - Select your feature branch
4. **Push changes:**
   - Source Control → "Sync Changes"

### Method 2: Git Bash CLI
```bash
# Switch to main and update
git checkout main
git pull origin main

# Merge branch feature
git merge /your-branch-name

# Push to remote
git push origin main
```


### Method 3: Pull Request Workflow

#### Step 1: Push Your Branch
##### VS Code
- Source Control → "Publish Branch" (first time)
- Or "Push" / "Sync Changes"

##### Git Bash CLI
```bash
git push origin your-branch-name
```

#### Step 2: Create Pull Request on GitHub
1. **Go to your repository** on GitHub
2. **Click "Pull requests"** tab
3. **Click "New pull request"**
4. **Set:**
   - **Base:** `main`
   - **Compare:** `your-branch-name`
5. **Fill PR details:**
   - Title: "Feature: Your Feature Description"
   - Description: Explain changes and purpose
   - Reviewers: Add team members
   - Assignees: Assign yourself
6. **Click "Create pull request"**

#### Step 3: Review & Merge
- **Team reviews** code and comments
- **Address feedback** if needed
- **Approve** the PR
- **Merge** using "Merge pull request"
- **Delete branch** (optional)

#### Step 4: Clean Up (After Merge)
##### VS Code
1. Switch to main branch
2. Pull latest changes
3. Delete local feature branch (optional)

##### Git Bash CLI
```bash
git checkout main
git pull origin main
git branch -d your-branch-name  # Delete local branch
```

---

## Merge Conflict Resolution Guide

### Understanding Conflict Indicators in VS Code

| Icon | Meaning | Action Required |
|------|---------|-----------------|
| 🟡 **U** | Unmerged file | Needs resolution |
| 🔴 **C** | Conflict detected | Manual resolution needed |
| 📝 **Both modified** | Same file changed in both branches | Use merge editor |

### Step-by-Step Conflict Resolution in VS Code

#### Step 1: Identify Conflicted Files
1. **Open Source Control** (Ctrl+Shift+G)
2. **Look for files** with:
   - 🟡 Yellow "U" icon
   - 🔴 Red "C" icon  
   - "Both modified" text

#### Step 2: Open Merge Editor
1. **Click on a conflicted file** in Source Control
2. **VS Code opens 3-panel merge editor:**
   ```
   ⬅️ INCOMING CHANGES (Other branch)
   ⬆️  RESULT (What will be saved)
   ➡️ CURRENT CHANGES (Your branch)
   ```

#### Step 3: Resolve Each Conflict
For each highlighted conflict block, choose:

- **"Accept Current Change"** ⬅️ (Keep your version)
- **"Accept Incoming Change"** ➡️ (Keep their version)
- **"Accept Both Changes"** ⬆️ (Combine both versions)
- **Edit manually** in the center panel

#### Step 4: Stage Resolved Files
1. **After resolving**, return to Source Control
2. **Click the "+"** next to each resolved file
3. **File moves** from "Changes" to "Staged Changes"

#### Step 5: Complete the Merge
1. **Repeat Steps 2-4** for all conflicted files
2. **Add commit message**: "Merge conflict resolution"
3. **Click "Commit"**

### Git Bash CLI Conflict Resolution

#### Step 1: Check Conflict Status
```bash
git status
# Look for "Unmerged paths" and conflicted files
```

#### Step 2: Resolve Conflicts Manually
1. **Open conflicted files** in VS Code or editor
2. **Find conflict markers:**
   ```javascript
   <<<<<<< HEAD
   // Your changes (current branch)
   =======
   // Their changes (incoming branch)
   >>>>>>> feature/other-branch
   ```
3. **Edit to keep desired code** and remove markers

#### Step 3: Mark as Resolved
```bash
# Stage each resolved file
git add filename.js

# Or stage all resolved files
git add .
```

#### Step 4: Complete Merge
```bash
git commit -m "Resolve merge conflicts"
git push origin main
```

### Common Conflict Scenarios & Solutions

#### 1. package.json Conflicts
**Problem:** Different dependency versions
**Solution:** Keep the newer version or combine needed dependencies

#### 2. Component File Conflicts  
**Problem:** Same component modified by multiple developers
**Solution:** Use "Accept Both Changes" and manually integrate logic

#### 3. Configuration File Conflicts
**Problem:** Different environment settings
**Solution:** Keep both configurations with conditionals or choose the production-ready version

### Aborting a Merge (If Needed)

#### VS Code
- Command Palette → "Git: Merge Branch" → Cancel
- Or use terminal commands below

#### Git Bash CLI
```bash
git merge --abort
```

### Prevention Tips
- **Pull frequently** from main to stay updated
- **Communicate** with team about which files you're working on
- **Use descriptive branch names**
- **Keep features small** and focused

---

## Best Practices for Collaboration

### Branch Naming Convention
```
feature/user-authentication
bugfix/login-error
hotfix/critical-bug
release/v1.2.0
```

### Commit Message Guidelines
```
feat: add user login functionality
fix: resolve navbar rendering issue
docs: update API documentation
style: format code with prettier
```

### Regular Maintenance
```bash
# Update your local main frequently
git checkout main
git pull origin main

# Delete merged branches
git branch --merged main | grep -v "main" | xargs git branch -d
```

---

##  Troubleshooting

### "Your local changes would be overwritten"
**Solution:** Stash your changes first
```bash
git stash
git pull origin main
git stash pop
```

### "Failed to push some refs"
**Solution:** Pull and merge first
```bash
git pull origin main
# Resolve conflicts if any
git push origin main
```

### "Repository not found"
**Solution:** Check remote URL
```bash
git remote -v
git remote set-url origin https://github.com/username/repo.git
```
---


# Pull Request Template

### PR Template Overview

Our project uses a standardized PR template to ensure consistent and thorough code reviews. Below is the complete template with explanations for each section.

### Complete PR Template

```markdown
# Pull Request Template

## Summary
<!-- Provide a 1-2 sentence overview of the changes -->

## Changes Made
<!-- Detailed description of what was changed -->

### What was added/removed/changed:
- [List specific changes]
- [Use bullet points]
- [Include file paths if helpful]

## Analysis
<!-- Technical reasoning behind changes -->

**Code Impact:**
- [How changes affect existing codebase]

**Dependencies:**
- [New dependencies or changes to existing ones]

**References:**
- [Related files, components, or systems]

## Testing
<!-- Verification methods used -->
- [ ] Unit tests updated/added
- [ ] Integration tests passing
- [ ] Manual testing performed
- [ ] All existing tests pass

## Screenshots/Evidence
<!-- Visual proof of changes if applicable -->

## Impact Assessment
### ✅ Positive Impacts
- [Benefits of these changes]

### ⚠️ Potential Concerns
- [Any risks or considerations]

### 🔒 Breaking Changes
- [ ] Yes (describe)
- [ ] No

## Documentation
- [ ] README updated
- [ ] Code comments added/updated
- [ ] init-documentation documentation updated
- [ ] API documentation updated
- [ ] Function documentation updated
- [ ] No documentation needed

## Deployment Notes
<!-- Special deployment requirements -->
```

### Best Practices

#### Branch Naming Convention 
```
feature/user-authentication
bugfix/login-error
hotfix/critical-bug
release/v1.2.0
docs/readme-update
refactor/auth-service
```

#### Commit Message Guidelines
```
feat: add user login functionality
fix: resolve navbar rendering issue
docs: update API documentation
style: format code with prettier
refactor: simplify authentication logic
test: add login component tests
chore: update dependencies
```

#### Code Review Checklist
- [ ] Code follows project style guidelines
- [ ] No sensitive data exposed
- [ ] Error handling implemented
- [ ] Performance considerations addressed
- [ ] Documentation updated if needed
- [ ] Tests are comprehensive and passed

### PR Workflow

#### 1. Pre-Submission Checklist
- Rebase onto latest main branch
- Run all tests locally
- Update documentation if needed
- Ensure commit history is clean

#### 2. Submission
- Fill out all relevant sections in PR template
- Assign appropriate reviewers
- Link related issues
- Add relevant labels

#### 3. Review Process
- Address reviewer comments promptly
- Update PR description if changes made
- Keep conversations (via comments) focused and constructive

#### 4. Post-Merge
- Delete feature branch (if applicable, after confirming no further work is needed and after merge - Communicate first before deleting a branch)
- Verify deployment if auto-deployed
- Update related documentation

### Example PR Sections

#### Good Summary Example:
```
This PR refactors the authentication service to use JWT tokens instead of session cookies, improving security and enabling stateless authentication.
```

#### Good Changes Made Example:
```
- Replaced session-based auth with JWT in AuthService.js
- Updated login component to handle token storage
- Added token refresh mechanism
- Removed session middleware from server
```

#### Good Analysis Example:
```
**Code Impact:** Changes affect login flow and API authentication
**Dependencies:** Added jsonwebtoken library, removed express-session
**References:** Impacts UserContext, API middleware, and all protected routes
```

#### Labels to Use
- `feature` - New functionality
- `bugfix` - Bug resolution
- `hotfix` - Critical production fix
- `documentation` - Docs updates
- `refactor` - Code improvements
- `tests` - Test-related changes

#### Review Expectations
- Reviews should be completed within 24-36 hours
- Use suggestion blocks for minor changes
- Be specific about required vs. optional changes
- Keep feedback constructive and technical