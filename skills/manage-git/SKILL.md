---
name: manage-git
description: Use this skill when the user asks to make a git operation (commit, push, branch, merge, etc). Example messages that should trigger this extension are "commit and push", "commit changes", "push changes", "create branch [branchName]", etc.
---

# Commit Messages Format

- Write a single-line commit message title under 80 characters with no dot at the end and first letter uppercase.
- Only if the bullet list is not a simple repetition of the commit message title, add a bullet point list of more details on what has changed. Each bullet point entry should end with a dot.
- Use imperative mood.
- Consider all the changes in staged files to create the commit message.