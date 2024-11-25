import type { Route } from './+types/d1'

export async function loader({ context }: Route.LoaderArgs) {
  const data = await context.env.D1.prepare('select * from roles')
    // .bind("Bs Beverages")
    .all()

  return { data }
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <pre className="p-4">{JSON.stringify(loaderData.data, null, 2)}</pre>
}
