import { randomUUID } from 'node:crypto'
import { CreateLink } from '@/app/functions/links/create'
import { DeleteLink } from '@/app/functions/links/delete'
import { LinkNotFound } from '@/app/functions/links/errors/link-not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'
import { describe, expect, it } from 'vitest'

describe('delete link', () => {
  it('should be able to delete a link', async () => {
    const created = await CreateLink({
      linkOriginal: 'https://www.google.com',
      linkEncurtado: `https://brev.ly/${randomUUID()}`,
    })

    const { id } = unwrapEither(created) as { id: string }

    const sut = await DeleteLink({ id })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, id))

    expect(result).toHaveLength(0)
  })

  it('should not be able to delete a link that does not exist', async () => {
    const sut = await DeleteLink({ id: uuidv7() })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFound)
  })
})
