"use client"

import ProductSkeleton from "@/components/product-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductPageSkeleton() {
  return (
    <>
      <div className="grid gap-4">
        <Skeleton className="aspect-[4/5] w-full rounded-md" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      </div>
      <div className="lg:pl-6 grid gap-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="lg:col-span-2 mt-6 border-t pt-8">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductSkeleton count={4} />
        </div>
      </div>
    </>
  )
}
