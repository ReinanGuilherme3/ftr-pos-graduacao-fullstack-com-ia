import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors} from 'fastify-type-provider-zod'
import { uploadImageRoutes } from './routes/upload-image'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error,request,reply) => {
  if(hasZodFastifySchemaValidationErrors(error)){
    return reply.status(400).send({ 
      message: 'Validation error', 
      issues: error.validation, })
  }

  // Envia o erro p/ alguma ferramenta de observabilidade (Datadog/Grafana/Sentry/OTEL)

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, { origin: '*' })

server.register(uploadImageRoutes)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP Server running on http://localhost:3333')
})
