import { GetLinks } from '@/app/functions/links/get-links'
import { unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/all',
    {
      schema: {
        summary: 'Get links with cursor pagination',
        tags: ['links'],
        querystring: z.object({
          cursor: z.uuidv7().optional(),
          pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
        }),
        response: {
          200: z
            .object({
              links: z.array(
                z.object({
                  id: z.string(),
                  linkOriginal: z.string(),
                  linkEncurtado: z.string(),
                  quantidadeAcessos: z.number(),
                  criadoEm: z.date(),
                })
              ),
              nextCursor: z.string().nullable(),
            })
            .describe('Page of links.'),
        },
      },
    },
    async (request, reply) => {
      const { cursor, pageSize } = request.query

      const result = await GetLinks({ cursor, pageSize })

      const { links, nextCursor } = unwrapEither(result)

      return reply.status(200).send({ links, nextCursor })
    }
  )
}
