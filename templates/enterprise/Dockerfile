FROM node:24-alpine AS development-dependencies-env
COPY . /webapp
WORKDIR /webapp
RUN pnpm clean-install

FROM node:24-alpine AS production-dependencies-env
COPY ./package.json pnpm-lock.yaml /webapp/
WORKDIR /webapp
RUN pnpm clean-install --prod

FROM node:24-alpine AS build-env
COPY . /webapp/
COPY --from=development-dependencies-env /webapp/node_modules /webapp/node_modules
WORKDIR /webapp
RUN pnpm run build

FROM node:24-alpine
COPY ./package.json pnpm-lock.yaml /webapp/
COPY --from=production-dependencies-env /webapp/node_modules /webapp/node_modules
COPY --from=build-env /webapp/build /webapp/build
WORKDIR /webapp
CMD ["npm", "run", "start"]
