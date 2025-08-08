"use client"

export default function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid gap-3 animate-pulse">
          <div className="aspect-[4/5] w-full rounded-md bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      ))}
    </>
  )
}
