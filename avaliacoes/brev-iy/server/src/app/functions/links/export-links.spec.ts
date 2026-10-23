import { randomUUID } from 'node:crypto'
import { CreateLink } from '@/app/functions/links/create-link'
import { ExportLinks } from '@/app/functions/links/export-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { describe, expect, it, vi } from 'vitest'

describe('export links', () => {
  it('should be able to export links', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const linkEncurtado1 = `https://brev.ly/${randomUUID()}`
    const linkEncurtado2 = `https://brev.ly/${randomUUID()}`

    const created1 = await CreateLink({
      linkOriginal: 'https://www.google.com',
      linkEncurtado: linkEncurtado1,
    })

    const created2 = await CreateLink({
      linkOriginal: 'https://www.github.com',
      linkEncurtado: linkEncurtado2,
    })

    const { id: id1 } = unwrapEither(created1) as { id: string }
    const { id: id2 } = unwrapEither(created2) as { id: string }

    const sut = await ExportLinks()

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCSVStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv')
    expect(csvAsArray[0]).toEqual([
      'ID',
      'Link original',
      'Link encurtado',
      'Quantidade de acessos',
      'Criado em',
    ])
    expect(csvAsArray).toEqual(
      expect.arrayContaining([
        [id1, 'https://www.google.com', linkEncurtado1, '0', expect.any(String)],
        [id2, 'https://www.github.com', linkEncurtado2, '0', expect.any(String)],
      ])
    )
  })
})
