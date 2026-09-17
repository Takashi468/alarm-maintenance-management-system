export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-dashed border-border-color bg-bg-secondary p-10 text-center">
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      {description ? <p className="mt-1 text-xs text-text-secondary/70">{description}</p> : null}
      {action ? <div className="mt-3 flex justify-center">{action}</div> : null}
    </div>
  )
}
