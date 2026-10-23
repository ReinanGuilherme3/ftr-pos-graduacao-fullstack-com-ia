import { z } from 'zod'
import { LinkNotFound } from './errors/link-not-found'
import { Either, makeLeft, makeRight } from '@/infra/shared/either'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq, sql } from 'drizzle-orm'

const incrementLinkAccessInput = z.object({
  id: z.uuidv7(),
})

type IncrementLinkAccessInput = z.input<typeof incrementLinkAccessInput>

export async function IncrementLinkAccess(input: IncrementLinkAccessInput): Promise<Either<LinkNotFound, { quantidadeAcessos: number }>> {
  const { id } = incrementLinkAccessInput.parse(input)

  const [link] = await db
    .update(schema.links)
    .set({ quantidadeAcessos: sql`${schema.links.quantidadeAcessos} + 1` })
    .where(eq(schema.links.id, id))
    .returning({ quantidadeAcessos: schema.links.quantidadeAcessos })

  if (!link) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(link)
}
