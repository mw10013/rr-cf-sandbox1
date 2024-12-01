import { Schema } from 'effect'

/// option from non-empty trimmed string
// https://github.com/Effect-TS/effect/issues/3335

// https://www.typescript-validators.com/effect-schema
// https://github.com/dearlordylord/parsers-jamboree/blob/master/libs/effect-ts-schema/src/lib/effect-ts-schema.ts

// const NonEmptyStringBrand = Symbol.for('NonEmptyString')

// const NonEmptyString = Schema.NonEmpty.pipe(Schema.brand(NonEmptyStringBrand))
// const NonEmptyString = Schema.NonEmptyTrimmedString.pipe(Schema.brand(NonEmptyStringBrand))
// type
// NonEmptyString = Schema.Schema.Type<typeof NonEmptyString>

// const EmailBrand = Symbol.for('Email')

// // no built-in email combinator by-design (lot of definitions out there)
// const Email = NonEmptyString.pipe(
//   Schema.pattern(
//     /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i
//   )
// ).pipe(Schema.brand(EmailBrand))
// no built-in email combinator by-design (lot of definitions out there)
// const EmailSchema = Schema.NonEmptyTrimmedString.pipe(
//   Schema.pattern(
//     /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i
//   )
// )

// export const EmailSchema = Schema.NonEmptyString
// export const EmailSchema = Schema.NonEmptyTrimmedString
// export const EmailSchema = Trim
// export const EmailSchema = Schema.compose(Trim, Schema.nonEmptyString)
// export const EmailSchema = Schema.compose(Schema.nonEmptyString, Trim)

const RoleSchema = Schema.Literal('admin', 'customer')
export type Role = typeof RoleSchema.Type
export const roles = RoleSchema.literals
export const isRole = Schema.is(RoleSchema)

export const assertRole: Schema.Schema.ToAsserts<typeof RoleSchema> =
  Schema.asserts(RoleSchema)

const MembershipRoleSchema = Schema.Literal('owner', 'member')
export type MembershipRole = typeof MembershipRoleSchema.Type
export const membershipRoles = MembershipRoleSchema.literals
export const isMembershipRole = Schema.is(MembershipRoleSchema)

export const assertMembershipRole: Schema.Schema.ToAsserts<
  typeof MembershipRoleSchema
> = Schema.asserts(MembershipRoleSchema)

const EmailBrand = Symbol.for('Email')
export const Email = Schema.NonEmptyTrimmedString.pipe(Schema.brand(EmailBrand))

export class User extends Schema.Class<User>('User')({
  userId: Email,
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
