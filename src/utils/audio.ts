import { AmbientSoundId } from '../types';

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play metallic tap/clink sound when grabbing the pull tab
 */
export function playMetalClink() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.error('Audio clink error', e);
  }
}

/**
 * Play cartoon spring BOI-N-N-G sound effect
 */
export function playCartoonBoing() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Vibrato LFO for cartoon spring wobble
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(22, now); // 22Hz rapid comic wobble
    lfoGain.gain.setValueAtTime(45, now);
    lfoGain.gain.exponentialRampToValueAtTime(5, now + 0.35);

    osc.type = 'sine';
    // Pitch shoots up then wobbles like a comic spring
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.4);
    osc.stop(now + 0.4);
  } catch (e) {
    console.error('Boing error', e);
  }
}

/**
 * Play cartoon sparkle chime cascade
 */
export function playCartoonChime() {
  try {
    const ctx = getAudioContext();
    const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    });
  } catch (e) {
    console.error('Chime error', e);
  }
}

/**
 * Play the can opening pop & metal peel sound!
 */
export function playCanOpenPop() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Initial "POP" (Sudden pressure vacuum release)
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();

    popOsc.type = 'triangle';
    popOsc.frequency.setValueAtTime(180, now);
    popOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    popGain.gain.setValueAtTime(0.4, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);

    popOsc.start(now);
    popOsc.stop(now + 0.15);

    // 2. High pitch metallic "snip / crack"
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();

    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(2400, now);
    snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.09);

    snapGain.gain.setValueAtTime(0.25, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);

    snapOsc.start(now);
    snapOsc.stop(now + 0.09);

    // 3. Metal lid peeling tear noise (friction of lid rolling back)
    const bufferSize = ctx.sampleRate * 0.45;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now + 0.04);
    filter.frequency.exponentialRampToValueAtTime(650, now + 0.45);
    filter.Q.setValueAtTime(2.5, now + 0.04);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.3, now + 0.08);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.04);
    noise.stop(now + 0.45);
  } catch (e) {
    console.error('Audio can pop error', e);
  }
}

/**
 * Play authentic canning machine seaming & crimping sound
 */
export function playCanSealingSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Heavy metallic press down
    const clankOsc = ctx.createOscillator();
    const clankGain = ctx.createGain();
    clankOsc.type = 'triangle';
    clankOsc.frequency.setValueAtTime(320, now);
    clankOsc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

    clankGain.gain.setValueAtTime(0.35, now);
    clankGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    clankOsc.connect(clankGain);
    clankGain.connect(ctx.destination);
    clankOsc.start(now);
    clankOsc.stop(now + 0.22);

    // 2. Mechanical rotary crimping whirr (can seam rollers spinning around rim)
    const bufferSize = ctx.sampleRate * 0.55;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now + 0.1);
    filter.frequency.linearRampToValueAtTime(2400, now + 0.35);
    filter.frequency.linearRampToValueAtTime(800, now + 0.6);
    filter.Q.value = 3.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.22, now + 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now + 0.1);
    noiseSource.stop(now + 0.65);

    // 3. Pressure lock "click-snap"
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(1200, now + 0.5);
    snapOsc.frequency.exponentialRampToValueAtTime(300, now + 0.6);
    snapGain.gain.setValueAtTime(0.2, now + 0.5);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(now + 0.5);
    snapOsc.stop(now + 0.62);
  } catch (e) {
    console.error('Sealing sound error', e);
  }
}

/**
 * Play date ink-stamp impact thump
 */
export function playStampSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.error('Stamp sound error', e);
  }
}

// Global active ambient sound state
let activeAmbientStop: (() => void) | null = null;
let currentVoiceAudio: HTMLAudioElement | null = null;

/**
 * Play procedural ambient sound or voice recording
 */
