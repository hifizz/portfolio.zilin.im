// With the dev server running: ego-browser nodejs < scripts/check-public-resume.mjs
const assert = (await import('node:assert/strict')).default
const task = await taskSpace('portfolio-public-resume')
const page = task.page('p1')
const screenshots = []

for (const width of [1280, 390, 320]) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 })
  await page.goto('http://localhost:5173/')
  await page.waitForSelector('[data-testid="resume-cta"]')
  const home = await page.snapshot()
  assert.ok(home.includes('我正在找工作，点击查看我的简历'))
  const role = await page.evaluate(() => document.querySelector('[data-testid="home-hero"] > p').textContent)
  const productLinks = await page.evaluate(() => [...document.querySelectorAll('[data-testid="home-featured"] h3 a, [data-testid="home-products"] h3 a')].map(link => link.getAttribute('href')).sort())
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-testid="resume-cta"]')).opacity === '1')
  assert.ok(await page.evaluate((role) => {
    const link = document.querySelector('[data-testid="resume-cta"]')
    const rect = link.getBoundingClientRect()
    return link.previousElementSibling.textContent === role && rect.height >= 32 && rect.height <= 36 && rect.left >= 0 && rect.right <= innerWidth
  }, role), `CTA placement and size at ${width}px`)
  if (width !== 390) screenshots.push(await page.screenshot())

  await page.focus('[data-testid="resume-cta"]')
  await page.press('[data-testid="resume-cta"]', 'Enter')
  await page.waitForURL('**/resume')
  await page.waitForSelector('[data-testid="public-resume"]')
  if (width === 1280) {
    await page.reload()
    await page.waitForSelector('[data-testid="public-resume"]')
  }
  const resume = await page.snapshot({ scope: 'full_page' })
  for (const text of ['公开简历', '字节跳动 · 飞书', '米哈游', '联系我，获取完整简历', '我的 AI 订阅', 'GitHub 活跃记录', '我的个人作品', '我的审美']) assert.ok(resume.includes(text))
  assert.ok(!/测试密码|测试账号|\b1[3-9]\d{9}\b|3000|900ms|TODO/.test(resume), 'No private resume details or placeholders')
  assert.equal(await page.evaluate(() => document.querySelectorAll('section[aria-labelledby="resume-experience"] h3').length), 2)
  assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('[data-testid="resume-projects"] a')].map(link => link.getAttribute('href')).sort()), productLinks)
  assert.equal(await page.evaluate(() => document.querySelectorAll('[data-testid="resume-projects"] a')[2].getAttribute('href')), '/projects/tars', 'Tars is the third resume project')
  assert.ok(await page.evaluate(() => {
    const list = document.querySelector('[data-testid="resume-projects"] ul')
    return [...list.children].every(item => Math.abs(item.getBoundingClientRect().width - list.getBoundingClientRect().width) < 1)
  }), `Each project fills one row at ${width}px`)
  assert.deepEqual(await page.evaluate(async () => {
    const icons = [...document.querySelectorAll('[data-testid="resume-subscriptions"] img')]
    await Promise.all(icons.map(img => img.decode()))
    return icons.map(img => ({ loaded: img.naturalWidth > 0, grayscale: getComputedStyle(img).filter.includes('grayscale(1)') }))
  }), Array.from({ length: 7 }, (_, i) => ({ loaded: true, grayscale: i === 1 })))
  assert.ok(await page.evaluate(() => {
    const items = [...document.querySelectorAll('[data-testid="resume-subscriptions"] li')]
    return items.every(item => item.textContent.trim() === '' && getComputedStyle(item).borderTopWidth === '0px' && item.getBoundingClientRect().top === items[0].getBoundingClientRect().top && item.querySelector('img').alt)
  }), `Subscription logos only, one row at ${width}px`)
  assert.ok(await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('[data-testid="resume-subscriptions"] ul')).columnGap) <= 12), 'Compact logo spacing')
  assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('[data-testid="resume-subscriptions"] a')].map(link => {
    const url = new URL(link.href)
    return { url: url.origin + url.pathname, target: link.target, safe: link.rel.includes('noopener') }
  })), ['https://openai.com/codex/', 'https://code.claude.com/', 'https://devin.ai/', 'https://commandcode.ai/', 'https://www.volcengine.com/product/ark', 'https://bigmodel.cn/', 'https://www.kimi.com/'].map(url => ({ url, target: '_blank', safe: true })))
  if (width === 1280) {
    await page.hover('[data-testid="resume-subscriptions"] a[aria-label="Codex"]')
    await page.waitForSelector('[data-testid="subscription-tooltip"]')
    assert.ok((await page.snapshot()).includes('Codex'))
    await page.focus('[data-testid="resume-subscriptions"] a[aria-label="Claude Code"]')
    await page.waitForFunction(() => document.querySelector('[data-testid="subscription-tooltip"]')?.textContent.includes('Claude Code'))
    await page.press('[data-testid="resume-subscriptions"] a[aria-label="Claude Code"]', 'Escape')
    await page.waitForSelector('[data-testid="subscription-tooltip"]', { state: 'hidden' })
  }
  assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('[data-testid="resume-design"] a')].map(link => ({ host: new URL(link.href).hostname, target: link.target, safe: link.rel.includes('noopener') }))), [
    { host: 'effect-preview.vercel.app', target: '_blank', safe: true },
    { host: 'chatkeep.dev', target: '_blank', safe: true },
  ])
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`)
  if (width === 390) screenshots.push(await page.screenshot())
  if (width === 320) {
    await page.evaluate(() => document.querySelector('[data-testid="github-contributions"]')?.dispatchEvent(new Event('error')))
    await page.waitForSelector('[data-testid="resume-github"] [role="status"]')
    assert.ok(await page.evaluate(() => document.querySelector('[data-testid="resume-github"] a').href.startsWith('https://github.com/hifizz')))
    await page.click('[data-testid="resume-projects"] a[href="/projects/pi-cloud-agents"]')
    await page.waitForURL('**/projects/pi-cloud-agents')
    await page.waitForSelector('[data-testid="project-page"]')
    await page.goto('http://localhost:5173/resume')
    await page.waitForSelector('[data-testid="public-resume"]')
  }
  await page.click('loc=role:link[name="查看个人作品"]')
  await page.waitForURL('**/#work')
  await page.waitForSelector('[data-testid="home-featured"]')
}

console.log({ result: 'OK: responsive resume; local icons and grayscale; all products; design links; GitHub fallback; keyboard navigation', screenshots })
await task.finish({ keep: [] })
