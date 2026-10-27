// With the dev server running: ego-browser nodejs < scripts/check-project-back.mjs
const assert = (await import('node:assert/strict')).default
const task = await taskSpace('portfolio-project-back')
const page = task.page('p1')
console.log({ spaceId: task.spaceId, page: page.label })
await page.cdp('Page.bringToFront')
const base = 'http://localhost:5173'
const back = '[data-testid="project-back"]'

for (const width of [1280, 390]) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 })
  // Direct entry, including after reload: replace with home rather than creating a back loop.
  await page.goto(`${base}/projects/threadchat`)
  await page.waitForSelector(back)
  assert.equal(await page.evaluate(() => history.state.idx), 0)
  await page.reload()
  await page.waitForSelector(back)
  const historyLength = await page.evaluate(() => history.length)
  await page.focus(back)
  await page.press(back, 'Enter')
  await page.waitForURL(`${base}/`)
  assert.equal(await page.evaluate(() => history.length), historyLength)

  // A card opened from home returns to home and restores the scroll position.
  await page.waitForSelector('[data-testid="home-featured"]')
  await page.evaluate(() => scrollTo(0, 200))
  const homeScroll = await page.evaluate(() => scrollY)
  await page.click('[data-testid="product-card-threadchat"] h3 a')
  await page.waitForURL(`${base}/projects/threadchat`)
  await page.click(back)
  await page.waitForURL(`${base}/`)
  await page.waitForFunction(y => Math.abs(scrollY - y) < 2, homeScroll)

  // A card opened from the resume returns there even if the detail page was refreshed.
  await page.goto(`${base}/resume`)
  await page.click('[data-testid="resume-projects"] a[href="/projects/pi-cloud-agents"]')
  await page.waitForURL(`${base}/projects/pi-cloud-agents`)
  await page.reload()
  await page.waitForSelector(back)
  assert.ok(await page.evaluate(() => history.state.idx > 0))
  await page.click(back)
  await page.waitForURL(`${base}/resume`)

  // Next-project navigation goes back to the previous detail, not to the homepage.
  await page.goto(`${base}/projects/threadchat`)
  await page.click('[data-testid="project-next"]')
  await page.waitForURL(`${base}/projects/pi-cloud-agents`)
  await page.click(back)
  await page.waitForURL(`${base}/projects/threadchat`)
  await page.click(back)
  await page.waitForURL(`${base}/`)
}
console.log('OK: desktop/mobile direct-entry fallback, no history loop, keyboard access, home scroll restoration, resume return after refresh, previous-project return')
await task.finish({ keep: [] })
