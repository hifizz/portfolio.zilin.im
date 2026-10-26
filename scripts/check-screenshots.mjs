// Run with: node scripts/check-screenshots.mjs [--cdn]
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const server = await createServer({ root, server: { middlewareMode: true, hmr: false } })
const downloads = await mkdtemp(`${tmpdir()}/portfolio-cdn-`)
try {
  const { projects } = await server.ssrLoadModule('/src/content/projects.ts')
  const { ProjectMedia } = await server.ssrLoadModule('/src/components/project-media.tsx')
  const project = projects.find((item) => item.slug === 'threadchat')
  const screenshots = project.detail.screenshots
  const files = (await readdir(`${root}public/threadchat-screenshot`)).filter((name) => /\.(png|jpe?g|webp)$/i.test(name)).sort()
  const filename = (src) => new URL(src).pathname.split('/').pop()
  assert.deepEqual(screenshots.map(({ src }) => filename(src)), files)
  for (const { src } of screenshots) {
    assert.ok(src.startsWith('https://chatkeep.zilin.im/portfolio/threadchat-screenshot/'), 'Screenshots must use the public R2 domain')
    assert.ok(src.endsWith('.webp'), 'Screenshots must use optimized WebP assets')
    const buffer = await readFile(`${root}public/threadchat-screenshot/${filename(src)}`)
    assert.equal(buffer.toString('ascii', 0, 4), 'RIFF')
    assert.equal(buffer.toString('ascii', 8, 12), 'WEBP')
    if (process.argv.includes('--cdn')) {
      const download = `${downloads}/${filename(src)}`
      execFileSync('curl', ['--fail', '--silent', '--show-error', '--location', '--retry', '2', '--retry-all-errors', '--max-time', '20', '--output', download, src])
      assert.ok((await readFile(download)).equals(buffer), `${filename(src)} CDN integrity`)
    }
  }
  const render = (data) => renderToStaticMarkup(createElement(ProjectMedia, { project: data }))
  const initial = render(project)
  assert.ok(initial.includes('<video'), 'Video must be the first slide')
  assert.ok(initial.includes(`1 / ${files.length + 1}`))
  assert.ok(initial.includes('aria-label="暂停自动轮播"'), 'Autoplay must have a pause control')
  assert.ok(initial.includes('aria-label="放大查看介绍视频"'), 'Media must expose a large-viewer control')
  assert.ok(initial.includes('aria-haspopup="dialog"'))
  assert.ok(initial.includes('flex h-10'), 'Caption and controls reserve one fixed-height row')
  assert.ok(initial.includes('<figcaption'), 'Caption slot remains even when empty')
  assert.ok(!initial.includes(screenshots[0].src), 'Screenshots follow the video')
  const placeholder = render({ ...project, video: undefined })
  assert.ok(placeholder.includes('介绍视频准备中'))
  assert.ok(placeholder.includes('placeholder-pattern absolute inset-0 opacity-65'))
  const videoOnly = render({ ...project, detail: { ...project.detail, screenshots: [] } })
  assert.ok(!videoOnly.includes('project-media-footer'))
  console.log(`OK: video + ${files.length} ordered screenshots; fixed footer; patterned placeholder; video-only fallback`)
} finally {
  await server.close()
  await rm(downloads, { recursive: true, force: true })
}
