import { Badge } from '@/components/ui/badge'
import type { Project } from '@/content/projects'
import { cn } from '@/lib/utils'

/** 状态徽标；有 statusTone 时前置一个小圆点（live 绿 / beta 琥珀）。 */
export function StatusBadge({ p }: { p: Pick<Project, 'status' | 'statusTone'> }) {
  if (!p.status) return null
  return (
    <Badge variant="secondary" className="gap-1.5 font-normal">
      {p.statusTone && (
        <span
          aria-hidden
          className={cn('size-1.5 rounded-full', p.statusTone === 'live' ? 'bg-status-live' : 'bg-status-beta')}
        />
      )}
      {p.status}
    </Badge>
  )
}
