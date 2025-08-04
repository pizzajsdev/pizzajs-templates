# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features of this template

- DDD (Domain Driven Design) architecture and project structure
- File-based routing similar to Next.js App Router, including grouped route support
- Great MDX support with frontmatter validation
- Prisma + PostgreSQL as database
- LRU cache and Redis for caching
- Redis / Upstash for rate limiting
- React Router v7 experimental middleware support
- Better Auth for authentication
- Docker Compose configuration for local development
- TailwindCSS + shadcn/ui components (improved)
- Dark/Light mode support with flash-less theme switching
- Recharts for charts
- React Compiler enabled
- eslint + prettier + stricter TypeScript config for linting and formatting
- madge for circular dependency detection
- Zod for validation
- Dayjs for date handling
- Lucide icons
- Vercel as target deployment provider
- Cursor IDE rules for a great assistive development experience
- Bun for running scripts and unit tests
- Playwright for e2e tests
- GitHub Action workflows for CI/CD
- React Scan integration by running `pnpm dev:debug`
- PWA support and asset builder from logo

## Features of a React Router app

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting
experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
