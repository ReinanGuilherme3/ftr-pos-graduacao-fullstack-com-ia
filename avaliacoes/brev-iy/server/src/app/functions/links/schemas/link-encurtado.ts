import { z } from 'zod'

// O caminho da URL encurtada deve ser um único segmento com letras minúsculas, números ou hífen
const slugRegex = /^\/[a-z0-9-]+$/

export const linkEncurtadoSchema = z.url().refine(
  value => {
    // O Zod v4 executa o refine mesmo quando z.url() falha
    if (!URL.canParse(value)) {
      return false
    }

    const { pathname, search, hash } = new URL(value)

    return slugRegex.test(pathname) && !search && !hash
  },
  {
    message:
      'O link encurtado deve conter apenas letras minúsculas, números ou hífen.',
  }
)
