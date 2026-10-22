import { DeleteLink } from '@/app/functions/links/delete-link'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/links/:id',
    {
      schema: {
        summary: 'Delete a link',
        tags: ['links'],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          204: z.null().describe('Link deleted successfully.'),
          404: z
            .object({ message: z.string() })
            .describe('Link not found.'),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await DeleteLink({ id })

      if (isRight(result)) {
        return reply.status(204).send(null)
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'LinkNotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
