# Full Stack Template

A [turborepo](https://turbo.build/repo) template for full-stack TypeScript development.

## Getting Started

Clone the repo or initialize with

```sh
npx create-turbo@latest --example https://github.com/hjdivad/turborepo-template
```

Remove the apps & packages you don't need.

## Developing

```sh
# start up all the dev servers
npm run dev

npm run build
npm run test

npm run format
npm run lint
npm run check-types
```

## What's Inside

This Turborepo includes the following packages and apps:

### Apps and Packages

- `admin`: a [Vite](https://vitejs.dev/) single page app
- `api`: an [Express](https://expressjs.com/) server
- `blog`: a [Remix](https://remix.run/) blog
- `storefront`: a [Next.js](https://nextjs.org/) app
- `wc`: a word-count bin
- `@repo/eslint-config`: ESLint configurations used throughout the monorepo
- `@repo/jest-presets`: Jest configurations
- `@repo/logger`: isomorphic logger (a small wrapper around console.log)
- `@repo/ui`: a dummy React UI library (which contains `<CounterButton>` and `<Link>` components)
- `@repo/typescript-config`: tsconfig.json's used throughout the monorepo
- `@repo/wc`: a library for a word count utility.

