import type { Route } from './+types/d1'

export async function loader({ context }: Route.LoaderArgs) {
  const { results } = await context.env.D1.prepare('select * from roles')
    // .bind("Bs Beverages")
    .all()

  console.log({ results })

  return { message: 'yo', results }
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <pre className="p-4">{JSON.stringify(loaderData.results, null, 2)}</pre>
  )
}
