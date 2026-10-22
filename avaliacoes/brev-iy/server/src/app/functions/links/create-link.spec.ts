import { randomUUID } from 'node:crypto'
import { CreateLink } from '@/app/functions/links/create-link'
import { LinkAlreadyExists } from '@/app/functions/links/errors/link-already-exists'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const linkEncurtado = `https://brev.ly/${randomUUID()}`

    const sut = await CreateLink({
      linkOriginal: 'https://www.google.com',
      linkEncurtado,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({ id: expect.any(String) })

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.linkEncurtado, linkEncurtado))

    expect(result).toHaveLength(1)
  })

  it('should not be able to create a link with a duplicated linkEncurtado', async () => {
    const linkEncurtado = `https://brev.ly/${randomUUID()}`

    await CreateLink({
      linkOriginal: 'https://www.google.com',
      linkEncurtado,
    })

    const sut = await CreateLink({
      linkOriginal: 'https://www.github.com',
      linkEncurtado,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkAlreadyExists)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.linkEncurtado, linkEncurtado))

    expect(result).toHaveLength(1)
  })

  it('should not be able to create a link with a malformed linkOriginal', async () => {
    const linkEncurtado = `https://brev.ly/${randomUUID()}`

    await expect(
      CreateLink({
        linkOriginal: 'url-mal-formatada',
        linkEncurtado,
      }),
    ).rejects.toBeInstanceOf(ZodError)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.linkEncurtado, linkEncurtado))

    expect(result).toHaveLength(0)
  })

  it('should not be able to create a link with a malformed linkEncurtado', async () => {
    const linkEncurtado = `brev.ly ${randomUUID()}`

    await expect(
      CreateLink({
        linkOriginal: 'https://www.google.com',
        linkEncurtado,
      }),
    ).rejects.toBeInstanceOf(ZodError)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.linkEncurtado, linkEncurtado))

    expect(result).toHaveLength(0)
  })
})
