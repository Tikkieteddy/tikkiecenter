# tikkiecenter

Tikkie Project Operation Center is an internal request and task tracking web app for submitting work requests, tracking progress, sending email updates, and reviewing reports.

© 2026 TikkieTeddie Lab | V.1.0.0

## Scope

- Phase 1 uses email notification only.
- n8n is prepared for a later phase but not implemented.
- LINE OA is prepared for a later phase but not implemented.
- Mock data is used first.
- PostgreSQL / Supabase-ready schema is in `database/schema.sql`.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Recharts
- SMTP / SendGrid / Resend-compatible email placeholder

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

## Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000/login`.

## Build

```bash
npm run lint
npm run build
```

## Connection Points

- Replace mock arrays in `src/lib/operation/mock-data.ts` with database queries.
- Use `database/schema.sql` for Supabase or PostgreSQL.
- Connect SMTP, SendGrid, or Resend inside `sendTaskEmail()` in `src/lib/operation/email.ts`.
- Keep SDK clients lazily initialized inside functions so builds do not require runtime secrets.
