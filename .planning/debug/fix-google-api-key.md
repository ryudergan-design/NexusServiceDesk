# Plan: Fix missing Google Generative AI API Key

The application is failing with a `AI_LoadAPIKeyError` because the Google AI provider is not finding the API key. Although the key is present in the `.env` file, the SDK's default `google` object might be failing to load it in some environments (especially with Turbopack or specific Next.js versions).

## Objective
- Fix the API key loading by explicitly initializing the Google provider with the API key from environment variables.
- Ensure the variable name matches exactly what is expected by the code and the SDK.

## Key Files & Context
- `src/lib/ai/config.ts`: Configuration of AI providers.
- `.env`: Environment variables (already contains the key).

## Implementation Steps

### 1. Update AI Configuration
- Modify `src/lib/ai/config.ts` to import `createGoogleGenerativeAI` instead of using the pre-initialized `google` object.
- Initialize the Google provider with the `apiKey` explicitly.
- Add a safety check to log a warning (on the server) if the key is missing, which helps with debugging.

```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// ...

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// ...
```

## Verification & Testing
- Restart the Next.js development server.
- Trigger the `runSolverAgent` (Magic Compose) in the dashboard.
- Verify that the error no longer occurs.
- Check the server console for any warning logs about missing keys.
