import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { Tooltip } from 'radix-ui'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { SectionTitle } from '@/components/section-title'
import { StatusBadge } from '@/components/status-badge'
import { posterUrl, profile, projects, publicResume } from '@/content/projects'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const products = projects.filter((project) => project.kind === 'product')
const tarsIndex = products.findIndex((project) => project.slug === 'tars')
if (tarsIndex >= 0) products.splice(2, 0, ...products.splice(tarsIndex, 1))

export function ResumePage() {
  const [activityUnavailable, setActivityUnavailable] = useState(false)
  const root = useRef<HTMLElement>(null)

  // 入场动效与首页保持一致：JS 未执行时内容可见；减少动态偏好下不做动画
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const reveal = { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform' }
        const entrance = gsap.timeline().from('[data-reveal="hero"]', { ...reveal, stagger: 0.06 })
        const initial: HTMLElement[] = []
        // 作品标题和每张卡片独立入场，不再对整段列表做一次动画。
        const targets = gsap.utils.toArray<HTMLElement>(
          '[data-reveal="block"], [data-reveal="projects"] > h2, [data-reveal="projects"] > ul > li',
        )
        targets.forEach((el) => {
          const { top, bottom } = el.getBoundingClientRect()
          if (bottom <= 0) return
          if (top <= window.innerHeight + 200) initial.push(el)
          else gsap.from(el, { ...reveal, scrollTrigger: { trigger: el, start: 'top bottom+=200', once: true } })
        })
        // 首屏及 200px 缓冲内的内容错峰播放，不等待用户滚动。
        entrance.from(initial, { ...reveal, stagger: 0.12 }, 0.3)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <article ref={root} data-testid="public-resume" className="mx-auto max-w-2xl py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden /> 返回作品集
      </Link>

      <header className="mt-8 border-b-[0.5px] border-border/60 pb-10">
        <p data-reveal="hero" className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{publicResume.title}</p>
        <h1 data-reveal="hero" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{profile.name}</h1>
        <p data-reveal="hero" className="mt-2 text-muted-foreground">{profile.role}</p>
        <p data-reveal="hero" className="mt-5 text-lg leading-relaxed">{publicResume.summary}</p>
        <div data-reveal="hero" className="mt-6">
          <Button asChild data-testid="resume-contact" className="h-10 gap-2 rounded-[24px] [corner-shape:squircle] px-4 shadow-[0_6px_18px_-6px] shadow-foreground/40 ring-1 ring-foreground/10 hover:bg-primary hover:shadow-[0_8px_22px_-6px] hover:shadow-foreground/50 motion-safe:hover:-translate-y-px">
            <a href={`mailto:${profile.email}`}>
              <Mail aria-hidden /> 联系我
              <span className="font-mono text-xs font-normal text-primary-foreground/60">{profile.email}</span>
            </a>
          </Button>
        </div>
      </header>

      <section data-reveal="block" className="mt-12" aria-labelledby="resume-experience">
        <SectionTitle id="resume-experience">工作经历概览</SectionTitle>
        <ol className="mt-4 divide-y-[0.5px] divide-[color-mix(in_oklab,var(--border)_60%,transparent)] border-y-[0.5px] border-border/60">
          {publicResume.experience.map((experience) => (
            <li key={experience.company} className="py-5">
              <h3 className="font-medium">{experience.company}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{experience.summary}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-testid="resume-projects" data-reveal="projects" className="mt-14" aria-labelledby="resume-projects">
        <SectionTitle id="resume-projects">我的个人作品</SectionTitle>
        <ul className="mt-4 grid grid-cols-1 gap-3">
          {products.map((project) => (
            <li key={project.slug}>
              <Link
                to={`/projects/${project.slug}`}
                className="group flex h-full items-start gap-4 rounded-[24px] [corner-shape:squircle] border bg-card p-3 transition-[border-color,transform] hover:border-foreground/25 motion-safe:hover:-translate-y-0.5"
              >
                {posterUrl(project) && (
                  <img src={posterUrl(project)} alt="" width={96} height={72} loading="lazy" className="mt-0.5 aspect-4/3 w-24 shrink-0 rounded-[14px] [corner-shape:squircle] object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-start justify-between gap-2 font-medium tracking-tight">
                    {project.name}
                    <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
                  <div className="mt-2.5"><StatusBadge p={project} /></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section data-testid="resume-design" data-reveal="block" className="mt-12" aria-labelledby="resume-design">
        <SectionTitle id="resume-design">我的审美</SectionTitle>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {publicResume.designWork.map((work) => (
            <li key={work.href}>
              <ExternalLink href={work.href} className="group flex h-full items-center justify-between gap-3 rounded-[24px] [corner-shape:squircle] border bg-card p-4 transition-[border-color,transform] hover:border-foreground/25 motion-safe:hover:-translate-y-0.5">
                <div>
                  <h3 className="font-medium group-hover:underline group-hover:underline-offset-4">{work.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{work.description}</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden />
              </ExternalLink>
            </li>
          ))}
        </ul>
      </section>


      <section data-testid="resume-subscriptions" data-reveal="block" className="mt-12" aria-labelledby="resume-subscriptions">
        <SectionTitle id="resume-subscriptions">我的 AI 订阅</SectionTitle>
        <Tooltip.Provider delayDuration={150}>
          <ul className="mt-4 flex flex-wrap gap-2">
            {publicResume.subscriptions.map((subscription) => {
              const link = (
                <ExternalLink
                  href={subscription.href}
                  className={`inline-flex items-center gap-2 rounded-[24px] [corner-shape:squircle] border bg-card py-1.5 pr-3 pl-2 text-sm transition-[box-shadow,border-color,color] hover:border-foreground/25 hover:text-foreground ${subscription.muted ? 'shadow-none' : 'shadow-[0_2px_8px_-3px] shadow-foreground/15 hover:shadow-[0_4px_12px_-4px] hover:shadow-foreground/20'}`}
                >
                  <img
                    src={subscription.icon}
                    alt=""
                    width={16}
                    height={16}
                    className={`size-4${subscription.muted ? ' grayscale opacity-50' : ''}`}
                  />
                  <span className={subscription.muted ? 'text-muted-foreground' : undefined}>{subscription.name}</span>
                </ExternalLink>
              )
              return (
                <li key={subscription.name}>
                  {subscription.muted ? (
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content data-testid="inactive-subscription-tooltip" sideOffset={8} className="z-50 rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md">
                          {publicResume.inactiveSubscriptionHint}
                          <Tooltip.Arrow className="fill-foreground" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  ) : link}
                </li>
              )
            })}
          </ul>
        </Tooltip.Provider>
      </section>

      <section data-testid="resume-github" data-reveal="block" className="mt-12" aria-labelledby="resume-github">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <SectionTitle id="resume-github" className="mb-0">GitHub 活跃记录</SectionTitle>
          <ExternalLink href={publicResume.githubActivity.href} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            查看 GitHub <ArrowUpRight className="size-3.5" aria-hidden />
          </ExternalLink>
        </div>
        {activityUnavailable ? (
          <p role="status" className="mt-4 rounded-[24px] [corner-shape:squircle] border bg-muted/50 p-4 text-sm text-muted-foreground">
            贡献图暂时无法加载，可通过上方链接查看 GitHub 活跃记录。
          </p>
        ) : (
          <div role="region" aria-label="最近一年 GitHub 贡献图，可左右滚动" tabIndex={0} className="mt-4 overflow-x-auto rounded-[24px] [corner-shape:squircle] border bg-card p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <img
              data-testid="github-contributions"
              src={publicResume.githubActivity.image}
              alt="hifizz 最近一年的 GitHub 贡献活动图"
              width={663}
              height={104}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setActivityUnavailable(true)}
              className="block min-w-[600px] w-full"
            />
          </div>
        )}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {publicResume.githubActivity.note}
          <span className="sm:hidden">，可左右滑动查看</span>
        </p>
      </section>



    </article>
  )
}
