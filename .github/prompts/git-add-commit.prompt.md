---
agent: agent
description: This prompt is used to add changes and create git commit messages with conventional commits.
---

Steps to implement Git Flow:
1. Generate a concise and descriptive commit message following the Conventional Commits specification.
2. Stage all changes using `git add .`.
3. Create a commit with the generated message using `git commit -m "<commit-message>".
4. Ensure the commit message adheres to the Conventional Commits format, such as:
   - feat: for new features
   - fix: for bug fixes
   - docs: for documentation changes
   - style: for code style changes (formatting, missing semicolons, etc.)
   - refactor: for code refactoring without changing functionality
   - test: for adding or updating tests
   - chore: for maintenance tasks and other changes that don't modify src or test files

5. Return the git commands executed along with the commit message.

Example output:
```git add .
git commit -m "feat: add user authentication module"```

Make sure to replace the example commit message with one that accurately reflects the changes made in the codebase.

Remember to follow best practices for commit messages, keeping them clear and informative.