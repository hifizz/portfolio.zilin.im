// With the dev server running: ego-browser nodejs < scripts/check-project-content.mjs
const assert = (await import('node:assert/strict')).default
const task = await taskSpace('portfolio-project-content')
const page = task.page('p1')
await page.cdp('Page.bringToFront')
const screenshots = []
const engineeringCounts = { threadchat: 12, 'pi-cloud-agents': 4, tars: 3, chatkeep: 0, readsight: 0 }
const challengeTitles = [
  '让非线性对话仍然易于操作，并保持流畅',
  '让分支独立探索，让成果可靠复用',
  '在多模型条件下，同时做好回答质量与成本控制',
  '让 AI 的执行过程可信、可控，而不只是“看起来完成了”',
]

for (const width of [1280, 390, 320]) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 })
  await page.goto('http://localhost:5173/')
  await page.waitForSelector('[data-testid="home-hero"]')
  const home = await page.snapshot({ scope: 'full_page' })
  assert.ok(home.includes('飞书与米哈游'))
  assert.ok(!/人脑思考工程学|一个晚上搭好 Demo/.test(home))
  assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('[data-testid="home-featured"] h3')].map(el => el.textContent)), ['ThreadChat', 'Pi-cloud-agents'])

  for (const [slug, count] of Object.entries(engineeringCounts)) {
    await page.goto(`http://localhost:5173/projects/${slug}`)
    await page.waitForSelector('[data-testid="project-page"]')
    await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-testid="project-page"]')).opacity === '1')
    const content = await page.evaluate(() => ({
      text: document.querySelector('[data-testid="project-page"]').textContent,
      practices: document.querySelectorAll('[data-testid="project-engineering"] h3').length,
      challenges: [...document.querySelectorAll('[data-testid="project-challenges"] h3')].map(el => el.textContent),
      sections: [...document.querySelectorAll('[data-testid="project-features"], [data-testid="project-challenges"], [data-testid="project-engineering"]')].map(el => el.dataset.testid),
      stack: document.querySelector('[data-testid="project-stack"]')?.textContent,
      note: document.querySelector('[data-testid="project-note"]')?.textContent,
      cta: document.querySelector('[data-testid="project-cta"]').href,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }))
    assert.equal(content.practices, count, `${slug}: engineering sections`)
    assert.deepEqual(content.challenges, slug === 'threadchat' ? challengeTitles : [], `${slug}: optional challenges`)
    assert.equal(Boolean(content.stack), count > 0, `${slug}: optional stack`)
    assert.ok(!/TODO|Project 功能的升级版|下一代 AI 交互形态|测试密码|测试账号/.test(content.text))
    assert.ok(!content.overflow, `${slug}: no horizontal overflow at ${width}px`)
    if (slug === 'threadchat') {
      assert.deepEqual(content.sections, ['project-features', 'project-challenges', 'project-engineering'])
      assert.ok(content.text.includes('目标是在相同基础模型下提供接近 ChatGPT 的体验'), 'Comparison is a quality goal, not a verified parity claim')
      for (const keyword of ['RAG', 'Embedding', 'SSE', 'Langfuse', 'OpenTelemetry', 'Tool Calling', 'Structured Output', 'LLM-as-a-Judge', 'Web Search', 'Web Fetch', 'Deep Research', 'readUrl', 'Context Compaction', 'Memory', 'searchMemory', 'GitHub App']) assert.ok(content.text.includes(keyword), `ThreadChat: ${keyword}`)
      for (const text of ['新聊天默认就是一个 Project', 'Artifact / Revision', '历史引用与分叉不随新版改写', '不把对话压缩等同于长期记忆', '游标续读', '超时先核实远端事实', '向量服务未配置或检索失败']) assert.ok(content.text.includes(text), `ThreadChat: ${text}`)
      for (const text of ['统一的 webSearch / readUrl 工具', '结构化子问题', '工具策略层与服务层', '正文抽取', 'AnySearch → Exa', '轻量摘要', '完整序列化结果', '标记部分读取', '聚合有效来源']) assert.ok(content.text.includes(text), `ThreadChat search engineering: ${text}`)
      assert.ok(!/Parallel|Firecrawl|前置模型分类|rank fusion/.test(content.text), 'Do not present planned provider routing or retired classification as current capabilities')
      assert.equal(await page.evaluate(() => document.querySelector('[data-testid="project-engineering"] h3').textContent), 'Project 与文档产物模型')
    }
    if (slug === 'pi-cloud-agents') {
      assert.ok(content.text.includes('白名单'))
      assert.ok(content.note.includes('共享沙箱'))
      assert.equal(new URL(content.cta).hostname, 'github.com', 'Restricted instance is not a public trial CTA')
    }
    if (slug === 'tars') {
      assert.ok(content.text.includes('本地自托管实验'))
      assert.ok(content.text.includes('66 次运行'))
      assert.ok(content.text.includes('不代表任意真实网站的成功率'))
      assert.ok(content.note.includes('本机运行'))
      assert.ok(!content.text.includes('已上线'))
    }
    if ((width === 1280 || width === 390) && slug === 'threadchat') {
      await page.evaluate(() => document.querySelector('[data-testid="project-challenges"]').scrollIntoView())
      screenshots.push(await page.screenshot())
      await page.evaluate(() => document.querySelector('[data-testid="project-engineering"]').scrollIntoView())
      screenshots.push(await page.screenshot())
      if (width === 390) {
        await page.evaluate(() => [...document.querySelectorAll('[data-testid="project-engineering"] h3')].find(el => el.textContent === '联网工具封装与深度研究').scrollIntoView())
        screenshots.push(await page.screenshot())
      }
    }
  }

  await page.goto('http://localhost:5173/resume')
  await page.waitForSelector('[data-testid="public-resume"]')
  const resume = await page.evaluate(() => document.querySelector('[data-testid="public-resume"]').textContent)
  assert.ok(resume.includes('附件检索、工具调用、云端 Agent 执行和 Computer Use'))
  assert.ok(!/\b1[3-9]\d{9}\b|3000|900ms|测试密码|测试账号/.test(resume))
  assert.equal(await page.evaluate(() => document.querySelectorAll('[data-testid="resume-projects"] a')[2].getAttribute('href')), '/projects/tars')
}
console.log({ result: 'OK: project copy and engineering evidence; optional sections; access labels; privacy; desktop/mobile layout', screenshots })
await task.finish({ keep: [] })
