import { useState } from 'react'
import { Play, VideoOff } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type Props = { src?: string; poster?: string; title: string; autoPlay?: boolean; className?: string }

/** 主介绍视频。文件缺失或加载失败时显示占位，不报错。 */
export function VideoPlayer({ src, poster, title, autoPlay, className }: Props) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div
        className={cn(
          'flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 text-sm text-muted-foreground',
          className,
        )}
      >
        <VideoOff className="size-5" aria-hidden />
        介绍视频准备中
      </div>
    )
  }
  return (
    <video
      key={src}
      src={src}
      poster={poster}
      controls
      autoPlay={autoPlay}
      playsInline
      preload="metadata"
      aria-label={`${title} 介绍视频`}
      onError={() => setFailed(true)}
      className={cn('aspect-video w-full rounded-lg bg-black', className)}
    />
  )
}

/** 封面 + 播放按钮，点击弹窗播放。 */
export function VideoThumb({ src, poster, title, className }: Omit<Props, 'autoPlay'>) {
  const [open, setOpen] = useState(false)
  const [posterOk, setPosterOk] = useState(true)
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        aria-label={`播放 ${title} 介绍视频`}
        className={cn(
          'group/thumb relative block aspect-video w-full overflow-hidden rounded-md border bg-gradient-to-br from-muted to-muted/30',
          className,
        )}
      >
        {poster && posterOk && (
          <img
            src={poster}
            alt=""
            loading="lazy"
            onError={() => setPosterOk(false)}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-background/90 shadow-sm ring-1 ring-border transition group-hover/thumb:scale-105">
            <Play className="size-4 translate-x-px fill-current" aria-hidden />
          </span>
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-2 sm:max-w-4xl">
          <DialogTitle className="sr-only">{title} 介绍视频</DialogTitle>
          {open && <VideoPlayer src={src} poster={poster} title={title} autoPlay />}
        </DialogContent>
      </Dialog>
    </>
  )
}
