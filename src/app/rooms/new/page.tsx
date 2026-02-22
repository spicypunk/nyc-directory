import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AddRoomForm } from "@/components/AddRoomForm";

export default async function NewRoomPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="bg-[var(--color-card)] rounded-2xl shadow-sm border border-black/5 p-6 sm:p-8">
        <h1 className="text-xl font-bold mb-6">Add a Room</h1>
        <AddRoomForm />
      </div>
    </main>
  );
}
