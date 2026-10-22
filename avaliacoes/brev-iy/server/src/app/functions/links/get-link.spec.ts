import { randomUUID } from 'node:crypto'
import { CreateLink } from '@/app/functions/links/create-link'
import { LinkNotFound } from '@/app/functions/links/errors/link-not-found'
import { GetLink } from '@/app/functions/links/get-link'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { describe, expect, it } from 'vitest'

describe('get link', () => {
  it('should be able to get the original link by the shortened link', async () => {
    const linkEncurtado = `https://brev.ly/${randomUUID()}`

    const created = await CreateLink({
      linkOriginal: 'https://www.google.com',
      linkEncurtado,
    })

    const { id } = unwrapEither(created) as { id: string }

    const sut = await GetLink({ linkEncurtado })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      id,
      linkOriginal: 'https://www.google.com',
    })
  })

  it('should not be able to get a link that does not exist', async () => {
    const sut = await GetLink({
      linkEncurtado: `https://brev.ly/${randomUUID()}`,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFound)
  })
})
