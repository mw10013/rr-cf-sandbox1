import { assert, describe, expect, it } from '@effect/vitest'
import { Schema } from 'effect'
import { ParseError } from 'effect/ParseResult'
import { EmailSchema } from '../app/Application'

describe('Domain', () => {
  it('should handle email', () => {
    const email = Schema.decodeUnknownSync(EmailSchema)('a@mail.com')
    // console.log({ email: Schema.decodeUnknownSync(EmailSchema)(' a@mail.com ')})
    expect(() => Schema.decodeUnknownSync(EmailSchema)('')).toThrowError(
      ParseError
    )
    expect(() =>
      Schema.decodeUnknownSync(EmailSchema)('a@mail.com ')
    ).toThrowError(ParseError)
    expect(true).toBe(true)
  })
})
