# Workarounds

Workarounds to make all the parts of the application work in all environments

## Unstable Middleware

- As of Aug 1st, 2025, when using react-router (7.7) experimental middleware with vercel builds, the web app fails with
  `"init" is not iterable` because vercel still injects loadContext in the old format (plain object instead of an
  iterable like Map). To fix this, we include a pnpm patch for `react-router`'s `createRequestHandler` function in order
  to check if the object is a Map or not before iterating.

## Prisma

- The engine has to be copied in Vercel/production to avoid errors like
  `Prisma Client could not locate the Query Engine for runtime "rhel-openssl-3.0.x"`. In order to fix that, we include
  the script `scripts/prisma-engine-copy.ts` that is run after production build with the `postbuild:prod` script.

## MDX pages

- Remix / React Router has no builtin support for MD and MDX pages, so we had to build our own. The code can be found at
  `./app/lib/mdx`.

## Vercel Analytics and Speed Insights

As of Aug 1st, 2025, Vercel libraries still don't work well with `react-router` 7+ (they still import remix code). We
copied their code and made some fixes under `./app/lib/vercel`.

## Frequent requests to missing public files

We added some placeholders for frequent requests to public files made by bots and browsers, specially all those
`.well-known/*` ones. This way the react-router server is not triggered and the files are served as static, saving
computing costs.
