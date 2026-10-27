// With the dev server running: ego-browser nodejs < scripts/check-media-touch.mjs
const assert = (await import('node:assert/strict')).default
const task = await taskSpace('portfolio-mobile-image-zoom')
const page = task.page('p1')
const inline = '[data-testid="project-media"]'
const viewer = '[data-testid="project-media-viewer"]'
const position = (root) => page.evaluate((selector) => document.querySelector(`${selector} [data-testid="project-media-footer"]`).textContent.trim(), root)
const gesture = (root, kind) => page.evaluate(({ root, kind }) => {
  const target = document.querySelector(`${root} figure > div`)
  const point = (id, x, y) => new Touch({ identifier: id, target, clientX: x, clientY: y })
  const send = (type, touches, changedTouches = touches) => target.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches, changedTouches }))
  send('touchstart', [point(1, 240, 140)])
  if (kind === 'pinch') {
    send('touchstart', [point(1, 240, 140), point(2, 100, 140)])
    send('touchmove', [point(1, 300, 140), point(2, 40, 140)])
    send('touchend', [point(1, 300, 140)], [point(2, 40, 140)])
  }
  send('touchend', [], [point(1, 100, kind === 'vertical' ? 440 : 140)])
}, { root, kind })

try {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: true })
  await page.goto('http://10.0.0.241:5173/projects/threadchat')
  await page.click('button[aria-label="暂停自动轮播"]')
  const before = await position(inline)
  assert.ok((await page.evaluate((root) => getComputedStyle(document.querySelector(`${root} figure > div`)).touchAction, inline)).includes('pinch-zoom'))
  await gesture(inline, 'swipe')
  await page.waitForFunction(({ root, before }) => document.querySelector(`${root} [data-testid="project-media-footer"]`).textContent.trim() !== before, { root: inline, before })
  const afterSwipe = await position(inline)
  await gesture(inline, 'vertical')
  assert.equal(await position(inline), afterSwipe, 'Vertical scrolling must not change slides')
  await gesture(inline, 'pinch')
  assert.equal(await position(inline), afterSwipe, 'Two-finger gestures must not change slides')

  if (await page.evaluate((root) => !document.querySelector(`${root} button[aria-label^="放大查看第"]`), inline)) {
    await page.click(`${inline} button[aria-label="下一项"]`)
  }
  await page.click(`${inline} button[aria-label^="放大查看第"]`)
  await page.waitForSelector(`${viewer} img`)
  assert.equal(await page.evaluate((root) => getComputedStyle(document.querySelector(`${root} figure > div`)).touchAction, viewer), 'auto')
  const beforeViewerSwipe = await position(viewer)
  await page.cdp('Input.synthesizeScrollGesture', { x: 250, y: 350, xDistance: -150, speed: 500, gestureSourceType: 'touch' })
  await page.waitForFunction(({ root, before }) => document.querySelector(`${root} [data-testid="project-media-footer"]`).textContent.trim() !== before, { root: viewer, before: beforeViewerSwipe })
  const slide = await position(viewer)
  await page.cdp('Input.synthesizePinchGesture', { x: 195, y: 350, scaleFactor: 3, relativeSpeed: 800, gestureSourceType: 'touch' })
  await page.waitForFunction(() => visualViewport.scale > 2)
  assert.equal(await position(viewer), slide, 'Native pinch must preserve the current slide')
  const beforePan = await page.evaluate(() => ({ x: visualViewport.offsetLeft, y: visualViewport.offsetTop }))
  const center = await page.evaluate(() => ({ x: visualViewport.width / 2, y: visualViewport.height / 2 }))
  await page.cdp('Input.synthesizeScrollGesture', { ...center, yDistance: -50, speed: 500, gestureSourceType: 'touch' })
  const afterPan = await page.evaluate(() => ({ x: visualViewport.offsetLeft, y: visualViewport.offsetTop }))
  assert.notDeepEqual(afterPan, beforePan, 'Zoomed viewport must allow panning')
  await gesture(viewer, 'swipe')
  assert.equal(await position(viewer), slide, 'Dragging after zoom must not turn pages')
  console.log('OK: mobile native pinch + pan; unzoomed swipe; vertical and multitouch guards; no accidental paging after zoom')
} finally {
  await page.cdp('Emulation.setPageScaleFactor', { pageScaleFactor: 1 })
  await page.cdp('Emulation.setTouchEmulationEnabled', { enabled: false })
  await page.cdp('Emulation.clearDeviceMetricsOverride')
}
