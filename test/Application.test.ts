import { assert, describe, expect, it } from '@effect/vitest'
import { Console, Effect, Either, ParseResult, Schema } from 'effect'
import { parseError } from 'effect/ParseResult'
import { UserSchema } from '../app/Application'

describe('Domain', () => {
  // https://github.com/react-hook-form/resolvers/blob/master/effect-ts/src/effect-ts.ts

  it.only('should either error', async () => {
    const result = await Schema.decodeUnknown(UserSchema, {
      errors: 'all',
      onExcessProperty: 'ignore',
    })({ email: ' a@Mailbox.com' }).pipe(
      Effect.tapError((parseError) => Console.log(parseError)),
      Effect.catchAll((parseError) =>
        Effect.flip(ParseResult.ArrayFormatter.formatError(parseError))
      ),
      Effect.mapError((issues) =>
        issues.reduce((acc, issue) => {
          // { _tag: 'Missing', path: ["email"], message: 'is missing' },
          acc[issue.path.join('.')] = issue.message
          return acc
        }, {} as Record<string, string>)
      ),
      Effect.either,
      // Effect.tap((value) => Console.log(value)),
      Effect.runPromise
    )
    console.log({ result })
  })

  it('should error', async () => {
    await Schema.decodeUnknown(UserSchema, {
      errors: 'all',
      onExcessProperty: 'ignore',
    })({ email: ' a@Mailbox.com' }).pipe(
      Effect.tapError((parseError) => Console.log(parseError)),
      Effect.catchAll((parseError) =>
        Effect.flip(ParseResult.ArrayFormatter.formatError(parseError))
      ),
      //     { _tag: 'Missing', path: ["email"], message: 'is missing' },
      Effect.mapError((issues) => {
        const validationErrors = issues.reduce((acc, issue) => {
          acc[issue.path.join('.')] = issue.message
          return acc
        }, {})
        return validationErrors
      }),
      Effect.match({
        onFailure: (validationErrors) => ({ validationErrors, value: {} }),
        onSuccess: (value) => ({ validationErrors: {}, value }),
      }),
      Effect.tap((value) => Console.log(value)),
      Effect.runPromise
    )
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

  // it('should handle email', () => {
  //   const s = Schema.String
  //   const sSchema = Schema.asSchema(Schema.String)

  //   const email = Schema.decodeUnknownSync(EmailSchema)('a@mail.com')
  //   // console.log({ email: Schema.decodeUnknownSync(EmailSchema)(' a@mail.com ')})
  //   expect(() => Schema.decodeUnknownSync(EmailSchema)('')).toThrowError(
  //     ParseResult.ParseError
  //   )
  //   expect(() =>
  //     Schema.decodeUnknownSync(EmailSchema)('a@mail.com ')
  //   ).toThrowError(ParseResult.ParseError)
  //   expect(true).toBe(true)
  // })
})
