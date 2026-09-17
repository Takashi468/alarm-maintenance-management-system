import LoginForm from "@/features/auth/components/LoginForm"

export const metadata = { title: "Sign In | AMMS" }

function FactoryLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-accent-blue">
      <path d="M2 20V10l6 4V10l6 4V6l6 4v10z" />
      <path d="M2 20h20" />
    </svg>
  )
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <FactoryLogo />
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">AMMS</h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Alarm &amp; Maintenance Management System — Sign in to continue
          </p>
        </div>
        <div className="rounded-lg border border-border-color bg-bg-secondary p-6 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
