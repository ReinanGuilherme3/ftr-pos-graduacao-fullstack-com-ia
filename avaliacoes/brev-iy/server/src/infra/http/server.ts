import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createLinkRoute } from './routes/links/create-link'
import { deleteLinkRoute } from './routes/links/delete-link'
import { exportLinksRoute } from './routes/links/export-links'
import { getLinkRoute } from './routes/links/get-link'
import { getLinksRoute } from './routes/links/get-links'
import { incrementLinkAccessRoute } from './routes/links/increment-link-access'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
})

server.register(createLinkRoute)
server.register(deleteLinkRoute)
server.register(getLinkRoute)
server.register(getLinksRoute)
server.register(incrementLinkAccessRoute)
server.register(exportLinksRoute)

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP Server running on http://localhost:${env.PORT}`)
})
