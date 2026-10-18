import { Link, Outlet, ScrollRestoration } from 'react-router'
import { ExternalLink } from '@/components/external-link'
import { profile } from '@/content/projects'

export function Layout() {
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col px-5 sm:px-8">
      <header className="flex h-14 items-center justify-center text-sm">
        <nav className="flex items-center gap-6 text-muted-foreground">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-foreground">首页</Link>
          <Link to="/#work" className="hover:text-foreground">作品</Link>
          <Link to="/#writing" className="hover:text-foreground">文章</Link>
          <ExternalLink href={profile.blog} className="hover:text-foreground">博客</ExternalLink>
          <ExternalLink href={profile.github} className="hover:text-foreground">GitHub</ExternalLink>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="mt-20 flex flex-wrap items-center justify-between gap-2 border-t py-6 text-xs text-muted-foreground">
        <span>© {profile.name}</span>
        <span className="flex gap-4">
          <a href={`mailto:${profile.email}`} className="hover:text-foreground">{profile.email}</a>
          <ExternalLink href={profile.blog} className="hover:text-foreground">博客</ExternalLink>
          <ExternalLink href={profile.github} className="hover:text-foreground">GitHub</ExternalLink>
        </span>
      </footer>
      <ScrollRestoration />
    </div>
  )
}
