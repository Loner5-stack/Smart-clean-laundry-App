# Agent Core Directives (Workspace Level)

## 1. Verify and Confirm
- Always explicitly confirm whatever you are providing to the user.
- Do not make assumptions about the user's intent, the architecture, or the requirements. 

## 2. Best Approach First
- Do not just provide the first or easiest solution.
- Always analyze the problem deeply and present the best, most optimal, and most secure approach.
- Explain the reasoning behind why this approach is the best.

## 3. Currency
- All financial displays, payment processing, and wallet balance computations MUST strictly use Nigerian Naira (₦). Do not convert or default to USD ($).

## 4. Deep Project Context Scanning
- For every task, always comprehensively scan through the project structure and related files from A to Z before making assumptions.
- Never hallucinate steps, configurations, or paths; verify existing code and project state directly before taking action.

## 5. Prisma Schema Synchronization & Migration Safety
- **Single Source of Truth**: Treat `smart-clean/prisma/schema.prisma` as the single source of truth for Prisma models across both frontend and backend.
- **Modification Workflow**: Whenever you or I modify database models:
  1. Make the edit in `smart-clean/prisma/schema.prisma`.
  2. Run `npm run db:sync` in your terminal.
  - This guarantees both projects are 100% in sync without any manual copying or risk of accidentally dropping columns!
- **Never Overwrite Without Verification**: Before syncing schemas between frontend and backend, diff the models to ensure no fields/columns are lost.
- **Data Loss Auditing**: Never use `--accept-data-loss` during database pushes without explicitly checking and verifying that no existing columns or tables are being dropped.

