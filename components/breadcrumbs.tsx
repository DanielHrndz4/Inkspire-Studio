import Link from "next/link"
import { ChevronRight } from 'lucide-react'

type Crumb = { label: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:underline underline-offset-4">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-foreground" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 opacity-60" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
