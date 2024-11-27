import type { Route } from './+types/d1'
// import { Button } from '~/lib/components/ui/button'
import { invariant } from '@epic-web/invariant'
import { Button } from '~/lib/components/rac-starter/Button'
import { Form } from '~/lib/components/rac-starter/Form'
import { TextField } from '~/lib/components/rac-starter/TextField'

export async function loader({ context }: Route.LoaderArgs) {
  const data = await context.cloudflare.env.D1.prepare('select * from roles')
    // .bind("Bs Beverages")
    .all()

  return { data }
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = String(formData.get('intent'))
  console.log({ intent })

  switch (intent) {
    case 'form_1': {
      const email = String(formData.get('email'))
      invariant(typeof email === 'string' && email, 'Missing email')
      console.log({ email })
      break
    }
  }
  return null
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container p-6">
      <Form method="post" className="max-w-sm">
        <TextField name="email" label="Email" />
        <Button type="submit" name="intent" value="form_1">
          form_1
        </Button>
      </Form>
      <pre>{JSON.stringify(loaderData.data, null, 2)}</pre>
    </div>
  )
}
