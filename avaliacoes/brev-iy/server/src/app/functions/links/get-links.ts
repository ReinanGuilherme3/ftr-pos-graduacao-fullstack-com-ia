import { Either, makeRight } from '@/infra/shared/either'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { desc } from 'drizzle-orm'

type GetLinksOutput = {
  links: {
    id: string
    linkOriginal: string
    linkEncurtado: string
    criadoEm: Date
  }[]
}

export async function GetLinks(): Promise<Either<never, GetLinksOutput>> {
  const links = await db
    .select({
      id: schema.links.id,
      linkOriginal: schema.links.linkOriginal,
      linkEncurtado: schema.links.linkEncurtado,
      criadoEm: schema.links.criadoEm,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.criadoEm))

  return makeRight({ links })
}
