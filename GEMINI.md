# Antigravity Agent Guidelines for Agafari Project

## Automatic Version Control & Commit Workflow
- **Commit Every Completed Step**: After completing and verifying any task, bug fix, feature update, or UI change, automatically stage and commit all modified files using Git.
- **Commit Command Pattern**:
  ```bash
  git add .
  git commit -m "type(scope): concise description of completed step"
  ```
- **Commit History**: Ensure commits are atomic and frequent so any step can easily be reverted if needed.
