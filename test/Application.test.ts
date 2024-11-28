import { assert, describe, expect, it } from '@effect/vitest'
import { Schema } from 'effect'
import { EmailSchema } from '../app/Application'
import { ParseError } from 'effect/ParseResult'

describe('Domain', () => {
  it('should handle email', () => {
    const email = Schema.decodeUnknownSync(EmailSchema)('a@mail.com')
    assert.equal(
      Schema.decodeUnknownSync(EmailSchema)('a@mail.com'),
      'a@mail.com'
    )
    expect(Schema.decodeUnknownSync(EmailSchema)('a@mail.com')).toBe(
      'a@mail.com'
    )
    expect(() => Schema.decodeUnknownSync(EmailSchema)('')).toThrowError(ParseError)
    console.log({ email })
    expect(true).toBe(true)
  })
})
