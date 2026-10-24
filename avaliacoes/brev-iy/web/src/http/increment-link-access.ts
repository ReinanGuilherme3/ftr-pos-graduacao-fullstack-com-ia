import { api } from "../lib/api";

export async function incrementLinkAccess(id: string) {
  const response = await api.patch<{ quantidadeAcessos: number }>(
    `/links/${id}/access`
  );

  return response.data;
}
