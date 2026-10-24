import { env } from "../env";

export function buildShortLink(slug: string) {
  return new URL(slug, `${env.VITE_FRONTEND_URL}/`).toString();
}

export function formatShortLink(linkEncurtado: string) {
  return linkEncurtado.replace(/^https?:\/\//, "");
}
