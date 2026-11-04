# AI Agents Data

## Table of Contents

- [Project Purpose](#project-purpose)
- [Project Structure](#project-structure)
- [Extensions](#extensions)
  - [git-hooks.ts](#git-hooks.ts)
  - [plan-mode.ts](#plan-mode.ts)
- [Skills](#skills)
  - [ensure-unity-guidelines](#ensure-unity-guidelines)
  - [manage-git](#manage-git)
- [Pi Agent Configurations](#pi-agent-configurations)
  - [models.json](#models.json)
  - [settings.json](#settings.json)

## Project Purpose

This repository contains lightweight skills, extensions, and other data for AI agents to use.

The project has been created with the following purposes in mind:
- Help working with local LLMs, especially on low and very low memory computers (I'm currently testing on a Macbook Pro M1 16GB).
- Test the limits and capabilities of lightweight harnesses.
- Test the limits and capabilities of lightweight local LLMs (like Qwen 3.5 9B).
- Experimenting and learning.

In this project you could find some "personal" settings, like the `models.json` and the `settings.json` files for Pi Agent, which are nice for me to keep here and share them with my different PC setups, but you won't find personal informations, so feel free to use them if you want. (If you find some personal info, like project names, feel free to notify me about that).

Every file is either hand-written or AI-generated and reviewed by me. Be aware that I am not a typescript programmer, so I do my best to review the extensions, and I am pretty confident they do not have security issues, but errors may be there, so be careful.

I am currently focusing on Pi Agent because it is highly customizable an most of all it has a very light system prompt.

This readme file may not always be up-to-date but I will do my best to document my work here.

## Extensions

### git-hooks.ts

Git operation approval hooks for commit, push, and branch operations. The extension monitors **bash** commands and prompts the user to approve, modify, or cancel Git operations before executing them.

### plan-mode.ts

Read-only mode that allows the agent to explore the codebase and describe changes without actually modifying files or running shell commands. Only safe tools (`read`, `grep`, `find`, `ls`) are active while mutating tools (`write`, `edit`, `bash`) are blocked. Useful for previewing changes before committing.

## Skills

### ensure-unity-guidelines

Ensures Unity projects coding guidelines are followed. Defines formatting and documentation rules.

### manage-git

Manages Git operations and enforces commit message formatting guidelines.

## Pi Agent Configurations

- **models.json**: Configuration for available AI models and their settings.
- **settings.json**: General settings.
