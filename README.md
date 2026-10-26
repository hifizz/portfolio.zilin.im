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

## ThreadChat 截图

- 本地 WebP 源文件保留在 `public/threadchat-screenshot/`，页面使用 `src/content/projects.ts` 中的 R2 公开地址。
- R2 存储桶为 `zilin-public`，公开域名为 `chatkeep.zilin.im`；截图放在独立的 `portfolio/threadchat-screenshot/<内容版本>/` 路径下。
- 对象设置 `Content-Type: image/webp` 和 `Cache-Control: public, max-age=31536000, immutable`。更新图片时必须换内容版本，不能覆盖旧版本。
- 轮播只预加载下一张截图。运行 `node scripts/check-screenshots.mjs --cdn` 可验证所有 CDN 图片与本地文件一致（需要 curl）。
- 当前域名的 `CF-Cache-Status` 为 `DYNAMIC`。如需边缘缓存，在 Cloudflare 为该域名的 `/portfolio/threadchat-screenshot/` 路径添加 Cache Rule：Eligible for cache，并遵循源站 Cache-Control；不影响其他路径。
- R2 凭据仅用于本地上传，不放入前端环境变量或 Git。

## 部署

- Vercel：`vercel.json` 已配 SPA rewrite。
- Cloudflare Pages：`public/_redirects` 已配 SPA fallback。构建命令 `pnpm build`，输出目录 `dist`。
