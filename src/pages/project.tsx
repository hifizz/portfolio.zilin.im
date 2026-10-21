import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, Navigate, useParams } from 'react-router'
import { ExternalLink } from '@/components/external-link'
import { GithubIcon } from '@/components/github-icon'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/video'
import { posterUrl, projects, videoUrl } from '@/content/projects'

const products = projects.filter((p) => p.kind === 'product')

function Block({ id, title, items }: { id: string; title: string; items: string[] }) {
  return (
    <section data-testid={id}>
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
  const [cta, ...rest] = p.links
  const labels = [p.form, ...p.tags].filter((t): t is string => !!t)

  return (
    <motion.article
      data-testid="project-page"
      className="pt-6"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link to="/#work" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden /> 返回作品
      </Link>

      <header data-testid="project-header" className="mt-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
            <StatusBadge p={p} />
          </div>
          <p className="mt-2 text-muted-foreground">{p.tagline}</p>
          {labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {labels.map((t) => (
                <Badge key={t} variant="outline" className="font-normal">{t}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Button
            asChild
            data-testid="project-cta"
            className="h-10 gap-2 rounded-[24px] [corner-shape:squircle] px-4 shadow-[0_6px_18px_-6px] shadow-foreground/40 ring-1 ring-foreground/10 hover:bg-primary hover:shadow-[0_8px_22px_-6px] hover:shadow-foreground/50 motion-safe:hover:-translate-y-px"
          >
            <ExternalLink href={cta.href}>
              {p.statusTone === 'live' && (
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-status-live motion-safe:animate-ping" />
                  <span className="relative size-2 rounded-full bg-status-live" />
                </span>
              )}
              {cta.href.includes('github.com') && <GithubIcon className="size-4" />}
              <span>{cta.label === '官网' || cta.label === '线上' ? `访问${cta.label}` : cta.label}</span>
              <span className="font-mono text-xs font-normal text-primary-foreground/60">{new URL(cta.href).host}</span>
              <ArrowUpRight className="size-4" aria-hidden />
            </ExternalLink>
          </Button>
          {rest.map((l) => (
            <Button key={l.href} variant="outline" className="h-10 rounded-[24px] [corner-shape:squircle] px-3.5" asChild>
              <ExternalLink href={l.href}>
                {l.href.includes('github.com') && <GithubIcon />}
                {l.label} <ArrowUpRight aria-hidden />
              </ExternalLink>
            </Button>
          ))}
        </div>
      </header>

      <VideoPlayer src={videoUrl(p)} poster={posterUrl(p)} title={p.name} className="mt-8" data-testid="project-video" />

      <div className="mt-10 flex max-w-2xl flex-col gap-8">
        <section data-testid="project-problem">
          <h2 className="mb-3 text-sm font-medium">解决什么问题</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{d.problem}</p>
        </section>
        {d.audience && (
          <section data-testid="project-audience">
            <h2 className="mb-3 text-sm font-medium">适合谁</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{d.audience}</p>
          </section>
        )}
        <Block id="project-features" title="核心功能" items={d.features} />
      </div>

      {next !== p && (
        <Link
          data-testid="project-next"
          to={`/projects/${next.slug}`}
          className="mt-16 flex items-center justify-between border-t pt-6 text-sm text-muted-foreground hover:text-foreground"
        >
          <span>下一个项目</span>
          <span className="flex items-center gap-1 font-medium">
            {next.name} <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </Link>
      )}
    </motion.article>
  )
}
