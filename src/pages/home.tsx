import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { ExternalLink } from '@/components/external-link'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { VideoThumb } from '@/components/video'
import { articles, posterUrl, primaryHref, profile, projects, videoUrl, type Project } from '@/content/projects'
import { cn } from '@/lib/utils'

function SectionTitle({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-4 scroll-mt-20 text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  )
}

function ProductCard({ p, large }: { p: Project; large?: boolean }) {
  return (
    <article
      data-testid={`product-card-${p.slug}`}
      className={cn(
        'group relative flex flex-col gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-foreground/20',
        large && 'sm:col-span-2',
      )}
    >
      <VideoThumb src={videoUrl(p)} poster={posterUrl(p)} title={p.name} />
      <div className="flex flex-1 flex-col gap-1.5 px-1 pb-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium tracking-tight">
            {/* 伸展链接：整张卡片可点，视频按钮层级更高 */}
            <Link to={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {p.name}
            </Link>
          </h3>
          {p.status && <Badge variant="secondary" className="font-normal">{p.status}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{p.tagline}</p>
        <p className="mt-auto pt-1 text-xs text-muted-foreground/80">
          {[p.form, ...p.tags.slice(0, large ? 5 : 3)].filter(Boolean).join(' · ')}
        </p>
      </div>
    </article>
  )
}

function OssRow({ p }: { p: Project }) {
  const href = primaryHref(p)
  return (
    <li data-testid={`list-row-${p.slug}`}>
      <ExternalLink
        href={href}
        className="group grid grid-cols-[8.5rem_1fr_auto] items-baseline gap-x-4 gap-y-0.5 py-2.5 text-sm sm:grid-cols-[10rem_6rem_1fr_auto]"
      >
        <span className="font-medium group-hover:underline group-hover:underline-offset-4">{p.name}</span>
        <span className="hidden text-xs text-muted-foreground sm:block">{p.form}</span>
        <span className="text-muted-foreground max-sm:col-span-2 max-sm:col-start-1 max-sm:row-start-2">
          {p.tagline}
        </span>
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground group-hover:text-foreground max-sm:col-start-3 max-sm:row-start-1">
          {p.links[0]?.label}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </ExternalLink>
    </li>
  )
}

export function Home() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  const featured = projects.filter((p) => p.kind === 'product' && p.featured)
  const products = projects.filter((p) => p.kind === 'product' && !p.featured)
  const oss = projects.filter((p) => p.kind === 'oss' || p.kind === 'lab')
  const skills = projects.filter((p) => p.kind === 'skill')

  return (
    <div className="flex flex-col gap-14 pt-10 sm:pt-16">
      <section data-testid="home-hero" className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{profile.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{profile.role}</p>
        <p className="mt-4 text-lg text-muted-foreground">{profile.intro}</p>
      </section>

      <section data-testid="home-featured">
        <SectionTitle id="work">精选</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} p={p} large={i === 0} />
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section data-testid="home-products">
          <SectionTitle>产品</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </section>
      )}

      <section data-testid="home-oss">
        <SectionTitle>开源 & 实验</SectionTitle>
        <ul className="divide-y border-y">
          {oss.map((p) => (
            <OssRow key={p.slug} p={p} />
          ))}
        </ul>
      </section>

      <section data-testid="home-skills">
        <SectionTitle>Skills</SectionTitle>
        <ul className="divide-y border-y">
          {skills.map((p) => (
            <OssRow key={p.slug} p={p} />
          ))}
        </ul>
      </section>

      <section data-testid="home-writing">
        <div className="flex items-baseline justify-between">
          <SectionTitle id="writing">文章</SectionTitle>
          <ExternalLink href={profile.blog} className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground">
            博客 zilin.im <ArrowUpRight className="size-3.5" aria-hidden />
          </ExternalLink>
        </div>
        <ul className="divide-y border-y text-sm">
          {articles.map((a) => (
            <li key={a.title} className="flex items-baseline justify-between py-2.5">
              {a.href ? (
                <ExternalLink href={a.href} className="font-medium hover:underline hover:underline-offset-4">
                  {a.title}
                </ExternalLink>
              ) : (
                <span className="font-medium">{a.title}</span>
              )}
              <span className="text-xs text-muted-foreground">{a.date ?? '即将发布'}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
