import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OnboardingForm } from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/invite");
  }

  if (session.user.hasOnboarded) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold">
          Welcome to DirectoryNYC
        </h1>
        <p className="text-lg text-gray-600">
          What name would you like to go by?
        </p>
        <OnboardingForm defaultName={session.user.name} />
      </div>
    </main>
  );
}
