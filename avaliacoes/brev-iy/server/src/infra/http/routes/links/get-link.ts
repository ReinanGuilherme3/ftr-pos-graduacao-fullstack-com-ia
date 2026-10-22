import { GetLink } from '@/app/functions/links/get-link'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinkRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Get the original link by the shortened link',
        tags: ['links'],
        querystring: z.object({
          linkEncurtado: z.url(),
        }),
        response: {
          200: z
            .object({ id: z.string(), linkOriginal: z.string() })
            .describe('Link found.'),
          404: z
            .object({ message: z.string() })
            .describe('Link not found.'),
        },
      },
    },
    async (request, reply) => {
      const { linkEncurtado } = request.query

      const result = await GetLink({ linkEncurtado })

      if (isRight(result)) {
        return reply.status(200).send(result.right)
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'LinkNotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
