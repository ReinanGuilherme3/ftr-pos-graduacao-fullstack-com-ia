import { randomUUID } from 'node:crypto'
import { CreateLink } from '@/app/functions/links/create-link'
import { GetLinks } from '@/app/functions/links/get-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { describe, expect, it } from 'vitest'

describe('get links', () => {
  it('should be able to get all links', async () => {
    const linkEncurtado1 = `https://brev.ly/${randomUUID()}`
    const linkEncurtado2 = `https://brev.ly/${randomUUID()}`

    await CreateLink({
      linkOriginal: 'https://www.google.com',
      linkEncurtado: linkEncurtado1,
    })

    await CreateLink({
      linkOriginal: 'https://www.github.com',
      linkEncurtado: linkEncurtado2,
    })

    const sut = await GetLinks()

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          linkOriginal: 'https://www.google.com',
          linkEncurtado: linkEncurtado1,
          criadoEm: expect.any(Date),
        }),
        expect.objectContaining({
          id: expect.any(String),
          linkOriginal: 'https://www.github.com',
          linkEncurtado: linkEncurtado2,
          criadoEm: expect.any(Date),
        }),
      ])
    )
  })
})
