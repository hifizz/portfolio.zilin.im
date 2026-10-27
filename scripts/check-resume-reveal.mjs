// With the dev server running: ego-browser nodejs < scripts/check-resume-reveal.mjs
const assert = (await import('node:assert/strict')).default
const task = await taskSpace('portfolio-resume-stagger')
const page = task.page('p1')
console.log({ spaceId: task.spaceId, page: page.label })
await page.cdp('Page.bringToFront')
await page.cdp('Page.addScriptToEvaluateOnNewDocument', { source: `
  window.__resumeFrames = [];
  window.__recordResume = true;
  function sample(time) {
    const hero = document.querySelector('[data-reveal="hero"]');
    const experience = document.querySelector('[aria-labelledby="resume-experience"]');
    const cards = [...document.querySelectorAll('[data-testid="resume-projects"] > ul > li')];
    if (hero && experience && cards.length) window.__resumeFrames.push({
      time, hero: Number(getComputedStyle(hero).opacity),
      experience: Number(getComputedStyle(experience).opacity),
      cards: cards.map(card => Number(getComputedStyle(card).opacity))
    });
    if (window.__recordResume) requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);
` })
const targets = '[data-reveal="hero"], [data-reveal="block"], [data-reveal="projects"] > h2, [data-reveal="projects"] > ul > li'

for (const width of [1280, 390]) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 })
  await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  await page.evaluate(() => scrollTo(0, 0))
  await page.goto('http://localhost:5173/resume')
  await page.waitForFunction(selector => {
    const visible = [...document.querySelectorAll(selector)].filter(el => el.getBoundingClientRect().top < innerHeight + 180)
    return visible.length > 0 && document.fonts.status === 'loaded' && visible.every(el => getComputedStyle(el).opacity === '1')
  }, targets, { timeout: 15000 })
  assert.equal(await page.evaluate(() => scrollY), 0, 'Initial content does not require scrolling')
  const initial = await page.evaluate(() => {
    const frames = window.__resumeFrames
    const firstIntermediate = key => frames.find(frame => frame[key] > 0 && frame[key] < 1)?.time
    const lastCard = document.querySelector('[data-testid="resume-projects"] > ul > li:last-child')
    return {
      heroStart: firstIntermediate('hero'), experienceStart: firstIntermediate('experience'),
      lastCardOpacity: getComputedStyle(lastCard).opacity,
      parentOpacity: getComputedStyle(document.querySelector('[data-testid="resume-projects"]')).opacity,
    }
  })
  assert.ok(Number.isFinite(initial.heroStart) && Number.isFinite(initial.experienceStart), 'Both header and experience actually fade, rather than only ending visible')
  assert.ok(initial.experienceStart - initial.heroStart >= 80, 'Experience enters after the header starts')
  assert.equal(initial.parentOpacity, '1', 'The entire project list is not animated as one block')
  assert.equal(initial.lastCardOpacity, '0', 'Distant cards have not already played with the first card')

  await page.evaluate(() => {
    const card = document.querySelector('[data-testid="resume-projects"] > ul > li:last-child')
    scrollTo(0, scrollY + card.getBoundingClientRect().top - innerHeight + 120)
  })
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-testid="resume-projects"] > ul > li:last-child')).opacity === '1', undefined, { timeout: 15000 })
  assert.ok(await page.evaluate(() => window.__resumeFrames.some(frame => {
    const opacity = frame.cards.at(-1)
    return opacity > 0 && opacity < 1
  })), 'The last card has its own visible fade after scrolling')

  await page.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await page.waitForFunction(selector => [...document.querySelectorAll(selector)].every(el => getComputedStyle(el).opacity === '1'), targets)
  await page.evaluate(() => { window.__recordResume = false; scrollTo(0, 0) })
}
console.log('OK: desktop/mobile staggered first-screen fades, independent project-card fades, no-scroll initial display, reduced-motion cleanup')
await task.finish({ keep: [] })
