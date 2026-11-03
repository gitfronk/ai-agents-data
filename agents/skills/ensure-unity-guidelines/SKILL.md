---
name: ensure-unity-guidelines
description: When generating code or when the user asks to check coding conventions, use this skill
---

# Summary Comments

## Public/Protected Classes and Methods
- Use `<summary>` XML element
- Keep it brief and essential (1-2 sentences)
- Explain the class purpose or what the method does, not implementation details

## Private Fields and Methods
- **Do NOT** use `<summary>` XML elements

# Tooltips for Serialized Fields

## Format
```csharp
[SerializeField, Tooltip("Brief description in one phrase or short sentence.")]
private float _someValue = 0f;
```

## Guidelines
- Keep tooltips brief (under 50 words)
- Explain the field's purpose, not implementation
- Don't duplicate what the summary already says
- Use "Seconds", "Float", "List&lt;T&gt;" for units/types

# Inline Comments

## When to Use
- Complex logic explanations (math formulas, algorithms)
- Non-obvious code patterns
- TODO/FIXME notes for future work
- Breaking changes from legacy code

## Format

- Always start with `//` and terminate with `.`

Example:
```csharp
// Decay the y-axis angular velocity using exponential formula.
angularVelocity.y *= Mathf.Exp(-_yawDamping * deltaTime);

// TODO: Optimize by caching this calculation in the next frame.
```

# General Rules

1. **Public API First**: Document what public/protected members do, not how
2. **Brief & Essential**: Every comment should add value
3. **No Redundancy**: Tooltips should complement, not duplicate, summaries
4. **Keep Only What Matters**: Inline comments for truly complex parts
5. **Consistent Formatting**: Match team conventions and XMLDoc standards
6. **Namespace & Class**: Always include namespace path in summaries