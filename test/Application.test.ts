import { assert, describe, it } from '@effect/vitest'
import { Console, Effect, Either, ParseResult, Schema } from 'effect'
import { parse, User, UserCreateForm } from '../app/Application'

describe('Domain', () => {
  it('should parse User', async () => {
    const parseResult = await parse(User)({
      // email: ' a@Mailbox.com',
    })
    console.log({ parseResult })
    assert(Either.isLeft(parseResult))
  })

  it.only('should parse form', async () => {
    const formData = new FormData()
    // formData.append('email', 'a@Mailbox.com')
    formData.append('email', '7')
    const parseResult = await parse(UserCreateForm)(formData)
    console.log({ parseResult })
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
