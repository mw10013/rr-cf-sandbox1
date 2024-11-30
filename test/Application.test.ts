import { assert, describe, expect, it } from '@effect/vitest'
import { Console, Effect, Either, ParseResult, Schema } from 'effect'
import { parseError } from 'effect/ParseResult'
import { EmailSchema } from '../app/Application'

describe('Domain', () => {
  // https://github.com/react-hook-form/resolvers/blob/master/effect-ts/src/effect-ts.ts
  it.only('should error', async () => {
    const Person = Schema.Struct({
      name: Schema.String,
      age: Schema.Number,
    })

    const result = await Schema.decodeUnknown(Person, {
      errors: 'all',
      onExcessProperty: 'ignore',
    })({}).pipe(
      Effect.tapError((parseError) => Console.log(parseError)),
      Effect.catchAll((parseError) =>
        Effect.flip(ParseResult.ArrayFormatter.formatError(parseError))
      ),
      Effect.match({
        onFailure: (errors) => ({ errors, values: {} }),
        onSuccess: (result) => ({ errors: {}, values: result }),
      }),
      // Effect.tap((result) => Console.log(result)),
      Effect.tapBoth({
        onFailure: (errors) => Console.log(errors),
        onSuccess: (result) => Console.log(result),
      }),
      Effect.runPromise
    )
    // console.log({ result })
  })

  it('should error', () => {
    const Person = Schema.Struct({
      name: Schema.String,
      age: Schema.Number,
    }).annotations({ title: 'Person' }) // Add a title annotation

    const decode = Schema.decodeUnknownEither(Person, { errors: 'all' })

    const result = decode({})
    if (Either.isLeft(result)) {
      console.error('Decoding failed:')
      console.error(ParseResult.TreeFormatter.formatErrorSync(result.left))
    }
  })

  it('should handle email', () => {
    const s = Schema.String
    const sSchema = Schema.asSchema(Schema.String)

    const email = Schema.decodeUnknownSync(EmailSchema)('a@mail.com')
    // console.log({ email: Schema.decodeUnknownSync(EmailSchema)(' a@mail.com ')})
    expect(() => Schema.decodeUnknownSync(EmailSchema)('')).toThrowError(
      ParseResult.ParseError
    )
    expect(() =>
      Schema.decodeUnknownSync(EmailSchema)('a@mail.com ')
    ).toThrowError(ParseResult.ParseError)
    expect(true).toBe(true)
  })
})
