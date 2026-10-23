import { ExportLinks } from '@/app/functions/links/export-links'
import { unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links/exports',
    {
      schema: {
        summary: 'Export links to CSV',
        tags: ['links'],
        response: {
          200: z
            .object({ reportUrl: z.string() })
            .describe('CSV report generated successfully.'),
        },
      },
    },
    async (_request, reply) => {
      const result = await ExportLinks()

      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
