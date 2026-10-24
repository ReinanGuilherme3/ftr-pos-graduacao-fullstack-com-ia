import { z } from 'zod'
import { Either, makeRight } from '@/infra/shared/either'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { desc, lt } from 'drizzle-orm'

const getLinksInput = z.object({
  cursor: z.uuidv7().optional(),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
})

type GetLinksInput = z.input<typeof getLinksInput>

type GetLinksOutput = {
  links: {
    id: string
    linkOriginal: string
    linkEncurtado: string
    quantidadeAcessos: number
    criadoEm: Date
  }[]
  nextCursor: string | null
}

export async function GetLinks(input: GetLinksInput = {}): Promise<Either<never, GetLinksOutput>> {
  const { cursor, pageSize } = getLinksInput.parse(input)

  // O id é um UUID v7, que cresce com a data de criação, então serve de cursor
  const links = await db
    .select({
      id: schema.links.id,
      linkOriginal: schema.links.linkOriginal,
      linkEncurtado: schema.links.linkEncurtado,
      quantidadeAcessos: schema.links.quantidadeAcessos,
      criadoEm: schema.links.criadoEm,
    })
    .from(schema.links)
    .where(cursor ? lt(schema.links.id, cursor) : undefined)
    .orderBy(desc(schema.links.id))
    .limit(pageSize + 1)

  const hasNextPage = links.length > pageSize
  const page = hasNextPage ? links.slice(0, pageSize) : links

  return makeRight({
    links: page,
    nextCursor: hasNextPage ? page[page.length - 1].id : null,
  })
}
