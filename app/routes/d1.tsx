import type { Route } from './+types/d1'
// import { Button } from '~/lib/components/ui/button'
import { invariant } from '@epic-web/invariant'
import { Either } from 'effect'
import { useSubmit } from 'react-router'
import { parse, UserCreateForm } from '~/Application'
import { Button } from '~/lib/components/rac-starter/Button'
import { Form } from '~/lib/components/rac-starter/Form'
import { TextField } from '~/lib/components/rac-starter/TextField'

export async function loader({ context }: Route.LoaderArgs) {
  const data = await context.cloudflare.env.D1.prepare(
    'select * from users'
  ).run()
  return { data }
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = String(formData.get('intent'))
  console.log({ intent })
  const parseResult = await parse(UserCreateForm)(formData)
  return {
    validationErrors: Either.isLeft(parseResult) ? parseResult.left : undefined,
  }
}
/*
  const intent = String(formData.get('intent'))
  console.log({ intent })
  switch (intent) {
    case 'user_create': {
      const parseResult = await parse(UserCreateForm)(formData)
      // console.log({ parseResult })
      return {
        validationErrors: Either.isLeft(parseResult)
          ? parseResult.left
          : undefined,
      }
    }
    // case 'user_create': {
    //   const decode = Schema.decodeSync(UserCreateFormSchema)(formData)
    //   const either = Schema.decodeEither(UserCreateFormSchema)(formData)
    //   const email = String(formData.get('email'))
    //   invariant(typeof email === 'string' && email, 'Missing email')
    //   console.log({ email })
    //   const d1Result = await context.cloudflare.env.D1.prepare(
    //     `insert into users (email, role) values (?, 'customer')`
    //   )
    //     .bind(email)
    //     .run()
    //   return { d1Result, decode, either }
    // }
    // case 'user_delete': {
    //   const email = String(formData.get('email'))
    //   invariant(typeof email === 'string' && email, 'Missing email')
    //   console.log({ email })
    //   const data = await context.cloudflare.env.D1.prepare(
    //     `delete from users where email = ?`
    //   )
    //     .bind(email)
    //     .run()
    //   console.log({ data })
    //   return data
    // }
    default:
      throw new Error(`Unknown intent: ${intent}`)
  }
      */

export default function RouteComponent({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const submit = useSubmit()
  let onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit(e.currentTarget)
  }

  return (
    <div className="container p-6">
      <Form
        method="post"
        className="max-w-sm"
        validationErrors={actionData?.validationErrors || {}}
        onSubmit={onSubmit}>
        <TextField name="email" label="Email" />
        <input type="hidden" name="intent" value="user_create" />
        <Button type="submit">user_create</Button>
      </Form>
      {/* <Form method="post" className="max-w-sm">
        <TextField name="email" label="Email" />
        <Button type="submit" name="intent" value="user_delete">
          user_delete
        </Button>
      </Form> */}
      <pre>{JSON.stringify({ actionData, loaderData }, null, 2)}</pre>
    </div>
  )
}
