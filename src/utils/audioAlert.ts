/**
 * Web Audio API synthesizer for luxury alerts and low-stock warnings.
 * Zero external audio file dependency; works reliably in all browsers.
 */
export function playAlertChime(type: 'warning' | 'critical' | 'success' = 'warning') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'critical' || type === 'warning') {
      // Distinctive, elegant dual-chime warning
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(784, now); // G5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.setValueAtTime(880, now + 0.25); // A5

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      osc.start(now);
      osc.stop(now + 0.7);
    } else {
      // Subtle confirmation chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (err) {
    console.warn('Audio alert sound prevented by browser policy:', err);
  }
}
