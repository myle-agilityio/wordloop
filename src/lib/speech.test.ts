import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { canSpeak, onVoicesChanged, speak, stopSpeaking } from './speech'

class FakeUtterance {
  lang = ''
  voice: SpeechSynthesisVoice | null = null
  text: string
  constructor(text: string) {
    this.text = text
  }
}

function voice(lang: string, localService = true): SpeechSynthesisVoice {
  return {
    lang,
    localService,
    name: `${lang} ${localService ? 'local' : 'remote'}`,
  } as SpeechSynthesisVoice
}

const synth = {
  getVoices: vi.fn<() => SpeechSynthesisVoice[]>(),
  speak: vi.fn(),
  cancel: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

beforeEach(() => {
  vi.resetAllMocks()
  synth.getVoices.mockReturnValue([voice('en-US')])
  vi.stubGlobal('speechSynthesis', synth)
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('canSpeak', () => {
  it('is false when the browser has no speech API', () => {
    vi.unstubAllGlobals()
    expect(canSpeak()).toBe(false)
  })

  it('is false when no American voice is listed', () => {
    synth.getVoices.mockReturnValue([voice('en-GB'), voice('vi-VN')])
    expect(canSpeak()).toBe(false)
  })

  it('is true with an en-US voice, however the browser writes it', () => {
    expect(canSpeak()).toBe(true)
    synth.getVoices.mockReturnValue([voice('en_US')])
    expect(canSpeak()).toBe(true)
  })

  it('turns true once voices load late', () => {
    synth.getVoices.mockReturnValue([])
    expect(canSpeak()).toBe(false)
    synth.getVoices.mockReturnValue([voice('en-US')])
    expect(canSpeak()).toBe(true)
  })
})

describe('speak', () => {
  it('reads the text in American English, preferring a local voice', () => {
    const local = voice('en-US')
    synth.getVoices.mockReturnValue([voice('en-GB'), voice('en-US', false), local])

    speak('apple')

    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance
    expect(utterance).toMatchObject({ text: 'apple', lang: 'en-US', voice: local })
  })

  it('stops the current speech before starting', () => {
    speak('apple')
    expect(synth.cancel.mock.invocationCallOrder[0]).toBeLessThan(
      synth.speak.mock.invocationCallOrder[0],
    )
  })

  it('does nothing when there is no American voice', () => {
    synth.getVoices.mockReturnValue([voice('en-GB')])
    speak('apple')
    expect(synth.speak).not.toHaveBeenCalled()
  })
})

describe('stopSpeaking', () => {
  it('cancels the current speech', () => {
    stopSpeaking()
    expect(synth.cancel).toHaveBeenCalledOnce()
  })

  it('is safe without the speech API', () => {
    vi.unstubAllGlobals()
    expect(() => stopSpeaking()).not.toThrow()
  })
})

describe('onVoicesChanged', () => {
  it('listens for voice changes until unsubscribed', () => {
    const listener = vi.fn()
    const unsubscribe = onVoicesChanged(listener)
    expect(synth.addEventListener).toHaveBeenCalledWith('voiceschanged', listener)

    unsubscribe()
    expect(synth.removeEventListener).toHaveBeenCalledWith('voiceschanged', listener)
  })
})
