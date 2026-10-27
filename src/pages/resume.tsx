import { useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { Tooltip } from 'radix-ui'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { StatusBadge } from '@/components/status-badge'
import { posterUrl, profile, projects, publicResume } from '@/content/projects'

const products = projects.filter((project) => project.kind === 'product')
const tarsIndex = products.findIndex((project) => project.slug === 'tars')
if (tarsIndex >= 0) products.splice(2, 0, ...products.splice(tarsIndex, 1))

export function ResumePage() {
  const [activityUnavailable, setActivityUnavailable] = useState(false)

  return (
    <article data-testid="public-resume" className="mx-auto max-w-2xl py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden /> 返回作品集
      </Link>

      <header className="mt-8">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{publicResume.title}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{profile.name}</h1>
        <p className="mt-2 text-muted-foreground">{profile.role}</p>
        <p className="mt-5 text-lg leading-relaxed">{publicResume.summary}</p>
      </header>

      <section data-testid="resume-subscriptions" className="mt-10" aria-labelledby="resume-subscriptions">
        <h2 id="resume-subscriptions" className="text-xl font-semibold tracking-tight">我的 AI 订阅</h2>
        <Tooltip.Provider delayDuration={150}>
          <ul className="mt-4 flex items-center gap-2 sm:gap-3">
            {publicResume.subscriptions.map((subscription) => (
              <li key={subscription.name} className="shrink-0">
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <ExternalLink href={subscription.href} aria-label={subscription.name} className="block">
                      <img
                        src={subscription.icon}
                        alt={subscription.name}
                        width={28}
                        height={28}
                        className={`size-7 sm:size-8${subscription.muted ? ' grayscale opacity-45' : ''}`}
                      />
                    </ExternalLink>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content data-testid="subscription-tooltip" sideOffset={8} className="z-50 rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md">
                      {subscription.name}
                      <Tooltip.Arrow className="fill-foreground" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </li>
            ))}
          </ul>
        </Tooltip.Provider>
      </section>

      <section data-testid="resume-github" className="mt-10" aria-labelledby="resume-github">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="resume-github" className="text-xl font-semibold tracking-tight">GitHub 活跃记录</h2>
          <ExternalLink href={publicResume.githubActivity.href} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            查看 GitHub <ArrowUpRight className="size-3.5" aria-hidden />
          </ExternalLink>
        </div>
        {activityUnavailable ? (
          <p role="status" className="mt-4 rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
            贡献图暂时无法加载，可通过上方链接查看 GitHub 活跃记录。
          </p>
        ) : (
          <div role="region" aria-label="最近一年 GitHub 贡献图，可左右滚动" tabIndex={0} className="mt-4 overflow-x-auto rounded-lg border bg-white p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
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
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{publicResume.githubActivity.note}</p>
      </section>

      <section data-testid="resume-projects" className="mt-10" aria-labelledby="resume-projects">
        <h2 id="resume-projects" className="text-xl font-semibold tracking-tight">我的个人作品</h2>
        <ul className="mt-4 grid gap-3">
          {products.map((project) => (
            <li key={project.slug}>
              <Link to={`/projects/${project.slug}`} className="group flex h-full items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-foreground/25">
                {posterUrl(project) && (
                  <img src={posterUrl(project)} alt="" width={80} height={60} loading="lazy" className="mt-0.5 aspect-4/3 w-20 shrink-0 rounded object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-start justify-between gap-1 text-sm font-medium">
                    {project.name}
                    <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{project.tagline}</p>
                  <div className="mt-2"><StatusBadge p={project} /></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section data-testid="resume-design" className="mt-10" aria-labelledby="resume-design">
        <h2 id="resume-design" className="text-xl font-semibold tracking-tight">我的审美</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {publicResume.designWork.map((work) => (
            <li key={work.href}>
              <ExternalLink href={work.href} className="group flex h-full items-center justify-between gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-foreground/25">
                <div>
                  <h3 className="text-sm font-medium group-hover:underline group-hover:underline-offset-4">{work.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{work.description}</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </ExternalLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="resume-experience">
        <h2 id="resume-experience" className="text-xl font-semibold tracking-tight">工作经历概览</h2>
        <div className="mt-4 divide-y border-y">
          {publicResume.experience.map((experience) => (
            <section key={experience.company} className="py-5">
              <h3 className="font-medium">{experience.company}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{experience.summary}</p>
            </section>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="h-11 px-4">
          <a href={`mailto:${profile.email}`}>
            <Mail aria-hidden /> 联系我，获取完整简历
          </a>
        </Button>
        <Button asChild variant="outline" className="h-11 px-4">
          <Link to="/#work">查看个人作品 <ArrowRight aria-hidden /></Link>
        </Button>
      </div>
    </article>
  )
}
