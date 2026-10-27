// With the dev server running: ego-browser nodejs < scripts/check-card-hover.mjs
const assert = (await import('node:assert/strict')).default
const task = await taskSpace('portfolio-card-hover')
const page = task.page('p1')
await page.cdp('Page.bringToFront')
await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: false })
await page.cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false })
await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
const cards = [
  ['/', '[data-testid="product-card-threadchat"]', 'ARTICLE'],
  ['/resume', '[data-testid="resume-projects"] li:first-child > a', 'A'],
  ['/resume', '[data-testid="resume-design"] li:first-child > a', 'A'],
]
const screenshots = []
let sharedTiming

for (const [route, selector, tag] of cards) {
  await page.goto(`http://localhost:5173${route}`)
  await page.waitForSelector(selector, { state: 'attached' })
  await page.hover(selector)
  await page.waitForFunction(selector => getComputedStyle(document.querySelector(selector)).translate === '0px -2px', selector)
  await page.mouse.move(1, 1)
  await page.waitForFunction(selector => getComputedStyle(document.querySelector(selector)).translate === 'none', selector)
  const initial = await page.evaluate(selector => {
    const card = document.querySelector(selector)
    const style = getComputedStyle(card)
    window.__cardSamples = []
    window.__recordCard = true
    function sample() {
      const current = getComputedStyle(card)
      window.__cardSamples.push({ y: parseFloat(current.translate.split(' ').at(-1)) || 0, light: Number(getComputedStyle(card, '::before').opacity) })
      if (window.__recordCard) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    return { tag: card.tagName, shared: card.classList.contains('interactive-card'), timing: [style.transitionProperty, style.transitionDuration, style.transitionTimingFunction], radius: style.borderRadius, border: style.borderColor }
  }, selector)
  assert.equal(initial.tag, tag, 'No extra DOM wrapper or changed semantics')
  assert.ok(initial.shared)
  assert.ok(initial.timing[0].includes('translate'), 'Animate the property Tailwind actually changes')
  assert.equal(initial.timing[1], '0.2s, 0.2s')
  sharedTiming ??= initial.timing
  assert.deepEqual(initial.timing, sharedTiming, 'All cards share the same timing and easing')

  await page.hover(selector)
  await page.waitForFunction(selector => getComputedStyle(document.querySelector(selector)).translate === '0px -2px' && getComputedStyle(document.querySelector(selector), '::before').opacity === '1', selector)
  const hovered = await page.evaluate(selector => {
    const card = document.querySelector(selector)
    const style = getComputedStyle(card)
    const light = getComputedStyle(card, '::before')
    return { intermediate: window.__cardSamples.some(frame => frame.y < -0.01 && frame.y > -1.99), radius: style.borderRadius, lightRadius: light.borderRadius, pointerEvents: light.pointerEvents, border: style.borderColor, x: card.style.getPropertyValue('--card-x'), y: card.style.getPropertyValue('--card-y') }
  }, selector)
  assert.ok(hovered.intermediate, 'Hover moves through intermediate frames, not an instant jump')
  assert.equal(hovered.radius, initial.radius)
  assert.equal(hovered.lightRadius, initial.radius, 'Spotlight follows each card shape')
  assert.equal(hovered.pointerEvents, 'none', 'Spotlight never captures link or video clicks')
  assert.notEqual(hovered.border, initial.border)
  assert.ok(hovered.x && hovered.y, 'Shared pointer tracking reaches native and custom links')
  if (selector.includes('resume-projects')) screenshots.push(await page.screenshot())

  await page.evaluate(() => { window.__cardSamples = [] })
  await page.mouse.move(1, 1)
  await page.waitForFunction(selector => getComputedStyle(document.querySelector(selector)).translate === 'none' && getComputedStyle(document.querySelector(selector), '::before').opacity === '0', selector)
  assert.ok(await page.evaluate(() => window.__cardSamples.some(frame => frame.y < -0.01 && frame.y > -1.99)), 'Hover exit is smooth too')
  await page.evaluate(() => { window.__recordCard = false })

  await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await page.hover(selector)
  assert.ok(await page.evaluate(selector => {
    const card = document.querySelector(selector)
    return getComputedStyle(card).translate === 'none' && getComputedStyle(card).transitionDuration === '0s' && getComputedStyle(card, '::before').display === 'none'
  }, selector), 'Reduced motion disables lift, transitions and moving spotlight')
  await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
}

await page.goto('http://localhost:5173/resume')
const project = '[data-testid="resume-projects"] li:first-child > a'
await page.waitForSelector(project)
await page.focus(project)
await page.keyboard.press('Tab')
await page.keyboard.press('Shift+Tab')
assert.ok(await page.evaluate(selector => document.querySelector(selector).matches(':focus-visible'), project), 'Keyboard focus remains visible')
assert.ok(await page.evaluate(() => [...document.querySelectorAll('[data-testid="resume-design"] a')].every(link => link.target === '_blank' && link.rel.includes('noopener'))), 'External link behavior is preserved')
await page.press(project, 'Enter')
await page.waitForURL('**/projects/threadchat')

await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
await page.cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: true })
assert.ok(await page.evaluate(() => matchMedia('(hover: none) and (pointer: coarse)').matches), 'Touch device is actually emulated')
for (const [route, selector] of cards) {
  await page.goto(`http://localhost:5173${route}`)
  await page.waitForSelector(selector, { state: 'attached' })
  await page.hover(selector)
  assert.ok(await page.evaluate(selector => {
    const card = document.querySelector(selector)
    return getComputedStyle(card).translate === 'none' && getComputedStyle(card, '::before').opacity === '0' && document.documentElement.scrollWidth <= innerWidth
  }, selector), 'Touch screens have no sticky hover lift, spotlight or horizontal overflow')
}
await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: false })
console.log({ result: 'OK: shared 200ms hover and exit; spotlight; original card shapes and link semantics; keyboard; reduced motion; touch', screenshots })
await task.finish({ keep: [] })
