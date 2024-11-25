import { createRequestHandler } from 'react-router'

declare global {
  // interface CloudflareEnvironment {}
  interface CloudflareEnvironment extends Env {}
}

declare module 'react-router' {
  export interface AppLoadContext {
    VALUE_FROM_CLOUDFLARE: string
  }
}

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module provided by React Router at build time
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
)

export default {
  fetch(request, env, ctx) {
    console.log({ env, d1: env.D1 })
    return requestHandler(request, {
      VALUE_FROM_CLOUDFLARE: 'Hello from Cloudflare',
      env,
      ctx,
    })
  },
} satisfies ExportedHandler<CloudflareEnvironment>
