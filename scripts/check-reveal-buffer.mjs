// With the dev server running: ego-browser nodejs < scripts/check-reveal-buffer.mjs
const assert = (await import('node:assert/strict')).default
const task = await taskSpace('portfolio-buffered-reveals')
const page = task.page('p1')
console.log({ spaceId: task.spaceId, page: page.label })
await page.cdp('Page.bringToFront')
const routes = [
  ['/', '[data-testid="home-hero"] > *, main section:not([data-testid="home-hero"])'],
  ['/resume', '[data-reveal]'],
  ...['threadchat', 'pi-cloud-agents', 'chatkeep', 'readsight', 'tars'].map(slug => [
    `/projects/${slug}`, '[data-testid="project-page"], [data-testid="project-header"], [data-testid="project-problem"], [data-testid="project-features"]',
  ]),
]
const ready = async selector => {
  await page.waitForSelector(selector)
  await page.waitForFunction(selector => {
    const targets = [...document.querySelectorAll(selector)].filter(el => {
      const rect = el.getBoundingClientRect()
      return rect.top < innerHeight + 180 && rect.bottom > 0
    })
    return targets.length > 0 && document.fonts.status === 'loaded' && targets.every(el => getComputedStyle(el).opacity === '1')
  }, selector, { timeout: 15000 })
  assert.equal(await page.evaluate(() => scrollY), 0, 'Content appears without scrolling')
}

for (const width of [1280, 390]) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 })
  await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  for (const [route, selector] of routes) {
    await page.evaluate(() => scrollTo(0, 0))
    await page.goto(`http://localhost:5173${route}`)
    await ready(selector)
    await page.reload()
    await ready(selector)
  }
}
await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
for (const [route, selector] of routes) {
  await page.goto(`http://localhost:5173${route}`)
  await ready(selector)
}
console.log('OK: desktop/mobile initial load and refresh, 200px reveal buffer, reduced motion, all project pages')
await task.finish({ keep: [] })
