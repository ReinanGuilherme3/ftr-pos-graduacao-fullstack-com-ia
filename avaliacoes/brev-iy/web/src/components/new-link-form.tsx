import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createLink } from "../http/create-link";
import { queryClient } from "../lib/query-client";
import { buildShortLink } from "../lib/short-link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const newLinkFormSchema = z.object({
  linkOriginal: z
    .string()
    .trim()
    .transform((value) =>
      /^https?:\/\//i.test(value) ? value : `https://${value}`
    )
    .pipe(
      z.url({
        protocol: /^https?$/,
        hostname: z.regexes.domain,
        message: "Informe uma url válida.",
      })
    ),
  slug: z
    .string()
    .trim()
    .min(1, { message: "Informe o link encurtado." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Informe uma url minúscula e sem espaço/caracter especial.",
    }),
});

type NewLinkFormInput = z.input<typeof newLinkFormSchema>;
type NewLinkFormOutput = z.output<typeof newLinkFormSchema>;

export function NewLinkForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<NewLinkFormInput, unknown, NewLinkFormOutput>({
    resolver: zodResolver(newLinkFormSchema),
    defaultValues: { linkOriginal: "", slug: "" },
  });

  const { mutateAsync: createLinkFn, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  async function handleCreateLink({ linkOriginal, slug }: NewLinkFormOutput) {
    try {
      await createLinkFn({ linkOriginal, linkEncurtado: buildShortLink(slug) });

      reset();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setError("slug", { message: "Essa URL encurtada já existe." });
        return;
      }

      toast.error("Erro no cadastro", {
        description: "Não foi possível criar o link. Tente novamente.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateLink)}
      noValidate
      className="flex w-full flex-col gap-5 rounded-lg bg-gray-100 p-6 md:gap-6 md:p-8 lg:max-w-95"
    >
      <h2 className="text-lg font-bold text-gray-600">Novo link</h2>

      <div className="flex flex-col gap-4">
        <Input
          label="Link original"
          placeholder="www.exemplo.com.br"
          autoComplete="off"
          error={errors.linkOriginal?.message}
          {...register("linkOriginal")}
        />

        <Input
          label="Link encurtado"
          prefix="brev.ly/"
          autoComplete="off"
          error={errors.slug?.message}
          {...register("slug")}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <SpinnerIcon className="size-4 animate-spin" />}
        {isPending ? "Salvando..." : "Salvar link"}
      </Button>
    </form>
  );
}
