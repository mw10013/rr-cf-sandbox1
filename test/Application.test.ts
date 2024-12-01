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
      //     { _tag: 'Missing', path: ["name"], message: 'is missing' },
      Effect.mapError((issues) => {
        const validationErrors = issues.reduce((acc, issue) => {
          acc[issue.path.join('.')] = issue.message
          return acc
        }, {})
        return validationErrors
      }),
      Effect.match({
        onFailure: (errors) => ({ errors, value: {} }),
        onSuccess: (value) => ({ errors: {}, value }),
      }),
      Effect.tap((value) => Console.log(value)),
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
