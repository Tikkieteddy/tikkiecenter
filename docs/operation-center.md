# Tikkie Project Operation Center

Internal project request and task tracking system built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui-style source components.

## Phase 1 Scope

- Email notification only.
- No n8n integration yet.
- No LINE OA integration yet.
- Mock data is used first.
- PostgreSQL / Supabase-ready schema lives in `database/schema.sql`.
- Email templates and provider placeholder live in `src/lib/operation/email.ts`.

## Main Routes

- `/login`
- `/dashboard`
- `/requests/new`
- `/my-requests`
- `/requests`
- `/requests/TK-2026-0005`
- `/requests/TK-2026-0005/update`
- `/reports`
- `/users`
- `/notifications`
- `/settings`

## Connection Points

- Replace mock arrays in `src/lib/operation/mock-data.ts` with database queries.
- Use `database/schema.sql` for Supabase or PostgreSQL.
- Connect SMTP, SendGrid, or Resend inside `sendTaskEmail()` in `src/lib/operation/email.ts`.
- Keep SDK clients lazily initialized inside functions so Next.js builds do not require runtime secrets.

## Verification

Run:

```bash
npm run build
npm run lint
npm run dev -- --port 3000
```

Then open `http://127.0.0.1:3000/login`.
