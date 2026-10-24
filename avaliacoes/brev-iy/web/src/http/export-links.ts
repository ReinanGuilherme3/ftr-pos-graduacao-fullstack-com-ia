import { api } from "../lib/api";

export async function exportLinks() {
  const response = await api.post<{ reportUrl: string }>("/links/exports");

  return response.data;
}
