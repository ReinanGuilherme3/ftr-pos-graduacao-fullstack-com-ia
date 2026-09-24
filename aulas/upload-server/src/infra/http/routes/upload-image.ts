import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const uploadImageRoutes: FastifyPluginAsyncZod = async (server) => {
    server.post('/upload', () => {
        return 'Hello World'
    })
}