export function playAmbientSound(soundId: AmbientSoundId, voiceDataUrl?: string, onEnded?: () => void): () => void {
  // Stop existing sounds
  stopAmbientSound();

  if (soundId === 'none') {
    return () => {};
  }

  // Handle custom audio / voice note
  if (voiceDataUrl) {
    try {
      const audio = new Audio(voiceDataUrl);
      currentVoiceAudio = audio;
      audio.play().catch(console.error);
      if (onEnded) {
        audio.onended = onEnded;
      }
      activeAmbientStop = () => {
        audio.pause();
        audio.currentTime = 0;
        currentVoiceAudio = null;
      };
      return activeAmbientStop;
    } catch (e) {
      console.error('Voice playback error', e);
      return () => {};
    }
  }

  try {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.2);
    masterGain.connect(ctx.destination);

    const nodesToStop: { stop: () => void; disconnect: () => void }[] = [];
    const timers: number[] = [];

    if (soundId === 'ocean_waves') {
      // Pink/Brown noise buffer with slow sinusoidal breathing volume
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.11;
        b2 = 0.86 * b2 + white * 0.25;
        data[i] = (b0 + b1 + b2) * 0.25;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 450;

      // Wave swell LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.18; // ~5.5s wave cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.2;

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.3;

      lfo.connect(lfoGain);
      lfoGain.connect(waveGain.gain);

      noise.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(masterGain);

      noise.start();
      lfo.start();

      nodesToStop.push(noise, lfo);
    } else if (soundId === 'gentle_rain') {
      // Gentle filtered rain noise + subtle droplets
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 950;
      filter.Q.value = 0.8;

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      nodesToStop.push(noise);

      // Raindrop pitter-patter interval
      const interval = window.setInterval(() => {
        if (!audioCtx) return;
        const dropOsc = audioCtx.createOscillator();
        const dropGain = audioCtx.createGain();
        const now = audioCtx.currentTime;
        dropOsc.frequency.setValueAtTime(1200 + Math.random() * 800, now);
        dropOsc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        dropGain.gain.setValueAtTime(0.04, now);
        dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        dropOsc.connect(dropGain);
        dropGain.connect(masterGain);
        dropOsc.start(now);
        dropOsc.stop(now + 0.04);
      }, 120);
      timers.push(interval);
    } else if (soundId === 'warm_vinyl') {
      // Vinyl crackle and warm subtle rumble
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // mostly quiet, occasional sharp pop
        const isPop = Math.random() < 0.003;
        data[i] = isPop ? (Math.random() * 2 - 1) * 0.7 : (Math.random() * 2 - 1) * 0.04;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1200;

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      nodesToStop.push(noise);
    } else if (soundId === 'music_box') {
      // Delicate nostalgic music box notes (Cmaj7 / G cadence)
      const notes = [523.25, 659.25, 783.99, 987.77, 783.99, 659.25, 587.33, 880];
      let noteIdx = 0;

      const playMusicBoxNote = () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        const now = audioCtx.currentTime;
        const freq = notes[noteIdx % notes.length];
        noteIdx++;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.18, now);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.95);
      };

      playMusicBoxNote();
      const interval = window.setInterval(playMusicBoxNote, 650);
      timers.push(interval);
    } else if (soundId === 'summer_crickets') {
      // Gentle crickets chirp
      const chirp = () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const cGain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(4600, now);
        osc.frequency.setValueAtTime(4900, now + 0.03);
        osc.frequency.setValueAtTime(4600, now + 0.06);

        cGain.gain.setValueAtTime(0.07, now);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(cGain);
        cGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.09);
      };

      const interval = window.setInterval(() => {
        if (Math.random() > 0.3) {
          chirp();
          setTimeout(chirp, 90);
          setTimeout(chirp, 180);
        }
      }, 700);
      timers.push(interval);
    } else if (soundId === 'cozy_cafe') {
      // Low warm room hum and occasional porcelain clink
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 320;

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      nodesToStop.push(noise);

      // Random quiet cup clink
      const interval = window.setInterval(() => {
        if (!audioCtx || Math.random() > 0.4) return;
        const cup = audioCtx.createOscillator();
        const cupG = audioCtx.createGain();
        const now = audioCtx.currentTime;
        cup.type = 'sine';
        cup.frequency.setValueAtTime(2200 + Math.random() * 400, now);
        cupG.gain.setValueAtTime(0.05, now);
        cupG.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        cup.connect(cupG);
        cupG.connect(masterGain);
        cup.start(now);
        cup.stop(now + 0.12);
      }, 1600);
      timers.push(interval);
    }

    activeAmbientStop = () => {
      timers.forEach(t => clearInterval(t));
      try {
        masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => {
          nodesToStop.forEach(n => {
            try { n.stop(); } catch { /* ignore */ }
            try { n.disconnect(); } catch { /* ignore */ }
          });
          masterGain.disconnect();
        }, 550);
      } catch {
        // ignore cleanup error
      }
      activeAmbientStop = null;
    };

    return activeAmbientStop;
  } catch (e) {
    console.error('Ambient audio error', e);
    return () => {};
  }
}

export function stopAmbientSound() {
  if (currentVoiceAudio) {
    currentVoiceAudio.pause();
    currentVoiceAudio.currentTime = 0;
    currentVoiceAudio = null;
  }
  if (activeAmbientStop) {
    activeAmbientStop();
    activeAmbientStop = null;
  }
}
