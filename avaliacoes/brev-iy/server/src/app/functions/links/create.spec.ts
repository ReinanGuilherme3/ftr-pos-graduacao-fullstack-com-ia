import { randomUUID } from 'node:crypto'
import { CreateLink } from '@/app/functions/links/create'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'

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
})
