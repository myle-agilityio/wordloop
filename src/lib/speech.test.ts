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
  it('TC15: is false when the browser has no speech API', () => {
    vi.unstubAllGlobals()
    expect(canSpeak()).toBe(false)
  })

  it('TC16: is false when English voices are listed but no en-US one', () => {
    synth.getVoices.mockReturnValue([voice('en-GB'), voice('en-AU'), voice('vi-VN')])
    expect(canSpeak()).toBe(false)
  })

  it('QA1: is true with an en-US voice, however the browser writes it', () => {
    expect(canSpeak()).toBe(true)
    synth.getVoices.mockReturnValue([voice('en_US')])
    expect(canSpeak()).toBe(true)
  })

  it('TC17: turns true once voices load late', () => {
    synth.getVoices.mockReturnValue([])
    expect(canSpeak()).toBe(false)
    synth.getVoices.mockReturnValue([voice('en-US')])
    expect(canSpeak()).toBe(true)
  })
})

describe('speak', () => {
  it('QA1: reads the text in American English, preferring a local voice', () => {
    const local = voice('en-US')
    synth.getVoices.mockReturnValue([voice('en-GB'), voice('en-US', false), local])

    speak('apple')

    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance
    expect(utterance).toMatchObject({ text: 'apple', lang: 'en-US', voice: local })
  })

  it('TC06: stops the current speech before starting', () => {
    speak('apple')
    expect(synth.cancel.mock.invocationCallOrder[0]).toBeLessThan(
      synth.speak.mock.invocationCallOrder[0],
    )
  })

  it('TC16: does nothing when there is no American voice', () => {
    synth.getVoices.mockReturnValue([voice('en-GB')])
    speak('apple')
    expect(synth.speak).not.toHaveBeenCalled()
  })

  it('TC06: a second speaker cuts off the first', () => {
    speak('What time is it?')
    speak('I have no time.')

    const [, secondCancel] = synth.cancel.mock.invocationCallOrder
    const [firstSpeak, secondSpeak] = synth.speak.mock.invocationCallOrder
    expect(firstSpeak).toBeLessThan(secondCancel)
    expect(secondCancel).toBeLessThan(secondSpeak)
    expect((synth.speak.mock.calls[1][0] as FakeUtterance).text).toBe('I have no time.')
  })

  it('TC07: tapping quickly restarts the speech instead of queueing it', () => {
    speak('time')
    speak('time')
    speak('time')

    // Each speak() clears the queue first, so at most one utterance is ever waiting
    const order = [
      ...synth.cancel.mock.invocationCallOrder.map((n) => [n, 'cancel'] as const),
      ...synth.speak.mock.invocationCallOrder.map((n) => [n, 'speak'] as const),
    ]
      .sort(([a], [b]) => a - b)
      .map(([, call]) => call)
    expect(order).toEqual(['cancel', 'speak', 'cancel', 'speak', 'cancel', 'speak'])
  })

  it('TC15: does nothing without the speech API', () => {
    vi.unstubAllGlobals()
    expect(() => speak('apple')).not.toThrow()
    expect(synth.speak).not.toHaveBeenCalled()
  })
})

describe('stopSpeaking', () => {
  it('cancels the current speech', () => {
    stopSpeaking()
    expect(synth.cancel).toHaveBeenCalledOnce()
  })

  it('TC15: is safe without the speech API', () => {
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

  it('TC17: tells the listener when an en-US voice arrives after load', () => {
    synth.getVoices.mockReturnValue([])
    const seen: boolean[] = []
    onVoicesChanged(() => seen.push(canSpeak()))
    expect(canSpeak()).toBe(false)

    // The browser finishes loading its voices and fires voiceschanged
    synth.getVoices.mockReturnValue([voice('en-US')])
    const [, fire] = synth.addEventListener.mock.calls[0] as [string, () => void]
    fire()

    expect(seen).toEqual([true])
  })

  it('TC15: is a no-op without the speech API', () => {
    vi.unstubAllGlobals()
    const unsubscribe = onVoicesChanged(vi.fn())
    expect(() => unsubscribe()).not.toThrow()
    expect(synth.addEventListener).not.toHaveBeenCalled()
  })
})
