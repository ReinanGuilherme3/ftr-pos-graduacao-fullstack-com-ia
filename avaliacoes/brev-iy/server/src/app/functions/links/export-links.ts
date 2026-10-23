import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { Either, makeRight } from '@/infra/shared/either'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { stringify } from 'csv-stringify'
import { desc } from 'drizzle-orm'

type ExportLinksOutput = {
  reportUrl: string
}

export async function ExportLinks(): Promise<Either<never, ExportLinksOutput>> {
  const { sql, params } = db
    .select({
      id: schema.links.id,
      linkOriginal: schema.links.linkOriginal,
      linkEncurtado: schema.links.linkEncurtado,
      quantidadeAcessos: schema.links.quantidadeAcessos,
      criadoEm: schema.links.criadoEm,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.criadoEm))
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'link_original', header: 'Link original' },
      { key: 'link_encurtado', header: 'Link encurtado' },
      { key: 'quantidade_acessos', header: 'Quantidade de acessos' },
      { key: 'criado_em', header: 'Criado em' },
    ],
    cast: {
      date: value => value.toISOString(),
    },
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-links.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  return makeRight({ reportUrl: url })
}
