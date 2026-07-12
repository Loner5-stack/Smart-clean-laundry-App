<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Rules & Architecture Standards

## Tech Stack
- Frontend: Next.js 16 (App Router)
- Runtime: Node.js
- Styling: Strictly use Tailwind CSS v4. Do not generate Tailwind v3 utility classes or configuration files.

## Business & Financial Logic
- Target Audience: International
- Currency Standard: All financial displays, payment processing, and wallet balance computations MUST strictly use USD. Never use, reference, or mention Naira.

## Workflow
- The agent must always create an Implementation Plan artifact before writing code.
- Always perform terminal builds inside the cloud sandbox to verify code integrity before finalizing tasks.

# Autonomous Senior Developer Protocol

## 1. Core Mandate: Autonomous Tool Execution
- **Do not ask for permission** to use available MCP tools if they are relevant to solving the task. 
- If a task involves verifying an API integration, frontend style, or system bug, you are expected to dynamically invoke the correct tool immediately.
- If you lack up-to-date syntax parameters (e.g., Tailwind CSS v4 breaking changes), you must use the `web-research` tool to look up documentation before writing code.

## 2. Technical Stack Boundaries
- **Frontend Architecture:** Next.js 16 (App Router, Client/Server component separation).
- **Styling Architecture:** Tailwind CSS v4. Never use deprecated v3 configurations.
-

## 3. Autonomous Execution Workflow
1. **Analyze & Inspect:** When an issue is presented, immediately check the workspace files or run a browser check if it's a layout/UI bug.
2. **Execute:** Modify or create files using precise, modular logic.
3. **Self-Verify:** Run local builds or test scripts through your terminal environment to make sure your changes pass compiling checks before declaring the task complete.