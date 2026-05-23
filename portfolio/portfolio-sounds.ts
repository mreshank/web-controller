let ctx: AudioContext | null = null;
let lastFoot = 0;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function resumePortfolioAudio() {
  void ac().resume();
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "square",
  gain = 0.08,
  when = 0
) {
  const c = ac();
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noiseBurst(dur: number, gain = 0.06) {
  const c = ac();
  const bufferSize = c.sampleRate * dur;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const g = c.createGain();
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = 320;
  g.gain.value = gain;
  src.connect(filt);
  filt.connect(g);
  g.connect(c.destination);
  src.start();
}

export function playFootstep() {
  resumePortfolioAudio();
  const now = performance.now();
  if (now - lastFoot < 320) return;
  lastFoot = now;
  noiseBurst(0.06, 0.05);
  tone(90 + Math.random() * 30, 0.04, "triangle", 0.04);
}

export function playLanternOpen() {
  resumePortfolioAudio();
  tone(523, 0.08, "square", 0.06, 0);
  tone(659, 0.08, "square", 0.05, 0.07);
  tone(784, 0.12, "square", 0.05, 0.14);
}

export function playLanternClose() {
  resumePortfolioAudio();
  tone(392, 0.1, "square", 0.05, 0);
  tone(330, 0.12, "square", 0.04, 0.08);
}

export function playUiClick() {
  resumePortfolioAudio();
  tone(880, 0.04, "square", 0.04);
}
