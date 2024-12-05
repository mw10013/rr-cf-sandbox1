import type { Route } from './+types/_index'
import { Button } from '~/lib/components/rac-starter/Button'
// import { Form } from '~/lib/components/rac-starter/Form'
import { TextField } from '~/lib/components/rac-starter/TextField'
import { Welcome } from '../welcome/welcome'
import { Form } from 'react-router'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export function loader({ context }: Route.LoaderArgs) {
  return null
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = String(formData.get('intent'))
  console.log({ intent })
  return null
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <div className="containner p-6">
      <Form method="post" className="max-w-sm">
        <Button type="submit" name="intent" value="seed">
          seed
        </Button>
      </Form>
    </div>
  )
}
