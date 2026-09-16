import type { ReactElement } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Brand } from "@/components/layout/brand";

export const metadata = {
  title: "Sign In - TeamPulse",
  description: "Sign in to access the TeamPulse Announcements Portal.",
};

export default async function LoginPage(): Promise<ReactElement> {
  const session = await auth();
  if (session?.user) redirect("/announcements");

  return (
    <div className="announcement-workspace min-h-svh flex flex-col">
      <header className="workspace-header">
        <div className="workspace-navigation">
          <Brand />
          <span className="hidden rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-600 sm:inline-flex">
            Internal workspace
          </span>
        </div>
      </header>
      <main
        id="main-content"
        className="workspace-main flex items-center justify-center"
      >
        <div className="page-enter w-full max-w-[480px] rounded-[32px] bg-white p-7 sm:p-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            The team journal
          </p>
          <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-neutral-950 sm:text-4xl">
            Welcome back.
          </h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-neutral-500">
            Sign in to read and share updates with your team.
          </p>
          <LoginForm />
          <p className="mt-6 text-center text-xs leading-5 text-neutral-500">
            Use the account provided by your organization.
          </p>
          <details className="group mt-8 border-t border-neutral-200 pt-5 text-sm">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded text-neutral-600 transition-colors hover:text-neutral-950 [&::-webkit-details-marker]:hidden">
              <span>Trying the demo?</span>
              <span
                className="text-lg transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <dl className="page-enter space-y-3 pb-2 pt-3 text-xs">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-neutral-500">Email</dt>
                <dd className="select-all font-medium text-neutral-800">
                  demo@teampulse.internal
                </dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-neutral-500">Password</dt>
                <dd className="select-all font-medium text-neutral-800">
                  Password123!
                </dd>
              </div>
            </dl>
          </details>
        </div>
      </main>
      <footer className="px-6 py-7 text-center text-xs text-neutral-500">
        TeamPulse{" "}
        <span className="mx-2" aria-hidden="true">
          /
        </span>{" "}
        Internal announcements
      </footer>
    </div>
  );
}
