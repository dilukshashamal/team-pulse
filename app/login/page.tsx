import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign In — TeamPulse",
  description: "Sign in to access the TeamPulse Announcements Portal.",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/announcements");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm mb-4">
            TP
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            TeamPulse Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in with your organization account
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <LoginForm />
        </div>

        {/* Demo Credentials Box */}
        <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1.5">
            <svg
              className="w-4 h-4 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <span>Assessment Demo Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans">
                Email
              </span>
              <span className="text-slate-900 select-all font-semibold">
                demo@teampulse.internal
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans">
                Password
              </span>
              <span className="text-slate-900 select-all font-semibold">
                Password123!
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
