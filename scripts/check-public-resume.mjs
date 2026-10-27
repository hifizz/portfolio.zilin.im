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
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-testid="resume-cta"]')).opacity === '1')
  assert.ok(await page.evaluate(() => {
    const link = document.querySelector('[data-testid="resume-cta"]')
    const role = link.previousElementSibling
    const rect = link.getBoundingClientRect()
    return role.textContent === 'AI Application Engineer' && rect.height >= 32 && rect.height <= 36 && rect.left >= 0 && rect.right <= innerWidth
  }), `CTA placement and size at ${width}px`)
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
  for (const text of ['公开简历', '字节跳动 · 飞书', '米哈游', '联系我，获取完整简历']) assert.ok(resume.includes(text))
  assert.ok(!/测试密码|测试账号|\b1[3-9]\d{9}\b|3000|900ms|TODO/.test(resume), 'No private resume details or placeholders')
  assert.equal(await page.evaluate(() => document.querySelectorAll('[data-testid="public-resume"] h3').length), 2)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`)
  if (width === 390) screenshots.push(await page.screenshot())
  await page.click('loc=role:link[name="查看个人作品"]')
  await page.waitForURL('**/#work')
  await page.waitForSelector('[data-testid="home-featured"]')
}

console.log({ result: 'OK: desktop/mobile CTA, keyboard navigation, public content, direct reload and return to projects', screenshots })
await task.finish({ keep: [] })
