// 作品集唯一内容源。只放 AI 项目；未知信息用 TODO，不要编造。

export type ProjectKind = 'product' | 'oss' | 'lab' | 'skill'

export type ProjectLink = { label: string; href: string }

export type ProjectScreenshot = { src: string; caption?: string }

export type Project = {
  slug: string
  name: string
  kind: ProjectKind
  /** 卡片 / 列表上的一句话 */
  tagline: string
  /** 形态标签，例如「浏览器插件」「Web 应用」 */
  form?: string
  status?: string
  /** 状态圆点颜色：live 绿 / beta 琥珀；不填则无圆点 */
  statusTone?: 'live' | 'beta'
  featured?: boolean
  tags: string[]
  links: ProjectLink[]
  /** 视频文件名或完整 URL；相对路径会拼上 VITE_MEDIA_BASE（默认 /videos/） */
  video?: string
  /** 封面图文件名或完整 URL；相对路径拼 /posters/ */
  poster?: string
  /** 二级页内容（仅 product） */
  detail?: {
    problem: string
    features: string[]
    /** 按展示顺序排列；caption 留空时不显示说明 */
    screenshots?: ProjectScreenshot[]
    /** 适合谁（可选，没写就不显示） */
    audience?: string
  }
}

export const projects: Project[] = [
  {
    slug: 'threadchat',
    name: 'ThreadChat',
    kind: 'product',
    featured: true,
    status: '已上线（Beta 内测中）',
    statusTone: 'live',
    form: 'Web 应用',
    tagline: '能分叉聊天的 AI 应用，用树状对话解决研究型、探索性、决策型复杂问题。',
    tags: ['Agent', 'AI 交互', '工具调用', '上下文压缩', '记忆', '评测'],
    links: [
      { label: '官网', href: 'https://thread.zilin.im/' },
      // TODO: 文章《为什么要开发 ThreadChat？》上线后补链接，并恢复下方 articles 条目
    ],
    video: 'threadchat.mp4',
    poster: 'thread-chat.jpg',
    detail: {
      problem:
        '线性对话难以承载调研、决策、方案设计这类需要多方向追问的复杂问题。ThreadChat 让对话变成一棵树：可以理解为 ChatGPT / Claude Project 功能的升级版，致力于探索下一代 AI 交互形态。',
      features: [
        '在 AI 回复的任意位置划选内容，打开分支聊天',
        '多列并排展示分支，支持无限追问',
        '树状聊天组织复杂问题的调研、决策与方案设计',
        'Project 工具与 GitHub 接入',
      ],
      screenshots: [
        { src: '/threadchat-screenshot/SCR-20261026-olyb.png', caption: '多列并排展示分支，沿不同方向继续追问' },
        { src: '/threadchat-screenshot/SCR-20261026-omaj.png', caption: '用树状视图查看整场对话的脉络' },
        { src: '/threadchat-screenshot/SCR-20261026-ombh.png' },
        { src: '/threadchat-screenshot/SCR-20261026-omcj.jpeg' },
        { src: '/threadchat-screenshot/SCR-20261026-omdz.png' },
        { src: '/threadchat-screenshot/SCR-20261026-omgk.png' },
        { src: '/threadchat-screenshot/SCR-20261026-omgx.png' },
        { src: '/threadchat-screenshot/SCR-20261026-omhi.png' },
        { src: '/threadchat-screenshot/SCR-20261026-omht.png' },
        { src: '/threadchat-screenshot/SCR-20261026-ommw.png', caption: '在输入框中引用已有文档，继续讨论' },
        { src: '/threadchat-screenshot/SCR-20261026-omrw.png' },
        { src: '/threadchat-screenshot/SCR-20261026-omuv.png' },
        { src: '/threadchat-screenshot/SCR-20261026-onne.png' },
        { src: '/threadchat-screenshot/SCR-20261026-onqm.png', caption: '划选回复中的内容，带着问题开启新分支' },
        { src: '/threadchat-screenshot/SCR-20261026-onrz.png' },
        { src: '/threadchat-screenshot/SCR-20261026-oscu.png' },
        { src: '/threadchat-screenshot/SCR-20261026-oskk.png' },
        { src: '/threadchat-screenshot/SCR-20261026-otvc.png' },
        { src: '/threadchat-screenshot/SCR-20261026-oueo.png', caption: '可随意开启分支' },
      ],
    },
  },
  {
    slug: 'pi-cloud-agents',
    name: 'Pi-cloud-agents',
    kind: 'product',
    status: '已上线（白名单）',
    statusTone: 'live',
    form: 'Web 应用 · 开源',
    tagline: '对标 Cursor Cloud Agents 的自托管云端编码 Agent：在云端沙箱里改代码、跑测试、开 PR。',
    tags: ['Coding Agent', '沙箱', 'Durable Execution', '人工审批'],
    links: [
      { label: '线上', href: 'https://pi.zilin.im' },
      { label: 'GitHub', href: 'https://github.com/hifizz/pi-cloud-agents' },
    ],
    video: 'pi-cloud-agents.mp4',
    poster: 'pi-cloud-agents.jpg',
    detail: {
      problem:
        '让编码 Agent 脱离本地机器，在云端沙箱中自主完成改代码、跑测试、开 PR，用户在网页上观察过程并审批关键操作。',
      features: [
        'Bot 在云端沙箱里改代码、跑测试、开 PR',
        '网页端实时观察 Agent 执行过程',
        '危险操作的人工审批',
        '白名单登录与密钥隔离',
      ],
    },
  },
  {
    slug: 'chatkeep',
    name: 'chatkeep',
    kind: 'product',
    featured: true,
    status: '已上线',
    statusTone: 'live',
    form: '浏览器插件',
    tagline: '大模型网页聊天的 toolkit：自动保存聊天记录，几乎无损地转成 Markdown。',
    tags: ['Markdown', '知识管理'],
    links: [{ label: '官网', href: 'https://chatkeep.dev/' }],
    video: 'chatkeep.mp4',
    poster: 'chatkeep-dev.jpg',
    detail: {
      problem: '网页版大模型聊天的内容难以留存和复用，导出格式也常常失真。',
      features: [
        '自动化保存聊天记录',
        '几乎无损地保持所见内容格式为 Markdown',
        '高亮划选与笔记',
        'Claude 备份数据浏览',
      ],
    },
  },
  {
    slug: 'readsight',
    name: 'Readsight',
    kind: 'product',
    form: '浏览器插件',
    tagline: '英文精读阅读伙伴：查询、侧边聊天、沉浸式翻译。',
    tags: ['阅读', '翻译'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/readsight' }],
    poster: 'readsight.jpg',
    detail: {
      problem: '英文精读时，生词、长难句和语境解释需要频繁切换词典与翻译工具，打断阅读节奏。',
      features: [
        '划词查询：释义、音标、用法搭配，并标注 CET6 / TOEFL 等词频',
        '结合本句继续：词义、本句译法、用法一键切换',
        '侧边栏深聊：围绕当前页面与选中内容直接追问',
        '沉浸式翻译',
      ],
    },
  },
  {
    slug: 'relata',
    name: 'Relata',
    kind: 'oss',
    form: '浏览器插件',
    tagline: 'AI 收藏夹：自动整理目录与网页主要内容，支持一键深度翻译与 DeepResearch。',
    tags: ['收藏', 'DeepResearch'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/relata' }],
  },
  {
    slug: 'copy-as-markdown',
    name: 'CopyAsMarkdown',
    kind: 'oss',
    form: '浏览器插件',
    tagline: '选中任意网页内容，启发式复制为 Markdown，为 Agent 提供带格式的上下文。',
    tags: ['Markdown', 'Agent 上下文'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/copy-as-markdown' }],
  },
  {
    slug: 'tars',
    name: 'Tars',
    kind: 'product',
    form: 'Personal Agent · 开源',
    tagline: '基于 Pi Durable 的 Personal Agent，拥有自己的电脑；一个晚上搭好 Demo。',
    tags: ['Agent', 'Durable Execution'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/tars' }],
    video: 'tars.mp4',
    poster: 'tars.png',
    detail: {
      problem:
        '和 Grok Bots、Codex Dots 一样，让 Agent 拥有自己的电脑，成为长期在线的个人助理。',
      features: ['TODO: 补充主要功能'],
    },
  },
  {
    slug: 'sayit-service',
    name: 'SayIt-Service',
    kind: 'oss',
    form: '服务端',
    tagline: '对标 Typeless 的语音输入服务端，基于 Grok Voice API，约 $0.1/h。',
    tags: ['语音', '后端'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/sayit-service' }],
  },
  {
    slug: 'prose-atelier',
    name: 'prose-atelier',
    kind: 'oss',
    form: 'CSS 库',
    tagline: '解决 Markdown 中英文混排不好看的问题。',
    tags: ['排版', 'CSS'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/prose-atelier' }],
  },
  {
    slug: 'jev-readability',
    name: 'jev-readability',
    kind: 'oss',
    form: 'JS 库',
    tagline: '用 TypeSafe Jev 升级 Mozilla readability，提供 Jev 模型驱动的正文提取。',
    tags: ['正文提取'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/jev-readability' }],
  },
  {
    slug: 'playground',
    name: 'Playground',
    kind: 'lab',
    form: '实验场',
    tagline: '偏 UX 的 AI 交互实验场。',
    tags: ['UX', '实验'],
    links: [{ label: '站点', href: 'https://playground.zilin.im/' }],
  },
  {
    slug: 'skills',
    name: 'hifizz/skills',
    kind: 'skill',
    form: 'Skills 库',
    tagline: '个人常用的 Agent skills 库。',
    tags: ['Agent Skills'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/skills' }],
  },
  {
    slug: 'coolify-ops-skill',
    name: 'coolify-ops-skill',
    kind: 'skill',
    form: 'Skill',
    tagline: 'Coolify CLI 配套的 skill。',
    tags: ['Agent Skills', 'Coolify'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/coolify-ops-skill' }],
  },
  {
    slug: 'openship-skill',
    name: 'openship-skill',
    kind: 'skill',
    form: 'Skill',
    tagline: 'OpenShip 配套的 skill。',
    tags: ['Agent Skills', 'OpenShip'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/openship-skill' }],
  },
]

export type Article = { title: string; href?: string; date?: string }

export const articles: Article[] = [
  // TODO: 补链接与日期；数组为空时首页文章区自动隐藏
  // { title: '为什么要开发 ThreadChat？' },
]

export const profile = {
  name: 'zilin',
  role: 'AI Application Engineer',
  intro: '把 AI 做成真正可用的产品。独立设计、开发并上线 Agent、AI 交互与浏览器工具。',
  email: 'fizzstack@gmail.com',
  github: 'https://github.com/hifizz',
  blog: 'https://zilin.im',
}

const MEDIA_BASE = import.meta.env.VITE_MEDIA_BASE ?? '/videos/'

const resolve = (base: string, file?: string) =>
  !file ? undefined : /^https?:\/\//.test(file) || file.startsWith('/') ? file : base + file

export const videoUrl = (p: Project) => resolve(MEDIA_BASE, p.video)
export const posterUrl = (p: Project) => resolve('/posters/', p.poster)

/** 主链接：开源/实验项目点击直接外跳 */
export const primaryHref = (p: Project) => p.links[0]?.href
