import { signIn } from "@/lib/auth";
import { getReferrerByCode } from "@/lib/referral";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ referralCode?: string }>;
}) {
  const { referralCode } = await searchParams;
  const referrer = referralCode
    ? await getReferrerByCode(referralCode)
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold">
          DirectoryNYC
        </h1>
        <p className="text-lg text-gray-600">
          {referrer
            ? `${referrer.name} invited you to join DirectoryNYC!`
            : "DirectoryNYC is an invite-only community. Ask a member for an invite link."}
        </p>
        {referrer && (
          <form
            action={async () => {
              "use server";
              await signIn("twitter");
            }}
          >
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white rounded-lg font-medium transition-colors"
            >
              Sign in with X
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
