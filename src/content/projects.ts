// 作品集与公开简历的唯一内容源；不要放敏感信息或编造经历。

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
    challenges?: { title: string; description: string }[]
    /** 仅展示有代码或验证记录支撑的工程实践与技术栈 */
    engineering?: { title: string; description: string }[]
    stack?: string[]
    note?: string
    /** 按展示顺序排列；caption 留空时不显示说明 */
    screenshots?: ProjectScreenshot[]
    /** 适合谁（可选，没写就不显示） */
    audience?: string
  }
}

const THREADCHAT_SCREENSHOT_BASE = 'https://chatkeep.zilin.im/portfolio/threadchat-screenshot/3ca15b95dc72/'

export const projects: Project[] = [
  {
    slug: 'threadchat',
    name: 'ThreadChat',
    kind: 'product',
    featured: true,
    status: '已上线（Beta 内测中）',
    statusTone: 'live',
    form: 'Web 应用',
    tagline: 'ThreadChat 是一个让你可以从 AI 回复的任意一个位置，划选文本进行提问的 Agent 产品。可以一直发散提问（自动继承上下文），不限制层数，直到你没有任何疑问为止。',
    tags: ['Context Engineering', 'Context Compaction', 'Memory', 'Deep Research', 'GitHub App', 'Tool Calling', 'RAG', 'SSE', 'Evaluation'],
    links: [
      { label: '官网', href: 'https://thread.zilin.im/' },
      // TODO: 文章《为什么要开发 ThreadChat？》上线后补链接，并恢复下方 articles 条目
    ],
    video: 'threadchat.mp4',
    poster: 'thread-chat.jpg',
    detail: {
      problem:
        'ThreadChat 是一个面向调研、方案分析与写作的分支式 AI 工作区。在线性聊天中，追问细节容易打断主线，不同方向的讨论也难以比较。通过从回复选区开启分支、保留分叉点上下文，让不同方向的讨论独立展开。',
      features: [
        '用户可以从 AI 回复的任意一个位置划选文本进行提问、开启子分支',
        '划选开分支不限层数，可无限层嵌套，符合人脑工程学；想到哪里问哪里',
        '分支（Thread）是一等公民，分支是项目的根本定位，它让用户可以聚焦于一个小主题',
        '从回答中的选区开启新分支，沿不同方向继续探索',
        '多列并排阅读，结合树状视图定位讨论之间的关系',
        '在 Project 中组织文档、附件和讨论，生成并更新 Markdown 文档',
        '在任意分支中可以@整个项目中的任意文档，获得其他分支的结论作为上下文来继续讨论。',
      ],
      challenges: [
        {
          title: '让非线性对话仍然易于操作，并保持流畅',
          description: '难点不是单纯“把聊天画成树”，而是允许任意回复片段继续分叉后，用户仍然知道自己在哪里、分支从哪里来，以及如何找到之前的内容。多列阅读、面包屑、地图和快速跳转需要形成一致的导航逻辑；地图负责全局定位，阅读区域负责局部探索。同时，模型持续输出时，其他分支的划选、滚动和阅读不能被拖慢，因此还要处理流式渲染、状态更新与性能之间的相互影响。',
        },
        {
          title: '让分支独立探索，让成果可靠复用',
          description: '父线程后来被编辑，已经创建的分支应该继承哪个历史？文档更新后，旧引用应该保持原文还是追随最新版？两个 Thread 同时修改同一份文档，又该如何避免相互覆盖？Project、Document、固定版本的 Artifact，以及 @artifact 引用，是对这些问题的共同回答：让讨论可以发散，让成果可以汇总和持续更新，同时保留明确的上下文、版本与来源。',
        },
        {
          title: '在多模型条件下，同时做好回答质量与成本控制',
          description: '接入同一个模型，不代表就能获得与成熟聊天产品相同的效果。真正的难点在于应用如何组织上下文、选择和执行工具、获取充分证据，并把资料转化为有效回答。搜索与深读的协作、结构化研究计划、失败恢复、结果治理，以及上下文压缩和送模内容预算，需要共同服务于回答质量。目标是在相同基础模型下提供接近 ChatGPT 的体验，以合理成本取得足够信息，给出有依据、切中问题的回答。',
        },
        {
          title: '让 AI 的执行过程可信、可控，而不只是“看起来完成了”',
          description: '功能从生成回答扩展到更新文档、提交文件和操作 GitHub 后，模型输出成功，并不等于实际操作成功。浏览器断开不等于用户停止，工具受理不等于远端执行完成，超时也不等于操作没有发生。难点是把这些状态区分清楚：哪些需要用户确认，执行的是哪个目标和版本，哪些结果已经持久化，以及遇到不确定状态时如何核实，而不是盲目重试。',
        },
      ],
      engineering: [
        {
          title: 'Project 与文档产物模型',
          description: '新聊天默认就是一个 Project，统一组织目标、指令、原始资料、Threads 与文档产物。Document 维护稳定身份和当前版本，Artifact / Revision 保存不可变正文及来源；多个 Thread 可共同更新文档，提交前校验已读版本，历史引用与分叉不随新版改写，让探索过程与可持续更新的成果分开管理。',
        },
        {
          title: '分支上下文与数据一致性',
          description: '分叉时冻结继承的消息集合，由服务端编译分支历史、文档引用和附件上下文（Context Engineering）。通过归属校验、数据库事务与幂等命令，保持分支创建和消息写入的一致性。',
        },
        {
          title: '上下文压缩与摘要复用',
          description: '根据模型窗口与请求预算触发增量结构化摘要（Context Compaction），保留原始消息和必要近期原文。共同历史摘要仅在覆盖范围、提示词版本和引用校验通过时跨分支复用，私有内容保持隔离；压缩后重编译文档与附件上下文，并处理取消、有限重试和超限后的强制压缩重试。',
        },
        {
          title: '显式长期记忆（Memory）',
          description: '区分 Project 记忆、跨项目个人记忆与用户手写的“关于我”，支持显式记住、更正和忘记。每次生成冻结记忆快照，在预算内带入，超出部分通过 searchMemory 按需查找；写入来源与回执可追溯，支持版本校验撤销、个人记忆开关和敏感内容拦截，不把对话压缩等同于长期记忆。',
        },
        {
          title: '联网工具封装与深度研究',
          description: '将 Web Search 与 Web Fetch 封装为统一的 webSearch / readUrl 工具，屏蔽供应商接口与响应差异。明确的搜索、读链接请求按规则启动，普通问题由主模型按需联网；Deep Research 先生成结构化子问题、检索词和来源要求，再多轮检索、按需深读与综合带来源回答。',
        },
        {
          title: '分层恢复与网页服务主备',
          description: '将恢复分为工具策略层与服务层：读取失败后仍可搜索替代来源或调整查询，同一 URL 的正文抽取按配置使用 AnySearch → Exa 主备。统一成功、失败与下一步动作契约，合并在途请求、缓存已失败请求；整轮共享尝试次数、时限和并发预算，并贯穿取消信号，避免因读取失败而失去补搜能力，限制重复调用。',
        },
        {
          title: 'Token 与检索结果优化',
          description: '搜索先返回轻量摘要，正文按需深读；网页通过生成内快照和游标续读，控制单次及整轮送模体积，减少无关内容与重复抓取。按完整序列化结果计量内容预算，包含标题、URL 和元数据开销；识别工具级错误与无效正文，标记部分读取、聚合有效来源，并通过提示词约束引用与重复总结，兼顾上下文成本和证据完整性。',
        },
        {
          title: 'GitHub 连接与受控操作',
          description: '通过 GitHub App 连接用户仓库，按安装权限、用户可见范围与操作类型逐次鉴权。代码上下文固定到 commit，区分代码快照与实时 Issue / PR / Actions；写入先冻结目标与参数、展示预览，再经用户确认执行（Human-in-the-loop）。通过持久化状态机与逐步收据记录结果，超时先核实远端事实，不盲目重发写请求。',
        },
        {
          title: '模型与工具编排',
          description: '基于 Vercel AI SDK 接入 OpenAI-compatible 与 Anthropic 协议，实现业务工具调用（Tool Calling）、结构化输出（Structured Output）、多步调用限制、工具选择策略及取消信号传播。',
        },
        {
          title: '附件检索',
          description: '为 PDF 附件实现分块、Embedding 与 pgvector 检索，将相关片段及页码引用注入模型上下文（RAG）；向量服务未配置或检索失败时，降级为按预算截断。',
        },
        {
          title: '流式状态与持久化',
          description: '通过 SSE、生成快照和 checkpoint 管理流式消息与重新订阅，将浏览器连接与服务端生成生命周期分离。刷新或切换分支后恢复消息状态，显式停止则取消生成。',
        },
        {
          title: '可观测与评测',
          description: '接入 Langfuse 与 OpenTelemetry，关联模型调用、工具执行和应用操作；建立离线确定性回归、可选 LLM-as-a-Judge 模型评测与基线比较流程。',
        },
      ],
      stack: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Vercel AI SDK', 'PostgreSQL', 'Drizzle ORM', 'pgvector', 'Langfuse', 'OpenTelemetry'],
      screenshots: [
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-olyb.webp`, caption: '多列并排展示分支，沿不同方向继续追问' },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omaj.webp`, caption: '用树状视图查看整场对话的脉络' },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-ombh.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omcj.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omdz.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omgk.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omgx.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omhi.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omht.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-ommw.webp`, caption: '在输入框中引用已有文档，继续讨论' },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omrw.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-omuv.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-onne.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-onqm.webp`, caption: '划选回复中的内容，带着问题开启新分支' },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-onrz.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-oscu.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-oskk.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-otvc.webp` },
        { src: `${THREADCHAT_SCREENSHOT_BASE}SCR-20261026-oueo.webp`, caption: '可随意开启分支' },
      ],
    },
  },
  {
    slug: 'pi-cloud-agents',
    name: 'Pi-cloud-agents',
    kind: 'product',
    featured: true,
    status: '已上线（白名单）',
    statusTone: 'live',
    form: 'Web 应用 · 开源',
    tagline: '自托管云端编码 Agent：在浏览器布置任务，让 Agent 在远程 Linux 沙箱中修改代码、运行测试并交付 PR。',
    tags: ['Coding Agent', '沙箱', 'Durable Execution', '人工审批'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/pi-cloud-agents' }],
    video: 'pi-cloud-agents.mp4',
    poster: 'pi-cloud-agents.jpg',
    detail: {
      problem:
        'Pi-cloud-agents 是一个自托管的云端编码 Agent 工作台。用户在浏览器中布置任务，Agent 在远程 Linux 沙箱中读取仓库、修改代码、运行测试并创建 PR。用户可以实时观察执行过程、调整任务方向，并审批高风险操作。',
      features: [
        '在云端沙箱执行 Shell 和文件操作，完成 Git / PR 工作流',
        '实时展示消息、工具结果和文件差异，支持纠偏、排队与中止',
        '从历史消息分叉会话，接入上下文压缩和完整历史搜索',
        '通过定时例程持续执行指定任务',
      ],
      engineering: [
        {
          title: '可插拔执行环境',
          description: '实现 Pi Durable 的 ExecutionEnv 适配层，以统一的 Shell 与文件系统接口接入 Fly.io Sprites 和 E2B，处理二进制传输、大文件分块、路径转义、退出码与超时差异。',
        },
        {
          title: '恢复与副作用边界',
          description: '基于 Pi Durable 接入持久化执行（Durable Execution）和重启恢复。区分命令尚未启动、结果明确和结果不明等状态，并通过故障注入验证中断任务、审批恢复及 Git / PR 状态核实流程。',
        },
        {
          title: '人在回路',
          description: '使用工具执行前置钩子识别高风险操作（Human-in-the-loop），保存审批结论，支持拒绝、取消及重启后的未决审批恢复。',
        },
        {
          title: '实时工作台与访问控制',
          description: '使用 WebSocket 快照、事件更新和指数退避重连维护页面状态；实现白名单登录、Session、OAuth 与 API / WebSocket 鉴权。',
        },
      ],
      stack: ['Node.js', 'JavaScript ESM', 'React', 'TypeScript', 'Pi Durable', 'SQLite', 'WebSocket', 'Fly.io Sprites', 'E2B', 'Docker'],
      note: '面向个人自托管使用；当前采用单写进程与共享沙箱。',
    },
  },
  {
    slug: 'chatkeep',
    name: 'chatkeep',
    kind: 'product',
    status: '已上线',
    statusTone: 'live',
    form: '浏览器插件',
    tagline: '保存并复用大模型网页对话：自动导出 Markdown，支持高亮、笔记和 Claude 备份记录浏览。',
    tags: ['Markdown', '知识管理'],
    links: [{ label: '官网', href: 'https://chatkeep.dev/' }],
    video: 'chatkeep.mp4',
    poster: 'chatkeep-dev.jpg',
    detail: {
      problem: '网页版大模型聊天的内容难以留存和复用，导出格式也常常失真。',
      features: [
        '自动化保存聊天记录',
        '将聊天内容转换为 Markdown，尽量保留原有结构与格式',
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
    tagline: '英文精读浏览器插件：将划词解释、上下文追问与沉浸式翻译整合到阅读过程。',
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
    status: '本地自托管实验',
    form: 'Personal Agent · 实验',
    tagline: '拥有 Linux 桌面的个人 Agent 实验：通过截图与无障碍树操作应用，用户可以观察、接管并审批高风险动作。',
    tags: ['Computer Use', 'GUI Agent', 'Cua', 'Accessibility Tree', 'Benchmark'],
    links: [{ label: 'GitHub', href: 'https://github.com/hifizz/tars' }],
    video: 'tars.mp4',
    poster: 'tars.png',
    detail: {
      problem:
        'Tars 是一个拥有 Linux 桌面的常驻个人 Agent 实验项目。它可以打开应用、读取页面、填写表单和操作文件。用户通过网页观察它的桌面，在需要登录或纠偏时接管，并对高风险动作进行审批。',
      features: [
        '结合桌面截图与无障碍树观察应用状态',
        '使用元素标识或坐标完成点击、输入、按键和滚动',
        '共享桌面与浏览器状态，支持用户观察和接管',
        '基于 Pi Durable 接入持久化会话、审批、分叉和定时例程',
      ],
      engineering: [
        {
          title: 'Computer Use 工具适配',
          description: '基于 Cua 封装八个桌面工具，处理截图与文本结果、无障碍树（Accessibility Tree）、元素标识、坐标转换和 token 失效提示；区分只读观察与有副作用操作的重放语义。',
        },
        {
          title: '桌面集成与连接恢复',
          description: '实现 Viewer 的 HTTP / WebSocket 代理、桌面嵌入与连接管理，配置容器持久化目录，并处理连接失效后的有界重连。',
        },
        {
          title: '受控任务评测',
          description: '构建三个难度层级的 GUI 任务集，仓库记录了三个模型、两种工具输入模式的 66 次运行，对比任务成功情况、耗时、工具调用与估算成本，并通过服务端状态验证部分任务结果。结果来自自建测试环境和小样本任务，不代表任意真实网站的成功率。',
        },
      ],
      stack: ['Node.js', 'React', 'TypeScript', 'Pi Durable', 'Cua', 'Docker', 'SQLite', 'WebSocket', 'Node Test Runner', 'Vitest'],
      note: '多个 Bot 共享一台桌面；当前默认本机运行，不作为公开云服务提供。',
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
  role: 'AI Product Engineer',
  intro: '独立设计和开发 AI 产品，下一份工作想成为一个产品工程师。AI 时代每个人都可以构建自己的产品。之前在飞书与米哈游参与 IM 客户端、SDK、Messager、日历和复杂协作产品开发。',
  email: 'fizzstack@gmail.com',
  github: 'https://github.com/hifizz',
  blog: 'https://zilin.im',
}

export const publicResume = {
  cta: '我正在找工作，点击查看公开简历',
  title: '公开简历',
  summary: '具有复杂客户端、SDK 与协作产品开发经验，现独立设计和开发 AI 应用。实践方向包括分支对话与上下文组织、附件检索、工具调用、云端 Agent 执行和 Computer Use。',
  subscriptions: [
    { name: 'Grok BOT', icon: '/icons/ai/grokbot.svg', href: 'https://x.ai/bot', muted: false },
    { name: 'Codex', icon: '/icons/ai/codex-color.svg', href: 'https://openai.com/codex/', muted: false },
    { name: 'Devin', icon: '/icons/ai/devin-color.svg', href: 'https://devin.ai/', muted: false },
    { name: 'CommandCode GOAT', icon: '/icons/ai/commandcode.svg', href: 'https://commandcode.ai/', muted: false },
    // Ark 使用火山引擎标识，GLM 使用智谱标识。
    { name: 'Ark', icon: '/icons/ai/volcengine-color.svg', href: 'https://www.volcengine.com/product/ark', muted: false },
    { name: 'GLM', icon: '/icons/ai/zhipu-color.svg', href: 'https://bigmodel.cn/', muted: false },
    { name: 'Kimi', icon: '/icons/ai/kimi-color.svg', href: 'https://www.kimi.com/', muted: false },
    { name: 'Kiro', icon: '/icons/ai/kiro-color.svg', href: 'https://kiro.dev/', muted: false },
    { name: 'Claude Code', icon: '/icons/ai/claudecode-color.svg', href: 'https://code.claude.com/', muted: true },
    { name: 'Cursor', icon: '/icons/ai/cursor.svg', href: 'https://cursor.com/', muted: true },
  ],
  inactiveSubscriptionHint: '不再订阅了',
  githubActivity: {
    image: 'https://ghchart.rshah.org/1a7f37/hifizz',
    href: `${profile.github}?tab=overview`,
    note: '最近一年 · ghchart',
  },
  designWork: [
    {
      title: '动效设计',
      description: '交互与动效演示',
      href: 'https://effect-preview.vercel.app/',
    },
    {
      title: 'chatkeep 产品首页',
      description: '独立产品的网站设计',
      href: 'https://chatkeep.dev/?ref=portfolio.zilin.im',
    },
  ],
  experience: [
    {
      company: '字节跳动 · 飞书',
      summary: '负责飞书客户端 AI 功能开发，参与 SDK、跨端能力与前端基础设施建设。',
    },
    {
      company: '米哈游',
      summary: '负责内部 IM 客户端相关开发，主导协作日历产品开发与开发者工具建设。',
    },
  ],
}

const MEDIA_BASE = import.meta.env.VITE_MEDIA_BASE ?? '/videos/'

const resolve = (base: string, file?: string) =>
  !file ? undefined : /^https?:\/\//.test(file) || file.startsWith('/') ? file : base + file

export const videoUrl = (p: Project) => resolve(MEDIA_BASE, p.video)
export const posterUrl = (p: Project) => resolve('/posters/', p.poster)

/** 主链接：开源/实验项目点击直接外跳 */
export const primaryHref = (p: Project) => p.links[0]?.href
