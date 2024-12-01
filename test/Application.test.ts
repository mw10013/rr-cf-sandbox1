import { assert, describe, expect, it } from '@effect/vitest'
import { Console, Effect, Either, ParseResult, Schema } from 'effect'
import { User } from '../app/Application'

export const parse = <A, I>(schema: Schema.Schema<A, I>, u: unknown) =>
  // Schema does not have R so we can runPromise() which expects R to be never.
  Schema.decodeUnknown(schema, {
    errors: 'all',
    onExcessProperty: 'ignore',
  })(u).pipe(
    Effect.tapError((parseError) => Console.log(parseError)),
    Effect.catchAll((parseError) =>
      Effect.flip(ParseResult.ArrayFormatter.formatError(parseError))
    ),
    Effect.mapError((issues) =>
      issues.reduce(
        (acc, issue) => {
          // { _tag: 'Missing', path: ["email"], message: 'is missing' },
          acc[issue.path.join('.')] = issue.message
          return acc
        },
        {} as Record<string, string>
      )
    ),
    Effect.either,
    Effect.runPromise
  )

describe('Domain', () => {
  it.only('should parse', async () => {
    const result = await parse(User, {
      email: ' a@Mailbox.com',
    })
    console.log({ result })
  })

  // https://github.com/react-hook-form/resolvers/blob/master/effect-ts/src/effect-ts.ts

  it('should either error', async () => {
    const result = await Schema.decodeUnknown(User, {
      errors: 'all',
      onExcessProperty: 'ignore',
    })({ email: ' a@Mailbox.com' }).pipe(
      Effect.tapError((parseError) => Console.log(parseError)),
      Effect.catchAll((parseError) =>
        Effect.flip(ParseResult.ArrayFormatter.formatError(parseError))
      ),
      Effect.mapError((issues) =>
        issues.reduce(
          (acc, issue) => {
            // { _tag: 'Missing', path: ["email"], message: 'is missing' },
            acc[issue.path.join('.')] = issue.message
            return acc
          },
          {} as Record<string, string>
        )
      ),
      Effect.either,
      // Effect.tap((value) => Console.log(value)),
      Effect.runPromise
    )
    console.log({ result })
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
