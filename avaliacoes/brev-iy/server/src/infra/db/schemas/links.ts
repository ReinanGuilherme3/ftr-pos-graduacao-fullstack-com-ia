import {integer, pgTable, text, timestamp} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const links = pgTable('links', {
    id: text('id').primaryKey().$defaultFn(() => uuidv7()),
    linkOriginal: text('link_original').notNull(),
    linkEncurtado: text('link_encurtado').notNull(),
    quantidadeAcessos: integer('quantidade_acessos').notNull().default(0),
    criadoEm: timestamp('criado_em').notNull().defaultNow()
})
