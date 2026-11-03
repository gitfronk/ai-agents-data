---
name: manage-git
description: When generating a commit message or doing git operations, use this skill.
---

- Use gitflow naming conventions for branches (ex a feature branch is named 'feature/[branchName]')

# Commit Messages Format

- Write a single-line message under 80 characters with no dot at the end and first letter uppercase.
- Add bullet point list of more details on what has changed and add a dot at the end of each entry.
- Use imperative mood.
- Consider all the changed staged files to create the commit message.

# Commit And Push Operations

When performing commit and push operations, ALWAYS ask the user permission before executing the commands.

For commits:
- ALWAYS show to the user the commit message before committing it, and ask if the user wants to modify it or if you can proceed with the commit.

# Branches Operations

ALWAYS ask user's permission before executing operations on branches (checkout, create, delete, merge, etc...).