import type { NavigateOptions } from 'react-router'
import type { Route } from './+types/root'
import { NextUIProvider } from '@nextui-org/react'
// import {BrowserRouter, type NavigateOptions, useHref, useNavigate} from 'react-router-dom';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useHref,
  useNavigate,
} from 'react-router'
import './app.css'

// declare module 'react-aria-components' {
//   interface RouterConfig {
//     routerOptions: NavigateOptions
//   }
// }

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          {/* <RouterProvider navigate={navigate} useHref={useHref}> */}
          {children}
          {/* </RouterProvider> */}
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
