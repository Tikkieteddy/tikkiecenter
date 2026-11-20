# News Risk Monitor

AI-assisted Editorial Risk Screening System for Thai Newsroom.

ระบบนี้ช่วยกองบรรณาธิการไทยคัดกรองความเสี่ยงเบื้องต้นก่อนเผยแพร่ข่าว โดยเน้นความเร็ว ความชัดเจน approval workflow และ auditability ระบบไม่ฟันธงทางกฎหมาย แต่ช่วยชี้ประเด็นที่ควรให้บรรณาธิการหรือฝ่ายกฎหมายตรวจต่อ

## Tech Stack

- Next.js 16 App Router
- React 19, TypeScript, Tailwind CSS 4
- shadcn/ui-style local components, Lucide Icons, Recharts
- PostgreSQL-ready Prisma schema
- OpenAI API-ready risk engine architecture
- SMTP / Resend / SendGrid email workflow
- Mobile Web Push notification workflow with email fallback
- Vercel compatible

## Main Routes

- `/login` mock role-based access
- `/dashboard` newsroom command dashboard
- `/screening` AI risk screening page
- `/risk-database` risk topic/keyword/case management
- `/library` legal and editorial knowledge library
- `/library` also supports adding future knowledge sources by file upload, URL, or text, then turning them into evaluation criteria
- `/approvals` editor approval queue
- `/approve/APR-260519-001` editor review page
- `/reports` usage reports and CSV-ready tables
- `/audit-log` audit trail
- `/admin` users, permissions, rules, prompts, guidelines

## Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000/login`.

## Environment

Copy `.env.example` to `.env.local` and fill values as needed.

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/news_risk_monitor?schema=public"
OPENAI_API_KEY=
EMAIL_PROVIDER=mock
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:editor@example.com
```

## Prisma

The full schema is in `prisma/schema.prisma`.

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Models include users, roles, risk entries, categories, tags, legal references, screening logs, approval requests, bookmarks, AI results, audit logs, and AI prompts.
Legal references support `FILE`, `LINK`, and `TEXT` source types plus reusable evaluation criteria for the screening engine.

## Architecture Notes

- Current UI uses mock data in `src/lib/newsroom/mock-data.ts` so the product can run immediately.
- `src/lib/newsroom/risk-engine.ts` is RAG-ready and can be replaced with OpenAI + database/vector search.
- `src/app/api/library-sources/route.ts` accepts file/link/text library sources and generates criteria payloads that the screening engine can use.
- `src/lib/newsroom/email.ts` supports mock, SMTP, Resend, and SendGrid without initializing SDK clients at module scope.
- `src/lib/newsroom/mobile-notifications.ts` sends Web Push notifications to subscribed editor/requester devices. Generate VAPID keys with `npx web-push generate-vapid-keys`.
- Future extensions are prepared for OCR, image moderation, video transcript analysis, speech-to-text, semantic similarity, pgvector, LINE notification, and newsroom workflow automation.
