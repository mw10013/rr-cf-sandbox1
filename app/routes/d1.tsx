import type { Route } from './+types/d1'
// import { Button } from '~/lib/components/ui/button'
import { invariant } from '@epic-web/invariant'
import { Schema } from 'effect'
import { Button } from '~/lib/components/rac-starter/Button'
import { Form } from '~/lib/components/rac-starter/Form'
import { TextField } from '~/lib/components/rac-starter/TextField'

const RoleSchema = Schema.Literal('admin', 'customer')
export type Role = typeof RoleSchema.Type
export const roles = RoleSchema.literals
export const isRole = Schema.is(RoleSchema)

export const assertsRole: Schema.Schema.ToAsserts<typeof RoleSchema> =
  Schema.asserts(RoleSchema)

const MembershipRoleSchema = Schema.Literal('owner', 'member')
export type MembershipRole = typeof MembershipRoleSchema.Type
export const membershipRoles = MembershipRoleSchema.literals
export const isMembershipRole = Schema.is(MembershipRoleSchema)

export const assertsMembershipRole: Schema.Schema.ToAsserts<
  typeof MembershipRoleSchema
> = Schema.asserts(MembershipRoleSchema)

export class User extends Schema.Class<User>('User')({
  userId: Schema.Number,
  email: Schema.String,
  name: Schema.String,
  role: RoleSchema,
}) {}

export class Organization extends Schema.Class<Organization>('Organization')({
  organizationId: Schema.Number,
  name: Schema.String,
}) {}

export class Membership extends Schema.Class<Membership>('Membership')({
  organizationId: Schema.Number,
  userId: Schema.Number,
  membershipRole: MembershipRoleSchema,
}) {}

export class MembershipAggregate extends Membership.extend<MembershipAggregate>(
  'MembershipAggregate'
)({
  userEmail: Schema.String,
  userName: Schema.String,
}) {}

export class OrganizationAggregate extends Organization.extend<OrganizationAggregate>(
  'OrganizationAggregate'
)({
  memberships: Schema.Array(MembershipAggregate),
}) {}

// https://discord.com/channels/795981131316985866/847382157861060618/threads/1270826681505939517
// https://effect.website/play#f56afd8f1a9a
const FormDataFromSelf = Schema.instanceOf(FormData).annotations({
  identifier: 'FormDataFromSelf',
})

const RecordFromFormData = Schema.transform(
  FormDataFromSelf,
  Schema.Record({ key: Schema.String, value: Schema.String }),
  {
    strict: false,
    decode: (formData) => Object.fromEntries(formData.entries()),
    encode: (data) => {
      const formData = new FormData()
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value)
      }
      return formData
    },
  }
).annotations({ identifier: 'RecordFromFormData' })

const FormDataSchema = <A, I extends Record<string, string>, R>(
  schema: Schema.Schema<A, I, R>
) => Schema.compose(RecordFromFormData, schema, { strict: false })

const UserCreateFormSchema = FormDataSchema(
  Schema.Struct({ email: Schema.String })
)

export async function loader({ context }: Route.LoaderArgs) {
  const data = await context.cloudflare.env.D1.prepare('select * from users')
    // .bind("Bs Beverages")
    .run()

  return { data }
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = String(formData.get('intent'))
  console.log({ intent })

  switch (intent) {
    case 'user_create': {
      const decode = Schema.decodeSync(UserCreateFormSchema)(formData)
      const either = Schema.decodeEither(UserCreateFormSchema)(formData)
      const email = String(formData.get('email'))
      invariant(typeof email === 'string' && email, 'Missing email')
      console.log({ email })
      const d1Result = await context.cloudflare.env.D1.prepare(
        `insert into users (email, role) values (?, 'customer')`
      )
        .bind(email)
        .run()
      return { d1Result, decode, either }
    }
    case 'user_delete': {
      const email = String(formData.get('email'))
      invariant(typeof email === 'string' && email, 'Missing email')
      console.log({ email })
      const data = await context.cloudflare.env.D1.prepare(
        `delete from users where email = ?`
      )
        .bind(email)
        .run()
      console.log({ data })
      return data
    }
    default:
      throw new Error(`Unknown intent: ${intent}`)
  }
}

export default function RouteComponent({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <div className="container p-6">
      <Form method="post" className="max-w-sm">
        <TextField name="email" label="Email" />
        <Button type="submit" name="intent" value="user_create">
          user_create
        </Button>
      </Form>
      <Form method="post" className="max-w-sm">
        <TextField name="email" label="Email" />
        <Button type="submit" name="intent" value="user_delete">
          user_delete
        </Button>
      </Form>
      <pre>{JSON.stringify({ actionData, loaderData }, null, 2)}</pre>
    </div>
  )
}
