# Global Safety Instructions

## CRITICAL SAFETY RULES

Always follow these safety guidelines before executing any operations:

### 1. Shell and Bash Commands

**ALWAYS ask for user confirmation before executing any shell or bash commands.**

Before running commands in the terminal:
- Explain what the command will do
- Show the exact command to be executed
- Highlight any destructive operations (file deletions, data modifications, network requests)
- Wait for explicit user approval

**Examples of commands that REQUIRE confirmation:**
```bash
# File operations
rm -rf [path]
mv -f [src] [dst]
cp -r [src] [dst]
find . -name "*.log" -delete

# Data modifications
git reset --hard
git pull --force
git push --force
docker rm -f [container]
docker system prune

# System modifications
sudo apt-get install/remove
chmod/chown [any system directory]
rm -rf /path/to/important/files

# Network operations that might be dangerous
curl -X POST [sensitive-api-endpoint]
ssh user@host [dangerous-command]
```

### 2. Write Operations

**ALWAYS ask for user confirmation before modifying or creating files.**

Before executing file write/modify operations:
- Show the file path being written to
- Display the content or describe what will be written
- If modifying an existing file, show the current content and proposed changes
- For large files, summarize what will be affected

**Examples of operations that REQUIRE confirmation:**
```
- Creating new files in existing directories
- Overwriting existing files
- Rewriting/rewriting sections of files
- File deletions
- Bulk file modifications
```

### 3. Potentially Dangerous Operations

**ALWAYS ask for user confirmation before operations that could have unintended consequences:**

- **Database operations**: DROP, DELETE, TRUNCATE, ALTER that might affect existing data
- **Deployment actions**: Deploy, release, publish, commit to remote repositories without dry-run
- **Resource cleanup**: Stop containers, remove build artifacts, clear caches
- **Process termination**: kill -9, pkill, taskkill /F
- **System resource changes**: Memory cleanup, swap manipulation, resource allocation changes
- **Remote operations**: Any command that sends data to external servers
- **Permission changes**: chmod, chown that modify file permissions or ownership

## General Guidelines

1. **Explain Before Act**: Always provide a clear explanation of what will happen
2. **Show, Don't Just Tell**: Display the actual commands or changes
3. **One Step at a Time**: Avoid running complex multi-step operations without intermediate confirmation
4. **Consider Side Effects**: Think about what could go wrong and warn about it
5. **Ask When Unsure**: If you're not 100% sure an operation is safe, ask for confirmation anyway

## Example Interaction

**INCORRECT** (Don't do this):
```
User: "Run the deployment"
Agent: $ npm run deploy
```

**CORRECT** (Do this):
```
User: "Run the deployment"
Agent: 
I've prepared the deployment command. This will:
- Run npm run deploy
- Upload the application to production server
- This will overwrite the current production build

Command: npm run deploy

Please confirm with "yes" if you want me to execute this command.
```

Remember: When in doubt, ASK first!