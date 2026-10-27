import type { ReactElement } from 'react'
import { Slot } from 'radix-ui'

/** 只共享卡片微动效，不增加 DOM 层级，也不改变链接和卡片的语义。 */
export function InteractiveCard({ children }: { children: ReactElement }) {
  return (
    <Slot.Root
      className="interactive-card"
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return
        const rect = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty('--card-x', `${event.clientX - rect.left}px`)
        event.currentTarget.style.setProperty('--card-y', `${event.clientY - rect.top}px`)
      }}
    >
      {children}
    </Slot.Root>
  )
}
