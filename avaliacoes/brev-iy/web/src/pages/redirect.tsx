import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LogoIcon } from "../components/logo";
import { getLink } from "../http/get-link";
import { incrementLinkAccess } from "../http/increment-link-access";
import { buildShortLink } from "../lib/short-link";

export function Redirect() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [linkOriginal, setLinkOriginal] = useState<string | null>(null);

  // Evita contar o acesso duas vezes no StrictMode, que executa o efeito duas vezes em dev
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!slug || hasRedirected.current) {
      return;
    }

    hasRedirected.current = true;

    async function redirect(slug: string) {
      try {
        const link = await getLink(buildShortLink(slug));

        setLinkOriginal(link.linkOriginal);

        await incrementLinkAccess(link.id).catch(() => {});

        window.location.replace(link.linkOriginal);
      } catch {
        navigate("/url/not-found", { replace: true });
      }
    }

    redirect(slug);
  }, [slug, navigate]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-3">
      <div className="flex w-full max-w-145 flex-col items-center gap-6 rounded-lg bg-gray-100 px-5 py-12 text-center md:px-12 md:py-16">
        <LogoIcon className="size-12 text-blue-base" />

        <h1 className="text-xl font-bold text-gray-600">Redirecionando...</h1>

        <div className="flex flex-col gap-1 text-md font-semibold text-gray-500">
          <p>O link será aberto automaticamente em alguns instantes.</p>
          <p>
            Não foi redirecionado?{" "}
            {linkOriginal ? (
              <a href={linkOriginal} className="text-blue-base underline">
                Acesse aqui
              </a>
            ) : (
              <span className="text-blue-base underline opacity-50">
                Acesse aqui
              </span>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
