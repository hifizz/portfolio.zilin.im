import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VideoPlayer } from '@/components/video'
import { posterUrl, videoUrl, type Project } from '@/content/projects'

export function ProjectMedia({ project }: { project: Project }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [open, setOpen] = useState(false)
  const mediaRef = useRef<HTMLElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const reducedMotion = useReducedMotion()
  const screenshots = project.detail?.screenshots ?? []
  const screenshot = screenshots[index - 1]
  const nextScreenshot = screenshots[index]?.src
  const total = screenshots.length + 1
  const video = <VideoPlayer src={videoUrl(project)} poster={posterUrl(project)} title={project.name} className="size-full rounded-none border-0" data-testid="project-video" />
  const image = screenshot && (
    <img
      src={screenshot.src}
      alt={`${project.name} 产品截图 ${index}${screenshot.caption ? `：${screenshot.caption}` : ''}`}
      className="absolute inset-0 size-full object-contain"
      decoding="async"
      draggable={false}
    />
  )
  const move = (step: number) => setIndex((current) => (current + step + total) % total)
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  useEffect(() => {
    if (!nextScreenshot) return
    const image = new Image()
    image.fetchPriority = 'low'
    image.src = nextScreenshot
    void image.decode().catch(() => {})
  }, [nextScreenshot])

  useEffect(() => {
    if (paused || open || total < 2) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % total), 3000)
    return () => window.clearTimeout(timer)
  }, [index, paused, open, total])

  if (!screenshots.length) {
    return <VideoPlayer src={videoUrl(project)} poster={posterUrl(project)} title={project.name} className="mt-8" data-testid="project-video" />
  }

  const renderMedia = (expanded: boolean) => (
    <figure>
      <div
        className={`placeholder-pattern relative overflow-hidden rounded-lg border ${expanded ? 'touch-auto h-[calc(100dvh-9rem)]' : 'touch-pan-y touch-pinch-zoom aspect-video'}`}
        onTouchStart={(event) => {
          // 未缩放时单指翻页；双指缩放和放大后的拖动交给浏览器。
          touchStart.current = event.touches.length === 1 && (window.visualViewport?.scale ?? 1) <= 1
            ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
            : null
        }}
        onTouchMove={(event) => {
          if (event.touches.length !== 1) touchStart.current = null
          // 防止弹窗的滚动锁拦截浏览器在缩放后的原生平移。
          if ((window.visualViewport?.scale ?? 1) > 1) event.stopPropagation()
        }}
        onTouchCancel={() => { touchStart.current = null }}
        onTouchEnd={(event) => {
          const start = touchStart.current
          touchStart.current = null
          if (!start || event.touches.length || (window.visualViewport?.scale ?? 1) > 1) return
          const deltaX = event.changedTouches[0].clientX - start.x
          const deltaY = event.changedTouches[0].clientY - start.y
          if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            event.preventDefault()
            move(deltaX < 0 ? 1 : -1)
          }
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
            {index === 0 ? video : expanded ? image : (
              <button
                type="button"
                className="absolute inset-0 cursor-zoom-in"
                aria-label={`放大查看第 ${index} 张截图`}
                aria-haspopup="dialog"
                onClick={() => setOpen(true)}
              >
                {image}
                <span className="absolute top-2 right-2 rounded-md bg-background/80 p-1.5 text-foreground shadow-sm">
                  <Maximize2 className="size-3.5" aria-hidden />
                </span>
              </button>
            )}
          </motion.div>
        </AnimatePresence>
        {!expanded && index === 0 && (
          <Button type="button" variant="ghost" size="icon-sm" className="absolute top-2 right-2 bg-background/80" aria-label="放大查看介绍视频" aria-haspopup="dialog" onClick={() => {
            mediaRef.current?.querySelector('video')?.pause()
            setOpen(true)
          }}>
            <Maximize2 aria-hidden />
          </Button>
        )}
      </div>
      <div className="mt-1 flex h-10 items-center gap-3 px-0.5" data-testid="project-media-footer">
        <figcaption className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={screenshot?.caption} aria-live={paused || open ? 'polite' : 'off'}>
          {screenshot?.caption ?? ''}
        </figcaption>
        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          {!expanded && (
            <Button type="button" variant="ghost" size="icon-xs" aria-label={paused ? '开始自动轮播' : '暂停自动轮播'} onClick={() => setPaused((current) => !current)}>
              {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
            </Button>
          )}
          <Button type="button" variant="ghost" size="icon-xs" aria-label="上一项" onClick={() => move(-1)}>
            <ChevronLeft aria-hidden />
          </Button>
          <span className="min-w-10 text-center font-mono text-[10px] tabular-nums" aria-live={paused || open ? 'polite' : 'off'} aria-atomic="true">
            {index + 1} / {total}
          </span>
          <Button type="button" variant="ghost" size="icon-xs" aria-label="下一项" onClick={() => move(1)}>
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </div>
    </figure>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <section
        ref={mediaRef}
        role="region"
        aria-roledescription="轮播"
        aria-label={`${project.name} 介绍视频与截图`}
        tabIndex={0}
        onPlayCapture={() => setPaused(true)}
        onKeyDown={handleKeyDown}
        className="mt-8 min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        data-testid="project-media"
      >
        {renderMedia(false)}
      </section>
      <DialogContent
        data-testid="project-media-viewer"
        aria-describedby={undefined}
        className="w-screen max-w-[1600px] gap-0 rounded-none p-2 pt-10 sm:w-[calc(100vw-2rem)] sm:max-w-[1600px] sm:rounded-xl"
        onKeyDown={handleKeyDown}
        onPlayCapture={() => setPaused(true)}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          mediaRef.current?.focus({ preventScroll: true })
        }}
      >
        <DialogTitle className="sr-only">{project.name} 大图查看器</DialogTitle>
        {open && renderMedia(true)}
      </DialogContent>
    </Dialog>
  )
}
