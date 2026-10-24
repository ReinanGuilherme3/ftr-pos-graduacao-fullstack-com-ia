import { api } from "../lib/api";

interface CreateLinkParams {
  linkOriginal: string;
  linkEncurtado: string;
}

export async function createLink({ linkOriginal, linkEncurtado }: CreateLinkParams) {
  const response = await api.post<{ id: string }>("/links", {
    linkOriginal,
    linkEncurtado,
  });

  return response.data;
}
