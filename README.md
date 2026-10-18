# portfolio.zilin.im

个人 AI 作品集。Vite + React + Tailwind v4 + shadcn/ui，纯静态 SPA。

```bash
pnpm install
pnpm dev      # 本地开发
pnpm build    # 产物在 dist/
```

## 内容

所有项目、文章、个人信息都在 `src/content/projects.ts`。

- `kind: 'product'`：首页卡片 + 二级页 `/projects/:slug`，有主介绍视频位。
- `kind: 'oss' | 'lab'`：首页列表行，点击直接跳 `links[0]`。

## 视频

1. 把视频放进 `public/videos/`，文件名与项目的 `video` 字段一致（如 `threadchat.mp4`）。
2. 可选封面图放 `public/posters/`（如 `threadchat.jpg`）。
3. 文件不存在时自动显示「介绍视频准备中」占位。
4. 换 CDN：设置环境变量 `VITE_MEDIA_BASE=https://cdn.xxx/videos/`，或把 `video` 字段直接写成完整 URL。

## 部署

- Vercel：`vercel.json` 已配 SPA rewrite。
- Cloudflare Pages：`public/_redirects` 已配 SPA fallback。构建命令 `pnpm build`，输出目录 `dist`。
