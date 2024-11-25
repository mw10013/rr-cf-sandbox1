import type { Route } from './+types/d1'

export function loader(args: Route.LoaderArgs) {
  console.log({ args })
  return { message: 'yo' }
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <div className="p-4 text-2xl font-bold">{loaderData.message}</div>
}
