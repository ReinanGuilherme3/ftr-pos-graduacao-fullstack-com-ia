import { randomUUID } from 'node:crypto'
import { CreateLink } from '@/app/functions/links/create-link'
import { GetLinks } from '@/app/functions/links/get-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { describe, expect, it } from 'vitest'

async function makeLink(linkOriginal: string) {
  const linkEncurtado = `https://brev.ly/${randomUUID()}`

  const created = await CreateLink({ linkOriginal, linkEncurtado })
  const { id } = unwrapEither(created) as { id: string }

  return { id, linkOriginal, linkEncurtado }
}

describe('get links', () => {
  it('should be able to get the links from the most recent', async () => {
    const link1 = await makeLink('https://www.google.com')
    const link2 = await makeLink('https://www.github.com')

    const sut = await GetLinks({ pageSize: 100 })

    expect(isRight(sut)).toBe(true)

    const { links } = unwrapEither(sut)
    const ids = links.map(link => link.id)

    expect(links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...link1,
          quantidadeAcessos: 0,
          criadoEm: expect.any(Date),
        }),
        expect.objectContaining({
          ...link2,
          quantidadeAcessos: 0,
          criadoEm: expect.any(Date),
        }),
      ])
    )
    expect(ids.indexOf(link2.id)).toBeLessThan(ids.indexOf(link1.id))
  })

  it('should be able to limit the page size and return the next cursor', async () => {
    await makeLink('https://www.google.com')
    await makeLink('https://www.github.com')

    const sut = await GetLinks({ pageSize: 1 })

    const { links, nextCursor } = unwrapEither(sut)

    expect(links).toHaveLength(1)
    expect(nextCursor).toBe(links[0].id)
  })

  it('should be able to get the next page using the cursor', async () => {
    const link1 = await makeLink('https://www.google.com')
    const link2 = await makeLink('https://www.github.com')
    const link3 = await makeLink('https://www.rocketseat.com.br')

    const sut = await GetLinks({ cursor: link3.id, pageSize: 100 })

    const { links } = unwrapEither(sut)
    const ids = links.map(link => link.id)

    expect(ids).not.toContain(link3.id)
    expect(ids).toContain(link2.id)
    expect(ids).toContain(link1.id)
    expect(ids.every(id => id < link3.id)).toBe(true)
    expect(ids.indexOf(link2.id)).toBeLessThan(ids.indexOf(link1.id))
  })
})
