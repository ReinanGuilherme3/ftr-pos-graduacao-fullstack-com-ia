import { api } from "../lib/api";

export interface Link {
  id: string;
  linkOriginal: string;
  linkEncurtado: string;
  quantidadeAcessos: number;
  criadoEm: string;
}

interface GetLinksParams {
  cursor?: string;
  pageSize?: number;
}

interface GetLinksResponse {
  links: Link[];
  nextCursor: string | null;
}

export async function getLinks({ cursor, pageSize }: GetLinksParams = {}) {
  const response = await api.get<GetLinksResponse>("/links/all", {
    params: { cursor, pageSize },
  });

  return response.data;
}
