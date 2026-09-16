import LoginForm from "@/features/auth/components/LoginForm"

export const metadata = { title: "Sign In | AMMS" }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">AMMS</h1>
          <p className="mt-2 text-sm text-gray-600">
            Alarm &amp; Maintenance Management System — Sign in to continue
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
