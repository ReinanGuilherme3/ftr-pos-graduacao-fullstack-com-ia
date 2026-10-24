import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router";
import { toast } from "sonner";
import { deleteLink } from "../http/delete-link";
import type { Link } from "../http/get-links";
import { queryClient } from "../lib/query-client";
import { formatShortLink } from "../lib/short-link";
import { Button } from "./ui/button";

interface LinkItemProps {
  link: Link;
}

export function LinkItem({ link }: LinkItemProps) {
  const shortLink = formatShortLink(link.linkEncurtado);
  const slug = new URL(link.linkEncurtado).pathname;

  const { mutate: deleteLinkFn, isPending: isDeleting } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
    onError: () => {
      toast.error("Erro ao apagar", {
        description: `Não foi possível apagar o link ${shortLink}.`,
      });
    },
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link.linkEncurtado);

      toast.info("Link copiado com sucesso", {
        description: `O link ${shortLink} foi copiado para a área de transferência.`,
      });
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  function handleDelete() {
    if (window.confirm(`Você realmente quer apagar o link ${shortLink}?`)) {
      deleteLinkFn(link.id);
    }
  }

  return (
    <li
      data-deleting={isDeleting}
      className="flex items-center gap-4 border-t border-gray-200 py-3 transition-opacity data-[deleting=true]:opacity-50 md:gap-5 md:py-4"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <RouterLink
          to={slug}
          target="_blank"
          className="truncate text-md font-semibold text-blue-base hover:underline"
        >
          {shortLink}
        </RouterLink>
        <span className="truncate text-sm text-gray-500">
          {link.linkOriginal}
        </span>
      </div>

      <span className="shrink-0 text-sm text-gray-500">
        {link.quantidadeAcessos}{" "}
        {link.quantidadeAcessos === 1 ? "acesso" : "acessos"}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <Button variant="icon" onClick={handleCopy} title="Copiar link">
          <CopyIcon className="size-4" />
          <span className="sr-only">Copiar link</span>
        </Button>

        <Button
          variant="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Apagar link"
        >
          <TrashIcon className="size-4" />
          <span className="sr-only">Apagar link</span>
        </Button>
      </div>
    </li>
  );
}
