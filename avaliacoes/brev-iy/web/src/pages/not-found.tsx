import { Link } from "react-router";

export function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3">
      <div className="flex w-full max-w-145 flex-col items-center gap-6 rounded-lg bg-gray-100 px-5 py-12 text-center md:px-12 md:py-16">
        <span className="text-7xl font-black tracking-tight text-blue-base md:text-8xl">
          404
        </span>

        <h1 className="text-xl font-bold text-gray-600">Link não encontrado</h1>

        <p className="text-md font-semibold text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{" "}
          <Link to="/" className="text-blue-base underline">
            brev.ly
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
