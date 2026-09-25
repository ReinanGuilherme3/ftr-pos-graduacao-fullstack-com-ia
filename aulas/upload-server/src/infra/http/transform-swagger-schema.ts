import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSwaggerSchemaDAta = Parameters<typeof jsonSchemaTransform>[0]

export function transformSwaggerSchema(data: TransformSwaggerSchemaDAta) {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    if (schema.body === undefined) {
      schema.body = {
        type: 'object',
        required: [],
        properties: {},
      }
    }

    const bodySchema = schema.body as { properties: any, required: string[] }

    bodySchema.properties.file = {
      type: 'string',
      format: 'binary',
    }

    bodySchema.required.push('file')
  }

  return { schema, url }
}