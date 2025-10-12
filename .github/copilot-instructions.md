## Quick orientation — Discord_clone (Next.js app-router)

- Tech: Next.js 15 (app router), TypeScript, Prisma (MongoDB), Clerk (auth), UploadThing (file uploads), TailwindCSS.
- Entry points: server/client split in `app/` (layouts and route handlers live under `app/api/*`).

## Big-picture architecture (how things connect)

- Auth: Clerk is used server- and client-side. See `app/layout.tsx` (ClerkProvider) and `lib/current-profile.ts` (server auth helper using `auth()`).
- DB: Prisma with MongoDB. Generated client lives in `lib/generated/prisma` and the singleton is exposed from `lib/db.ts`.
- Uploads: UploadThing middleware and route at `app/api/uploadthing/*`. Client helpers at `lib/uploadthing.ts` and `components/file-upload.tsx`.
- UI/State: Modal state is a small Zustand store `lib/hooks/use-modal-store.ts` and mounted via `ModalProvider` in `app/layout.tsx`.

## API patterns & examples

- App-router API handlers export HTTP methods (e.g. `export async function DELETE(...)`) under `app/api/*`. Example: `app/api/servers/[id]/leave/route.ts`.
- Dynamic route handlers receive segmentData as `{ params: Promise<{ id: string }> }` in some files — await `segmentData.params` to access route params (see `app/api/servers/[id]/leave/route.ts`).
- Responses use `NextResponse.json(...)` consistently for status and JSON body.

## Conventions & patterns to follow

- Server helpers: use `lib/current-profile.ts` to get the current profile on server routes/components instead of duplicating Clerk logic.
- Prisma client: import `db` from `lib/db.ts` (it implements a global singleton for dev to avoid connection explosion).
- Client components must include "use client" at the top (see `components/modals/*` and `components/file-upload.tsx`).
- Forms: react-hook-form + zod resolver is used across modals (example: `components/modals/create-server-modal.tsx`). Follow that pattern for validation.
- File upload: use UploadThing's generated `UploadButton`/`UploadDropzone` from `lib/uploadthing.ts` and call server delete at `/api/uploadthing/delete` if needed.

## Environment & runtime notes

- Required env vars (examples in repository `.env`): DATABASE_URL (Mongo connection), NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, UPLOADTHING_TOKEN.
- UploadThing route uses `process.env.UPLOADTHING_TOKEN` in `app/api/uploadthing/route.ts` — ensure token present in env when running locally or deploying.

## Dev / build / debug commands

- Install deps and run dev server:

  npm install
  npm run dev

- Build / preview:

  npm run build
  npm start

- Type generation / Prisma: if you change `prisma/schema.prisma` regenerate the client:

  npx prisma generate

## Files to inspect for common tasks (examples)

- Add server APIs: look at `app/api/servers/route.ts` and `app/api/servers/[id]/route.ts` for patterns (auth -> validate -> db -> NextResponse).
- Work with uploads: `app/api/uploadthing/core.ts`, `app/api/uploadthing/route.ts`, `components/file-upload.tsx`, `lib/uploadthing.ts`.
- Authentication details: `lib/current-profile.ts`, `middleware.ts` (route matcher for public routes).

## Small gotchas discovered in this repo

- Prisma + MongoDB: the project stores a generated Prisma client in `lib/generated/prisma` — editing the schema requires `prisma generate` and careful migration steps for Mongo.
- Middleware: `middleware.ts` uses `createRouteMatcher(["/sign-in(.*)", "/api/uploadthing"])` — routes that bypass Clerk are configured here.
- Next.js image remote patterns are configured in `next.config.js` for UploadThing/UTFS hostnames; update them if adding new image hosts.

If anything here is unclear or you'd like more examples (line pointers or a short checklist for contributing), tell me which part and I will iterate.
