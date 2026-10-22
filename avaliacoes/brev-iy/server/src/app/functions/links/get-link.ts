import { z } from 'zod'
import { LinkNotFound } from './errors/link-not-found'
import { Either, makeLeft, makeRight } from '@/infra/shared/either'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'

const getLinkInput = z.object({
  linkEncurtado: z.url(),
})

type GetLinkInput = z.input<typeof getLinkInput>

export async function GetLink(input: GetLinkInput): Promise<Either<LinkNotFound, { id: string; linkOriginal: string }>> {
  const { linkEncurtado } = getLinkInput.parse(input)

  const [link] = await db
    .select({ id: schema.links.id, linkOriginal: schema.links.linkOriginal })
    .from(schema.links)
    .where(eq(schema.links.linkEncurtado, linkEncurtado))

  if (!link) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(link)
}
