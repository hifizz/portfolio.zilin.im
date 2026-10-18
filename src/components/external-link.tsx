import type { ComponentProps } from 'react'

const REF = 'portfolio.zilin.im'

/** 自有站点追加 ?ref=，便于统计作品集带来的流量；GitHub 不读参数，靠 Referer 统计，原样返回。 */
function withRef(href: string) {
  try {
    const url = new URL(href)
    if (url.hostname === 'github.com' || url.searchParams.has('ref')) return href
    url.searchParams.set('ref', REF)
    return url.toString()
  } catch {
    return href
  }
}

/** 新标签打开的外链。用 noopener 而非 noreferrer：保留 Referer，让 GitHub Traffic 等能看到来源。 */
export function ExternalLink({ href, ...props }: ComponentProps<'a'> & { href: string }) {
  return <a href={withRef(href)} target="_blank" rel="noopener" {...props} />
}
