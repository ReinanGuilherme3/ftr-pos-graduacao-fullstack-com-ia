import {
  DownloadSimpleIcon,
  LinkIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { exportLinks } from "../http/export-links";
import { getLinks } from "../http/get-links";
import { LinkItem } from "./link-item";
import { Button } from "./ui/button";

export function MyLinks() {
  const listRef = useRef<HTMLUListElement>(null);
  const loadMoreRef = useRef<HTMLLIElement>(null);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["links"],
    queryFn: ({ pageParam }) => getLinks({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const links = data?.pages.flatMap((page) => page.links);

  // Carrega a próxima página quando o fim da lista aparece na área de rolagem
  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: listRef.current, rootMargin: "120px" }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { mutate: exportLinksFn, isPending: isExporting } = useMutation({
    mutationFn: exportLinks,
    onSuccess: ({ reportUrl }) => {
      window.open(reportUrl, "_blank");
    },
    onError: () => {
      toast.error("Erro ao baixar CSV", {
        description: "Não foi possível gerar o relatório. Tente novamente.",
      });
    },
  });

  const hasLinks = Boolean(links?.length);

  return (
    <section className="relative flex w-full flex-col gap-4 overflow-hidden rounded-lg bg-gray-100 p-6 md:gap-5 md:p-8 lg:max-w-145">
      {isFetching && !isFetchingNextPage && (
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
          <div className="h-full w-1/4 animate-loading bg-blue-base" />
        </div>
      )}

      <header className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-600">Meus links</h2>

        <Button
          variant="secondary"
          onClick={() => exportLinksFn()}
          disabled={!hasLinks || isExporting}
        >
          {isExporting ? (
            <SpinnerIcon className="size-4 animate-spin" />
          ) : (
            <DownloadSimpleIcon className="size-4" />
          )}
          Baixar CSV
        </Button>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 pt-6 pb-4 text-gray-400">
          <SpinnerIcon className="size-8 animate-spin" />
          <span className="text-xs uppercase text-gray-500">
            Carregando links...
          </span>
        </div>
      )}

      {isError && !links && (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 pt-6 pb-4">
          <span className="text-xs uppercase text-danger">
            Não foi possível carregar os links
          </span>
        </div>
      )}

      {links && !hasLinks && (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 pt-6 pb-4 text-gray-400">
          <LinkIcon className="size-8" />
          <span className="text-xs uppercase text-gray-500">
            Ainda não existem links cadastrados
          </span>
        </div>
      )}

      {hasLinks && (
        <ul
          ref={listRef}
          className="flex max-h-[60vh] flex-col overflow-y-auto pr-2 lg:max-h-100"
        >
          {links?.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}

          {hasNextPage && (
            <li
              ref={loadMoreRef}
              className="flex justify-center border-t border-gray-200 py-3 text-gray-400"
            >
              <SpinnerIcon className="size-5 animate-spin" />
              <span className="sr-only">Carregando mais links</span>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
