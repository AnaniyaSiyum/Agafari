# Antigravity Agent Guidelines for Agafari Project

## Automatic Version Control & Commit Workflow
- **Commit Every Completed Step**: After completing and verifying any task, bug fix, feature update, or UI change, automatically stage and commit all modified files using Git.
- **Commit Command Pattern**:
  ```bash
  git add .
  git commit -m "type(scope): concise description of completed step"
  ```
- **Commit History**: Ensure commits are atomic and frequent so any step can easily be reverted if needed.

## Scoped Patch & Anti-Regression Rules (Strict Enforcement)

### Core Directive
Do NOT rewrite, optimize, or reorganize code outside the explicitly requested change. Preserve all existing logic, variables, and side effects.

### Rules:
1. **Target Isolation**: Modify ONLY the function, block, or lines required to fix the specified issue.
2. **No Cosmetic Refactoring**: Do not rename unmentioned variables, reformat untouched blocks, or remove existing comments/logs.
3. **Diff-First Behavior**:
   - Identify the exact lines causing the bug.
   - Show the minimal diff or localized snippet instead of regenerating the entire file.
4. **Dependency Check**: Before suggesting a change, check all imports, callers, and downstream dependencies of the modified section.
5. **Regression Warning**: If fixing the issue requires modifying shared state, interfaces, or APIs used elsewhere, STOP and warn before applying the edit.
