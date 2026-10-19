import { CreateLink } from '@/app/functions/links/create'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a new link',
        tags: ['links'],
        body: z.object({
          linkOriginal: z.url(),
          linkEncurtado: z.url(),
        }),
        response: {
          201: z
            .object({ id: z.string() })
            .describe('Link created successfully.'),
          409: z
            .object({ message: z.string() })
            .describe('Link encurtado already exists.'),
        },
      },
    },
    async (request, reply) => {
      const { linkOriginal, linkEncurtado } = request.body

      const result = await CreateLink({ linkOriginal, linkEncurtado })

      if (isRight(result)) {
        return reply.status(201).send({ id: result.right.id })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'LinkAlreadyExists':
          return reply.status(409).send({ message: error.message })
      }
    }
  )
}
