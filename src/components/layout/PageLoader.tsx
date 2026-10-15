import { LoaderCircle } from 'lucide-react'

export function PageLoader() {
  return (
    <div className="flex justify-center py-24 text-slate-400" role="status">
      <LoaderCircle className="size-6 animate-spin" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
