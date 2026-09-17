export default function ErrorState({
  title = "Something went wrong",
  message,
}: {
  title?: string
  message?: string
}) {
  return (
    <div role="alert" className="rounded-lg border border-red-800 bg-red-900/20 p-8 text-center">
      <p className="text-sm font-semibold text-red-400">{title}</p>
      {message ? <p className="mt-1 break-words text-xs text-red-400/70">{message}</p> : null}
    </div>
  )
}
