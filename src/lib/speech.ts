const AMERICAN = 'en-us'

function getSynth(): SpeechSynthesis | undefined {
  return 'speechSynthesis' in globalThis ? globalThis.speechSynthesis : undefined
}

/** Finds an American English voice, preferring one installed on the device so it works offline. */
function findAmericanVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | undefined {
  // Some Android builds report "en_US" instead of "en-US"
  const voices = synth
    .getVoices()
    .filter((v) => v.lang.replace('_', '-').toLowerCase() === AMERICAN)
  return voices.find((v) => v.localService) ?? voices[0]
}

/** True when the browser can speak and lists an American voice. Re-check after onVoicesChanged fires. */
export function canSpeak(): boolean {
  const synth = getSynth()
  return synth !== undefined && findAmericanVoice(synth) !== undefined
}

/** Reads the text aloud in an American voice, stopping anything already playing. Does nothing when canSpeak() is false. */
export function speak(text: string): void {
  const synth = getSynth()
  const voice = synth && findAmericanVoice(synth)
  if (!synth || !voice) return

  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.voice = voice
  synth.speak(utterance)
}

export function stopSpeaking(): void {
  getSynth()?.cancel()
}

/** Calls the listener when the browser's voice list changes, since voices often load after the page. Returns the unsubscribe. */
export function onVoicesChanged(listener: () => void): () => void {
  const synth = getSynth()
  if (!synth) return () => {}

  synth.addEventListener('voiceschanged', listener)
  return () => synth.removeEventListener('voiceschanged', listener)
}
