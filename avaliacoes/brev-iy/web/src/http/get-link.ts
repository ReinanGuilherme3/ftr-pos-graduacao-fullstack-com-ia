import { api } from "../lib/api";

export async function getLink(linkEncurtado: string) {
  const response = await api.get<{ id: string; linkOriginal: string }>(
    "/links",
    { params: { linkEncurtado } }
  );

  return response.data;
}
