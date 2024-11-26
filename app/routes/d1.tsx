import type { Route } from './+types/d1'

// import { Button } from '~/lib/rac/Button'

export async function loader({ context }: Route.LoaderArgs) {
  const data = await context.env.D1.prepare('select * from roles')
    // .bind("Bs Beverages")
    .all()

  return { data }
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container p-6">
      <p>Does this show up?"</p>
      {/* <Button>Click me</Button> */}
      <pre>{JSON.stringify(loaderData.data, null, 2)}</pre>
    </div>
  )
}
