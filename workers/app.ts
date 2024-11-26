import { createRequestHandler } from 'react-router'

declare global {
  interface CloudflareEnvironment {
    // ENVIRONMENT: 'local'
    // SERVICE_NAME: 'rr-cf-sandbox1-local'
    D1: D1Database
  }
}

declare module 'react-router' {
  export interface AppLoadContext {
    VALUE_FROM_CLOUDFLARE: string
    env: CloudflareEnvironment
    // ctx: ExecutionContext
  }
}

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module provided by React Router at build time
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
)

export default {
  fetch(request, env) {
    console.log({ env })
    return requestHandler(request, {
      VALUE_FROM_CLOUDFLARE: 'Hello from Cloudflare',
      env,
    })
  },
} satisfies ExportedHandler<CloudflareEnvironment>
