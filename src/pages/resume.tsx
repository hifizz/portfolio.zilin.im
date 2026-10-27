import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { profile, publicResume } from '@/content/projects'

export function ResumePage() {
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
        <p className="mt-5 rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
          {publicResume.notice}
        </p>
      </header>

      <section>
        我的 AI 订阅：Codex、Claude Code(展示 logo 时置灰)、Devin、CommandCode GOAT、Ark、GLM、Kimi
        {/*把https://icons.lobehub.com/  （https://icons.lobehub.com/llms.txt）中的对应的 logo svg 复制到这里，展示效果*/}
      </section>

      <section>
        最近一年的 Github 活跃信息：
        {/*能否帮我把我 GitHub 的活跃信息展示在这里？*/}
      </section>

      <section>
        我的个人作品：
        {/* 把主页的产品都用小一些的卡片来展示 */}
      </section>

      <section>
        我的审美：
        - 一个动效设计：https://effect-preview.vercel.app/
        - 独立产品的网站首页：https://chatkeep.dev/?ref=portfolio.zilin.im
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
