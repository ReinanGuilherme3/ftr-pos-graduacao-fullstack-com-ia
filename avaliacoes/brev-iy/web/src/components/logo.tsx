import type { ComponentProps } from "react";

export function LogoIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 8.5a7.5 7.5 0 1 0 0 15h2" />
      <path d="M18 23.5a7.5 7.5 0 1 0 0-15h-2" />
      <path d="M12 16h8" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-1.5 text-blue-base">
      <LogoIcon className="size-7" />
      <span className="text-xl font-bold">brev.ly</span>
    </span>
  );
}
