import { Volume2 } from 'lucide-react'
import type { MouseEvent } from 'react'

import { useCanSpeak } from '@/hooks'
import { speak } from '@/lib'

interface SpeakButtonProps {
  text: string
  label: string
}

/** A speaker button that reads the text aloud. Hidden when the browser has no American voice. */
export function SpeakButton({ text, label }: SpeakButtonProps) {
  const canSpeak = useCanSpeak()
  if (!canSpeak) return null

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
    speak(text)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className="pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
    >
      <Volume2 className="size-6" aria-hidden />
    </button>
  )
}
