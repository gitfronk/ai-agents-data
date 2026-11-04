# AI Agents Data

## Project Purpose

This repository contains lightweight skills, extensions, and other data for AI harnesses to use.

The project has been created with the following purposes in mind:
- Help working with local LLMs, especially on low and very low memory computers.
- Test the limits and capabilities of lightweight open source harnesses (like Pi Agent).
- Test the limits and capabilities of lightweight open weight local LLMs (like Qwen 3.5 9B).
- Experimenting and learning.

In this project you could find some "personal" settings, like the "models.json" and the "settings.json" files for Pi Agent, which are nice for me to keep here and share them with my different PC setups, but you won't find personal informations, so feel free to use them if you want. (If you find some personal info, like project names, feel free to notify me about that).

Every file is either hand-written or AI-generated and reviewed by me. Be aware that I am not a typescript programmer, so I do my best to review the extensions, and I am pretty confident they do not have security issues, but errors may be there.

This readme file may not always be up-to-date but I will do my best to document my work here.

## Project Structure

```
ai-agents-data/
├── extensions/           # PI extensions
│   ├── git-hooks.ts      # Git hooks on commit, push and branch operations
│   └── plan-mode.ts      # Plan mode functionality to work without writing and modifying files
├── pi/                   # PI Agent files
│   ├── models.json       # Available AI models
│   └── settings.json     # PI settings
└── skills/               # Agents skills
    ├── ensure-unity-guidelines/
    │   └── SKILL.md
    └── manage-git/
        └── SKILL.md
```

## Extensions

### git-hooks.ts

Git hooks on commit, push and branch operations. The extension catches these commands and prompts the user to review them before continuing, by asking to approve, modify or cancel it.

### plan-mode.ts
Provide a plan mode functionality so that the agent does not write or modify files.

## Skills

### ensure-unity-guidelines
Ensures Unity project guidelines are followed.

### manage-git
Skills for managing Git operations (commit, push, branch, merge, etc.) and giving guidlines on commit messages formats.

## Pi Agent Configurations

- **models.json**: Configuration for available AI models.
- **settings.json**: PI general settings.