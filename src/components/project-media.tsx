import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/video'
import { posterUrl, videoUrl, type Project } from '@/content/projects'

export function ProjectMedia({ project }: { project: Project }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)
  const reducedMotion = useReducedMotion()
  const screenshots = project.detail?.screenshots ?? []
  const screenshot = screenshots[index - 1]
  const total = screenshots.length + 1
  const video = <VideoPlayer src={videoUrl(project)} poster={posterUrl(project)} title={project.name} className="size-full rounded-none border-0" data-testid="project-video" />
  const move = (step: number) => setIndex((current) => (current + step + total) % total)

  useEffect(() => {
    if (paused || total < 2) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % total), 3000)
    return () => window.clearTimeout(timer)
  }, [index, paused, total])

  if (!screenshots.length) {
    return <VideoPlayer src={videoUrl(project)} poster={posterUrl(project)} title={project.name} className="mt-8" data-testid="project-video" />
  }

  return (
    <section
      role="region"
      aria-roledescription="轮播"
      aria-label={`${project.name} 介绍视频与截图`}
      tabIndex={0}
      onPlayCapture={() => setPaused(true)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          move(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
      className="mt-8 min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      data-testid="project-media"
    >
      <figure>
        <div
          className="placeholder-pattern relative aspect-video touch-pan-y overflow-hidden rounded-lg border"
          onTouchStart={(event) => { touchStart.current = event.touches[0].clientX }}
          onTouchCancel={() => { touchStart.current = null }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return
            const delta = event.changedTouches[0].clientX - touchStart.current
            touchStart.current = null
            if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1)
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.45, ease: 'easeInOut' }}
            >
              {index === 0 ? video : (
                <img
                  src={screenshot.src}
                  alt={`${project.name} 产品截图 ${index}${screenshot.caption ? `：${screenshot.caption}` : ''}`}
                  className="absolute inset-0 size-full object-contain"
                  decoding="async"
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-1 flex h-10 items-center gap-3 px-0.5" data-testid="project-media-footer">
          <figcaption className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={screenshot?.caption} aria-live={paused ? 'polite' : 'off'}>
            {screenshot?.caption ?? ''}
          </figcaption>
          <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
            <Button type="button" variant="ghost" size="icon-xs" aria-label={paused ? '开始自动轮播' : '暂停自动轮播'} onClick={() => setPaused((current) => !current)}>
              {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
            </Button>
            <Button type="button" variant="ghost" size="icon-xs" aria-label="上一项" onClick={() => move(-1)}>
              <ChevronLeft aria-hidden />
            </Button>
            <span className="min-w-10 text-center font-mono text-[10px] tabular-nums" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
              {index + 1} / {total}
            </span>
            <Button type="button" variant="ghost" size="icon-xs" aria-label="下一项" onClick={() => move(1)}>
              <ChevronRight aria-hidden />
            </Button>
          </div>
        </div>
      </figure>
    </section>
  )
}
