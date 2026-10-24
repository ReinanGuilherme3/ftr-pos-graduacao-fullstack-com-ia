import { Logo } from "../components/logo";
import { MyLinks } from "../components/my-links";
import { NewLinkForm } from "../components/new-link-form";

export function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-245 flex-col gap-6 px-3 py-8 md:gap-8 md:px-6 md:py-22">
      <header className="flex justify-center lg:justify-start">
        <Logo />
      </header>

      <div className="flex flex-col items-start gap-3 lg:flex-row lg:gap-5">
        <NewLinkForm />
        <MyLinks />
      </div>
    </main>
  );
}
