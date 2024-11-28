import { Schema } from 'effect'
import { Trim } from 'effect/Schema'


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

const EmailBrand = Symbol.for('Email')

// no built-in email combinator by-design (lot of definitions out there)
// const EmailSchema = Schema.NonEmptyTrimmedString.pipe(
//   Schema.pattern(
//     /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i
//   )
// )

// export const EmailSchema = Schema.NonEmptyString
// export const EmailSchema = Schema.NonEmptyTrimmedString
export const EmailSchema = Schema.NonEmptyTrimmedString.pipe(Schema.brand(EmailBrand))
// export const EmailSchema = Trim
// export const EmailSchema = Schema.compose(Trim, Schema.nonEmptyString)
// export const EmailSchema = Schema.compose(Schema.nonEmptyString, Trim)
