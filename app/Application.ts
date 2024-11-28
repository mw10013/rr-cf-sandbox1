import { Schema } from 'effect'

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

export const EmailSchema = Schema.NonEmptyString