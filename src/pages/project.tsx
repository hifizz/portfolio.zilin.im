import { Link, Navigate, useParams } from 'react-router'
import { ExternalLink } from '@/components/external-link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/video'
import { posterUrl, projects, videoUrl } from '@/content/projects'

const products = projects.filter((p) => p.kind === 'product')

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium">{title}</h2>
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-border">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  )
}

export function ProjectPage() {
  const { slug } = useParams()
  const idx = products.findIndex((p) => p.slug === slug)
  const p = products[idx]
  if (!p?.detail) return <Navigate to="/" replace />
  const next = products[(idx + 1) % products.length]
  const d = p.detail

  return (
    <article className="pt-6">
      <Link to="/#work" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden /> 返回作品
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
            {p.status && <Badge variant="secondary" className="font-normal">{p.status}</Badge>}
          </div>
          <p className="mt-2 text-muted-foreground">{p.tagline}</p>
        </div>
        <div className="flex gap-2">
          {p.links.map((l) => (
            <Button key={l.href} variant="outline" size="sm" asChild>
              <ExternalLink href={l.href}>
                {l.label} <ArrowUpRight aria-hidden />
              </ExternalLink>
            </Button>
          ))}
        </div>
      </header>

      <VideoPlayer src={videoUrl(p)} poster={posterUrl(p)} title={p.name} className="mt-8" />

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_15rem]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 text-sm font-medium">解决什么问题</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{d.problem}</p>
          </section>
          <Block title="核心功能" items={d.features} />
          <Block title="关键技术" items={d.highlights} />
        </div>
        <aside className="flex h-fit flex-col gap-5 text-sm md:sticky md:top-6">
          <div>
            <div className="mb-1 text-xs text-muted-foreground">角色</div>
            {d.role}
          </div>
          {p.form && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">形态</div>
              {p.form}
            </div>
          )}
          <div>
            <div className="mb-2 text-xs text-muted-foreground">技术栈</div>
            <div className="flex flex-wrap gap-1.5">
              {d.stack.map((s) => (
                <Badge key={s} variant="outline" className="font-normal">{s}</Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {next !== p && (
        <Link
          to={`/projects/${next.slug}`}
          className="mt-16 flex items-center justify-between border-t pt-6 text-sm text-muted-foreground hover:text-foreground"
        >
          <span>下一个项目</span>
          <span className="flex items-center gap-1 font-medium">
            {next.name} <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </Link>
      )}
    </article>
  )
}
