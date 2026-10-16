import { uploadImage } from '@/app/functions/upload-image'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
    server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        tags: ['uploads'],
        consumes: ['multipart/form-data'],
        response: {
          201: z
            .object({ url: z.string() })
            .describe('Image uploaded successfully.'),
          400: z.object({ message: z.string() }),
          499: z
            .object({ message: z.string() })
            .describe('Upload canceled by the client.'),
        },
      },
    },
    async (request, reply) => {

      const uploadedFile = await request.file({ 
        limits: { 
        fileSize: 1024 * 1024 * 2, // 2mb
      } })

      if(!uploadedFile){
        return reply.status(400).send({ message: 'File is required.' })
      }

      let result: Awaited<ReturnType<typeof uploadImage>>

      try {
        result = await uploadImage({
          fileName: uploadedFile.filename,
          contentType: uploadedFile.mimetype,
          contentStream: uploadedFile.file,
        })
      } catch (error) {
        // O web cancela o upload via AbortController: a conexão é fechada no
        // meio do envio e o stream do arquivo quebra. Não é um erro do servidor.
        if (request.raw.destroyed) {
          return reply.status(499).send({ message: 'Upload canceled by client.' })
        }

        throw error
      }

      if(uploadedFile.file.truncated){
        return reply.status(400).send({ message: 'File is too large. Max size is 2MB.' })
      }

      if(isRight(result)){
        return reply.status(201).send({ url: result.right.url })
      }

      const error = unwrapEither(result)

      switch(error.constructor.name){
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}