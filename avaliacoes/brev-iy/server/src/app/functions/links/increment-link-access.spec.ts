import { randomUUID } from 'node:crypto'
import { CreateLink } from '@/app/functions/links/create-link'
import { LinkNotFound } from '@/app/functions/links/errors/link-not-found'
import { IncrementLinkAccess } from '@/app/functions/links/increment-link-access'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'
import { describe, expect, it } from 'vitest'

describe('increment link access', () => {
  it('should be able to increment the access count of a link', async () => {
    const created = await CreateLink({
      linkOriginal: 'https://www.google.com',
      linkEncurtado: `https://brev.ly/${randomUUID()}`,
    })

    const { id } = unwrapEither(created) as { id: string }

    await IncrementLinkAccess({ id })
    const sut = await IncrementLinkAccess({ id })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({ quantidadeAcessos: 2 })

    const [result] = await db
      .select({ quantidadeAcessos: schema.links.quantidadeAcessos })
      .from(schema.links)
      .where(eq(schema.links.id, id))

    expect(result.quantidadeAcessos).toBe(2)
  })

  it('should not be able to increment the access count of a link that does not exist', async () => {
    const sut = await IncrementLinkAccess({ id: uuidv7() })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFound)
  })
})
