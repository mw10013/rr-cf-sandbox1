- production: https://rr-cf-sandbox1-production.devxo.workers.dev/
- preview: https://rr-cf-sandbox1-preview.devxo.workers.dev/

# Shadcn ui
- https://ui.shadcn.com/docs/installation/vite - edit tsconfig.json
- pnpx shadcn@latest init
  - style: default
- components.json
  - rsc: true
  - edit aliases

# Typegen

- pnpm typegen
- Remember to run 'wrangler types --x-include-runtime' again if you change 'compatibility_date' or 'compatibility_flags' in your wrangler.toml.
- https://developers.cloudflare.com/workers/languages/typescript/#transitive-loading-of-typesnode-overrides-cloudflareworkers-types
- Since you have Node.js compatibility mode enabled, you should consider adding Node.js for TypeScript by running "npm i --save-dev @types/node@20.8.3". Please see the docs for more details: https://developers.cloudflare.com/workers/languages/typescript/#transitive-loading-of-typesnode-overrides-cloudflareworkers-types
- https://github.com/cloudflare/workerd/issues/1298
- https://github.com/cloudflare/workerd/pull/2708

````
Add the generated types to the types array in your tsconfig.json:

        {
                "compilerOptions": {
                        ...
                        "types": ["./.wrangler/types/runtime.d.ts"]
                        ...
                }
        }


# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

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
npm install
````

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To deploy directly to production:

```sh
npx wrangler deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
