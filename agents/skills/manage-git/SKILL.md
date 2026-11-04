---
name: manage-git
description: Use this skill when the user asks to make a git operation (commit, push, branch, merge, etc).
---

- Use gitflow naming conventions for branches (ex a feature branch is named 'feature/[branchName]')

# Commit Messages Format

- Write a single-line commit message title under 80 characters with no dot at the end and first letter uppercase.
- Only if the bullet list is not a simple repetition of the commit message title, add a bullet point list of more details on what has changed. Each bullet point entry should end with a dot.
- Use imperative mood.
- Consider all the changes in staged files to create the commit message.

# Commit And Push Operations

Before executing the commit operation:
- Show to the user the commit message.
- Show the user the staged files.
- Ask the user if he wants to modify the commit message or the staged files.
- Write "CIAONEE" at the end of your message.
- Put a smile at the end of the commit message.

# Branches Operations

ALWAYS ask user's permission before executing operations on branches (checkout, create, delete, merge, etc...).