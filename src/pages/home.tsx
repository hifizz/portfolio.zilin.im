import { createElement, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, Bot, Box, FlaskConical, Package, Puzzle, Server, Sparkles, type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, useLocation } from 'react-router'
import { ExternalLink } from '@/components/external-link'
import { SectionTitle } from '@/components/section-title'
import { StatusBadge } from '@/components/status-badge'
import { VideoThumb } from '@/components/video'
import { articles, posterUrl, primaryHref, profile, projects, publicResume, videoUrl, type Project } from '@/content/projects'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const formIcons: Record<string, LucideIcon> = {
  浏览器插件: Puzzle,
  'CSS 库': Package,
  'JS 库': Package,
  'Skills 库': Package,
  服务端: Server,
  'Personal Agent': Bot,
  实验场: FlaskConical,
  Skill: Sparkles,
}

const formIcon = (form?: string) => (form && formIcons[form]) || Box

function ProductCard({ p }: { p: Project }) {
  return (
    <motion.article
      data-testid={`product-card-${p.slug}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
      }}
      className="group relative flex flex-col gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-foreground/25"
    >
      <div aria-hidden className="card-spotlight pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100" />
      <VideoThumb src={videoUrl(p)} poster={posterUrl(p)} title={p.name} />
      <div className="flex flex-1 flex-col gap-1.5 px-1 pb-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium tracking-tight">
            {/* 伸展链接：整张卡片可点，视频按钮层级更高 */}
            <Link to={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {p.name}
            </Link>
          </h3>
          <StatusBadge p={p} />
        </div>
        <p className="text-sm text-muted-foreground">{p.tagline}</p>
      </div>
    </motion.article>
  )
}

function OssRow({ p }: { p: Project }) {
  const href = primaryHref(p)
  return (
    <li data-testid={`list-row-${p.slug}`}>
      <ExternalLink
        href={href}
        className="group grid grid-cols-[10.5rem_1fr_auto] items-baseline gap-x-4 gap-y-0.5 py-2.5 text-sm sm:grid-cols-[12rem_6.5rem_1fr_auto]"
      >
        <span className="flex items-center gap-2 font-medium">
          {createElement(formIcon(p.form), { className: 'size-3.5 shrink-0 self-center text-muted-foreground', 'aria-hidden': true })}
          <span className="group-hover:underline group-hover:underline-offset-4">{p.name}</span>
        </span>
        <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">{p.form}</span>
        <span className="text-muted-foreground max-sm:col-span-2 max-sm:col-start-1 max-sm:row-start-2">
          {p.tagline}
        </span>
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground group-hover:text-foreground max-sm:col-start-3 max-sm:row-start-1">
          {p.links[0]?.label}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
        </span>
      </ExternalLink>
    </li>
  )
}

export function Home() {
  const { hash } = useLocation()
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  // 入场动画：用 gsap.from，JS 未执行时内容保持可见；减少动态偏好下不做动画
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const reveal = { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform' }
        gsap.from('[data-testid="home-hero"] > *', { ...reveal, stagger: 0.06 })
        gsap.utils.toArray<HTMLElement>('section:not([data-testid="home-hero"])').forEach((el) => {
          // 提前 200px 入场，避免首屏底部已经可见却还在等待滚动。
          gsap.from(el, { ...reveal, scrollTrigger: { trigger: el, start: 'top bottom+=200', once: true } })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const featured = projects.filter((p) => p.kind === 'product' && p.featured)
  const products = projects.filter((p) => p.kind === 'product' && !p.featured)
  const oss = projects.filter((p) => p.kind === 'oss' || p.kind === 'lab')
  const skills = projects.filter((p) => p.kind === 'skill')

  return (
    <div ref={root} className="flex flex-col gap-14 pt-10 sm:pt-16">
      <section data-testid="home-hero" className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{profile.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{profile.role}</p>
        <p className="mt-5 text-lg text-muted-foreground">{profile.intro}</p>
        <Link
          to="/resume"
          data-testid="resume-cta"
          className="mt-4 inline-flex min-h-8 max-w-full items-center justify-center gap-2 rounded-full border border-emerald-600 bg-emerald-700 px-5 py-1 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition-colors hover:bg-emerald-800 focus-visible:outline-emerald-700"
        >
          <span>{publicResume.cta}</span>
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </Link>
      </section>

      <section data-testid="home-featured">
        <SectionTitle id="work">精选</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section data-testid="home-products">
          <SectionTitle>产品</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
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

      {articles.length > 0 && (
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
      )}
    </div>
  )
}
