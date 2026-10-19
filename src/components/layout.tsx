import { MotionConfig } from 'motion/react'
import { Link, Outlet, ScrollRestoration } from 'react-router'
import { ExternalLink } from '@/components/external-link'
import { GithubIcon } from '@/components/github-icon'
import { profile } from '@/content/projects'

const navLink = 'transition-colors hover:text-foreground'

export function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
      <div className="mx-auto flex min-h-svh max-w-5xl flex-col px-5 sm:px-8">
        <header data-testid="site-header" className="flex h-14 items-center justify-center text-sm">
          <nav className="flex items-center gap-6 text-muted-foreground">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={navLink}>首页</Link>
            <Link to="/#work" className={navLink}>作品</Link>
            <Link to="/#writing" className={navLink}>文章</Link>
            <ExternalLink href={profile.blog} className={navLink}>博客</ExternalLink>
            <ExternalLink href={profile.github} className={`${navLink} inline-flex items-center gap-1.5`}>
              <GithubIcon className="size-3.5" />
              GitHub
            </ExternalLink>
          </nav>
        </header>
        <main data-testid="site-main" className="flex-1">
          <Outlet />
        </main>
        <footer data-testid="site-footer" className="mt-20 flex flex-wrap items-center justify-between gap-2 border-t py-6 text-xs text-muted-foreground">
          <span>© {profile.name}</span>
          <span className="flex gap-4">
            <a href={`mailto:${profile.email}`} className={navLink}>{profile.email}</a>
            <ExternalLink href={profile.blog} className={navLink}>博客</ExternalLink>
            <ExternalLink href={profile.github} className={navLink}>GitHub</ExternalLink>
          </span>
        </footer>
        <ScrollRestoration />
      </div>
    </MotionConfig>
  )
}
