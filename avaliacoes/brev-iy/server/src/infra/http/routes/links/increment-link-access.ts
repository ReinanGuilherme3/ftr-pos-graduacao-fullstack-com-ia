import { IncrementLinkAccess } from '@/app/functions/links/increment-link-access'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const incrementLinkAccessRoute: FastifyPluginAsyncZod = async server => {
  server.patch(
    '/links/:id/access',
    {
      schema: {
        summary: 'Increment the access count of a link',
        tags: ['links'],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          200: z
            .object({ quantidadeAcessos: z.number() })
            .describe('Access count incremented successfully.'),
          404: z
            .object({ message: z.string() })
            .describe('Link not found.'),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await IncrementLinkAccess({ id })

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
