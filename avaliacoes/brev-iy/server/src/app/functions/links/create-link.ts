import { z } from 'zod'
import { LinkAlreadyExists } from './errors/link-already-exists'
import { linkEncurtadoSchema } from './schemas/link-encurtado'
import { Either, makeLeft, makeRight } from '@/infra/shared/either'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'

const createLinkInput = z.object({
  linkOriginal: z.url(),
  linkEncurtado: linkEncurtadoSchema,
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function CreateLink(input: CreateLinkInput): Promise<Either<LinkAlreadyExists, { id: string }>> {
  const { linkOriginal, linkEncurtado } = createLinkInput.parse(input)

  const [existing] = await db
    .select({ id: schema.links.id })
    .from(schema.links)
    .where(eq(schema.links.linkEncurtado, linkEncurtado))

  if (existing) {
    return makeLeft(new LinkAlreadyExists())
  }

  const [link] = await db
    .insert(schema.links)
    .values({ linkOriginal, linkEncurtado })
    .returning({ id: schema.links.id })

  return makeRight({ id: link.id })
}