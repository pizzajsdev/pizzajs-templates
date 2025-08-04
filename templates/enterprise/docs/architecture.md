# Project Architecture

## Project structure

This project uses a typical react-router app structure, and it's organized in a way that helps us to keep the code
clean, organized by domains (DDD) and easy to understand.

The `app/` dir contains the main application, `scripts/` contains maintenance scripts, and `public/` contains static
files.

### Directories

#### Project Root

- `app/` the main application
- `docs/` project documentation
- `prisma/` Prisma schema and migrations
- `public/` public static files
- `scripts/` maintenance scripts
- `tests-e2e/` e2e tests (Playwright)

Other directories:

- `.cursor/` Cursor rules and settings
- `.local/` development environment files (database data, and anything you want to put here)
- `.vscode/` VSCode settings
- `patches/` necessary patches to libraries (created using `pnpm patch`)

#### App

- `app/` the main application
- `app/components/layout/` main layout components
- `app/components/ui/` reusable UI components from shadcn/ui and custom
- `app/domain/*` domain-specific code (Domain-Driven Design). Code in this layer should not use any code from the
  runtime layer directly or indirectly.
  - `[name]/repos/example-repository.ts`: Repository abstracting the underlying ORM/DB engine. A repository usually
    define CRUD operations for the domain. Each repository should have an interface and at least one implementation.
    Example: `app/domain/users/repos/user-repository.ts`
  - `[name]/services/example-service.ts`: Service layer. A service defines the business logic for the domain, and can
    use one or more repositories and other services via interfaces. Each service should have an interface and at least
    one implementation.
  - `[name]/components/example.tsx`: Components and Views specific to the domain.
  - `[name]/types.ts`: Types specific to the domain.
  - `[name]/utils.ts`: Utility specific to the domain.
  - `[name]/validation.ts`: Validation functions specific to the domain.
  - `entity-types.ts`: Abstraction and augmentation of vendor-generated types such as Better Auth session and Prisma
    entity types (e.g. adding types to json fields). Use the types in here in your repositories/services instead of
    using the Prisma types directly.
  - `types.ts`: Types shared by all the domains.
  - `utils.ts`: Utility functions shared by all the domains.
- `app/generated/` generated files (such as the Prisma client). Don't edit these files manually.
- `app/hooks/` Reusable React hooks.
- `app/lib/` generic code. Code that is not specific to any domain or app specifics, but is used by the application.
- `app/routes/` File-based router, very similar to Next.js App router.
- `app/runtime/` runtime code (such as the Prisma client, and instances to other services and repositories). Here is
  where all DDD dependencies are injected and used.
- `app/runtime/contexts.server.ts` React Router server contexts and helpers.
- `app/runtime/middlewares.server.ts` React Router middlewares.
- `app/styles/` CSS files. Instead of having a big global CSS file, we split the styles into smaller files here.
- `app/app.css` Global CSS file importing others from the `app/styles/` dir.
- `app/config.ts` Application configuration (non-sensitive data), such as titles, URLs, etc.
- `app/root.tsx` React Router root layout.
- `app/routes.ts` Application routes (populates the `app/routes/` dir).

## Styling and UI components

This project uses TailwindCSS and shadcn/ui components. This combination is a great choice for modern web development,
since it avoids the need of reinventing the wheel while still have high customization, and allows us to focus on the
business logic and app features.

LLMs also understand these libraries well, so we can ask them to generate code for us easily.

## Databases and ORMs

We have used both Prisma and Drizzle ORMs, but we have decided to use Prisma for its great developer experience and ease
of use.

The database engine is PostgreSQL for the main database, and Redis for caching and rate limiting (integrating with
Upstash).

Upstash is the easiest way to get a Redis instance up and running in a cloud provider, and it is very cheap.

## Environment variables

To detect the environment name without depending on third-party env vars and have full control, we use the `APP_ENV`
environment variable, which can be set to `development`, `production`, or `preview`.

## Cloud Provider

This project uses Vercel as the cloud provider. Despite of its pricing, Vercel is a great choice for convenience and
ease of use:

- Serverless architecture
- Usually good developer experience
- Usually easy to deploy and configure
- Good observability tools

We also use some Vercel specific libraries for observability and analytics:

- `@vercel/speed-insights` for speed insights
- `@vercel/analytics` for analytics

## Testing

We use Playwright for e2e testing, and Bun for unit testing.

## CI/CD

We use GitHub Actions for CI/CD. This allows us to run tests and checks in isolation from Vercel, as well as having
scheduled scripts to run on a regular basis.

With Vercel if you need to run scheduled scripts, you need to create a public API endpoint, which is not very
convenient.

## Documentation

We use a combination of Markdown files and MDX files for documentation.

## Code organization
