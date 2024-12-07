import type { Route } from './+types/_index'
// import { range } from "effect/Array"
import * as Arr from 'effect/Array'
import { TableBody } from 'react-aria-components'
import { Form } from 'react-router'
import { Button } from '~/lib/components/rac-starter/Button'
import {
  Cell,
  Column,
  Row,
  Table,
  TableHeader,
} from '~/lib/components/rac-starter/Table'
import TableExample from '~/lib/components/TableExmple'
import { Example } from '~/lib/components/TableStarterExample1'
import { TableStockExample } from '~/lib/components/TableStockExample'

// import { Form } from '~/lib/components/rac-starter/Form'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export async function loader({ context }: Route.LoaderArgs) {
  const d1 = context.cloudflare.env.D1
  const result = await d1
    .prepare('select * from users')
    .run<{ userId: number; email: string; name: string; role: string }>()
  return { users: result.results, result }
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = String(formData.get('intent'))
  console.log({ intent })
  switch (intent) {
    case 'seed':
      {
        const d1 = context.cloudflare.env.D1
        await d1.prepare('delete from users').run()
        const users = Arr.range(1, 10)
          .map((v) => `('${v}@mail.com', 'name-${v}', 'customer')`)
          .join(',')
        const result = await d1
          .prepare(
            `insert into users (email, name, role) values 
          ('admin@mail.com', 'admin', 'admin'),
          ('a@mail.com', 'a', 'customer'),
          ${users}`
          )
          .run()
        console.log({ result })
      }
      break
    default:
      throw new Error(`Unsupported intent: ${intent}`)
  }
  return null
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col space-y-4 p-6">
      <Form method="post" className="max-w-sm">
        <Button type="submit" name="intent" value="seed">
          Seed
        </Button>
      </Form>
      <TableStockExample />
      <TableExample />
      <Example
        onCellAction={null}
        onRowAction={null}
        selectionMode="multiple"
      />
      <Table>
        <TableHeader>
          <Column isRowHeader>ID</Column>
          <Column>Email</Column>
          <Column>Name</Column>
        </TableHeader>
        <TableBody items={loaderData.users}>
          {(user) => (
            <Row id={user.userId}>
              <Cell>{user.userId}</Cell>
              <Cell>{user.email}</Cell>
              <Cell>{user.name}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
      <pre>{JSON.stringify({ loaderData }, null, 2)}</pre>
    </div>
  )
}
