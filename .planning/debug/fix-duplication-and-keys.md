# Plan: Fix Ticket Duplication and AI Configuration

The system is creating duplicate tickets when the AI Collection Agent fails. This is caused by multiple factors: a missing API key for Groq and a lack of submission locks in the UI.

## Objectives
- Fix the `AI_LoadAPIKeyError` for Groq.
- Prevent duplicate ticket creation by adding idempotency/locks in the frontend.
- Update global AI model configuration to use stable/working IDs.

## Steps

### 1. Update Environment Variables
- Add `GROQ_API_KEY=SUA_CHAVE_AQUI` to `.env`.

### 2. Update AI Configuration (`src/lib/ai/config.ts`)
- Change `reasoning` model to `gemini-2.0-flash`.
- Change `power` model to `gemini-pro-latest`.
- This ensures the built-in AI features (Triage, RAG) use models available on the user's account.

### 3. Prevent Duplication in New Ticket Page (`src/app/dashboard/tickets/new/page.tsx`)
- Add a guard in `submitTicket` to prevent execution if `isLoading` is true.
- Use a `useRef` to track if a submission is already in progress.

### 4. Refine Collection Chat (`src/components/ai/CollectionChat.tsx`)
- Add a guard to ensure `onSkip` is only called once.
- Ensure the `useEffect` doesn't trigger multiple times unnecessarily.

## Verification
- Create a new ticket with AI enabled.
- Verify that even if the AI fails, only ONE ticket is created.
- Check that the Groq agent works (logs will appear in `AILog`).
