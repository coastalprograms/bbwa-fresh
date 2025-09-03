import Link from 'next/link'
import type { Route } from 'next'
import type { UrlObject } from 'url'

export type Crumb = { href?: Route | UrlObject; label: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-gray-600">
        {items.map((it, i) => (
          <li key={`${it.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href ? (
              <Link
                href={it.href}
                className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-gray-900">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
