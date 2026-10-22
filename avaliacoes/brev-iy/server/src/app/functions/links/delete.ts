import { z } from 'zod'
import { LinkNotFound } from './errors/link-not-found'
import { Either, makeLeft, makeRight } from '@/infra/shared/either'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'

const deleteLinkInput = z.object({
  id: z.uuidv7(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function DeleteLink(input: DeleteLinkInput): Promise<Either<LinkNotFound, null>> {
  const { id } = deleteLinkInput.parse(input)

  const [deleted] = await db
    .delete(schema.links)
    .where(eq(schema.links.id, id))
    .returning({ id: schema.links.id })

  if (!deleted) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(null)
}
