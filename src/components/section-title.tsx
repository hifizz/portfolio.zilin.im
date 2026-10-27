import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** 首页与简历共用的章节标题：等宽大写，字号与字色足以在长页面中快速定位章节。 */
export function SectionTitle({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={cn('mb-4 scroll-mt-20 font-mono text-lg font-medium uppercase tracking-wider text-foreground/75', className)}>
      {children}
    </h2>
  )
}
