import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-4 py-6 justify-between relative h-dvh">
      <Chat />
    </div>
  );
}
