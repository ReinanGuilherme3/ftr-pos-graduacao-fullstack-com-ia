import { GetLinks } from '@/app/functions/links/get-links'
import { unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/all',
    {
      schema: {
        summary: 'Get all links',
        tags: ['links'],
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
            })
            .describe('List of links.'),
        },
      },
    },
    async (_request, reply) => {
      const result = await GetLinks()

      const { links } = unwrapEither(result)

      return reply.status(200).send({ links })
    }
  )
}
