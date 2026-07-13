import { Suspense } from "react";
import AuthShell from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Sign In — MInT",
  description: "Sign in to the Ministry of Innovation and Technology (MInT) Event Management System.",
};

export default function LoginPage() {
  return (
    <AuthShell
      badge="Welcome Back"
          title={
        <>
          Ethiopian ministry
          <br />
          <span className="text-brand">events, unified.</span>
        </>
      }
      subtitle="Sign in to Ethiopia's Ministry of Innovation and Technology event platform — research, innovation, ICT, and technology programs."
    >
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 rounded-lg border-4 border-brand/10 border-t-brand animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loading Form...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
