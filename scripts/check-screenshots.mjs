// Run with: node scripts/check-screenshots.mjs
import assert from 'node:assert/strict'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const server = await createServer({ root, server: { middlewareMode: true, hmr: false } })
try {
  const { projects } = await server.ssrLoadModule('/src/content/projects.ts')
  const { ProjectMedia } = await server.ssrLoadModule('/src/components/project-media.tsx')
  const project = projects.find((item) => item.slug === 'threadchat')
  const screenshots = project.detail.screenshots
  const files = (await readdir(`${root}public/threadchat-screenshot`)).filter((name) => /\.(png|jpe?g|webp)$/i.test(name)).sort()
  assert.deepEqual(screenshots.map(({ src }) => src), files.map((name) => `/threadchat-screenshot/${name}`))
  const render = (data) => renderToStaticMarkup(createElement(ProjectMedia, { project: data }))
  const initial = render(project)
  assert.ok(initial.includes('<video'), 'Video must be the first slide')
  assert.ok(initial.includes(`1 / ${files.length + 1}`))
  assert.ok(initial.includes('aria-label="暂停自动轮播"'), 'Autoplay must have a pause control')
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
}
