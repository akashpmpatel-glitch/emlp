/* Sound engine. Every sound is made in the browser with the Web Audio API,
   so there are no audio files to download and nothing to license.
   Output is capped and run through a limiter to keep volume comfortable. */
window.Sound = (function () {
  var ctx, master, noiseBuf;
  var CAP = 0.5;

  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      var limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -14;
      limiter.ratio.value = 12;
      master = ctx.createGain();
      master.gain.value = CAP;
      master.connect(limiter);
      limiter.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function noise() {
    if (!noiseBuf) {
      var c = ac(), len = c.sampleRate * 0.5;
      noiseBuf = c.createBuffer(1, len, c.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    return noiseBuf;
  }

  // One pitched voice: oscillators -> optional lowpass -> envelope -> master.
  function voice(o) {
    var c = ac(), t = o.t, g = c.createGain(), end;
    var peak = Math.max(0.0002, o.vel * (o.gain || 0.5));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + o.attack);
    if (o.pluck) {
      end = t + o.attack + o.pluck;
      g.gain.exponentialRampToValueAtTime(0.0001, end);
    } else {
      var hold = t + Math.max(o.dur, o.attack + 0.02);
      g.gain.setValueAtTime(peak, hold);
      end = hold + o.release;
      g.gain.exponentialRampToValueAtTime(0.0001, end);
    }
    var node = g;
    if (o.filter) {
      var f = c.createBiquadFilter();
      f.type = "lowpass";
      f.Q.value = o.filter.q || 1;
      f.frequency.setValueAtTime(o.filter.f0, t);
      if (o.filter.f1) f.frequency.exponentialRampToValueAtTime(o.filter.f1, t + (o.filter.time || 0.3));
      f.connect(g);
      node = f;
    }
    g.connect(master);
    (o.partials || [{ m: 1, g: 1 }]).forEach(function (p) {
      var osc = c.createOscillator(), pg = c.createGain();
      osc.type = p.type || o.type || "sine";
      osc.frequency.setValueAtTime(o.freq * p.m, t);
      pg.gain.value = p.g;
      if (o.vib) {
        var lfo = c.createOscillator(), lg = c.createGain();
        lfo.frequency.value = o.vib.rate;
        lg.gain.value = o.freq * p.m * o.vib.depth;
        lfo.connect(lg);
        lg.connect(osc.frequency);
        lfo.start(t + 0.08);
        lfo.stop(end + 0.05);
      }
      osc.connect(pg);
      pg.connect(node);
      osc.start(t);
      osc.stop(end + 0.05);
    });
  }

  // Filtered noise burst, for claps and shakers.
  function burst(t, vel, type, freq, dur, gain) {
    var c = ac(), src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = noise();
    f.type = type;
    f.frequency.value = freq;
    g.gain.setValueAtTime(Math.max(0.0002, vel * gain), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  // Sine that drops in pitch, for drums.
  function thump(t, vel, f0, f1, dur) {
    var c = ac(), osc = c.createOscillator(), g = c.createGain();
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(Math.max(0.0002, vel * 0.9), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  var INST = {
    piano: function (f, t, d, v) {
      voice({ freq: f, t: t, vel: v, attack: 0.008, pluck: 1.3, type: "triangle", gain: 0.55, partials: [{ m: 1, g: 1 }, { m: 2, g: 0.28, type: "sine" }, { m: 3, g: 0.08, type: "sine" }] });
    },
    xylophone: function (f, t, d, v) {
      voice({ freq: f * 2, t: t, vel: v, attack: 0.004, pluck: 0.5, gain: 0.5, partials: [{ m: 1, g: 1 }, { m: 3.9, g: 0.22 }] });
    },
    guitar: function (f, t, d, v) {
      voice({ freq: f / 2, t: t, vel: v, attack: 0.005, pluck: 1.1, type: "sawtooth", gain: 0.5, filter: { f0: 3200, f1: 500, time: 0.5 } });
    },
    violin: function (f, t, d, v) {
      voice({ freq: f, t: t, dur: d, vel: v, attack: 0.09, release: 0.18, type: "sawtooth", gain: 0.28, filter: { f0: 2400, q: 0.8 }, vib: { rate: 5.5, depth: 0.006 } });
    },
    flute: function (f, t, d, v) {
      voice({ freq: f * 2, t: t, dur: d, vel: v, attack: 0.06, release: 0.15, gain: 0.4, partials: [{ m: 1, g: 1 }, { m: 2, g: 0.12, type: "triangle" }], vib: { rate: 4.5, depth: 0.004 } });
      burst(t, v, "bandpass", f * 2, 0.07, 0.05);
    },
    trumpet: function (f, t, d, v) {
      voice({ freq: f, t: t, dur: d, vel: v, attack: 0.035, release: 0.12, type: "sawtooth", gain: 0.3, filter: { f0: 700, f1: 2600, time: 0.07, q: 2 } });
    },
    drum: function (f, t, d, v) { thump(t, v, 170, 55, 0.28); burst(t, v, "highpass", 2000, 0.03, 0.15); },
    clap: function (f, t, d, v) { [0, 0.012, 0.026].forEach(function (o) { burst(t + o, v, "bandpass", 1500, 0.09, 0.45); }); },
    block: function (f, t, d, v) { voice({ freq: 880, t: t, vel: v, attack: 0.002, pluck: 0.09, gain: 0.6, partials: [{ m: 1, g: 1 }, { m: 1.5, g: 0.5 }] }); },
    shaker: function (f, t, d, v) { burst(t, v, "highpass", 6000, 0.08, 0.5); },
    tick: function (f, t, d, v) { voice({ freq: 1320, t: t, vel: v, attack: 0.002, pluck: 0.05, gain: 0.3 }); }
  };

  // C major from middle C up to high F. Each pitch keeps one colour everywhere on the site.
  var NOTES = [
    { n: "C", f: 261.63, c: "#f2605b" }, { n: "D", f: 293.66, c: "#ff9e3d" },
    { n: "E", f: 329.63, c: "#ffd24a" }, { n: "F", f: 349.23, c: "#5ccb8b" },
    { n: "G", f: 392.0, c: "#3cc0cf" }, { n: "A", f: 440.0, c: "#6f9cf5" },
    { n: "B", f: 493.88, c: "#b58af8" }, { n: "C", f: 523.25, c: "#ff9fcb" },
    { n: "D", f: 587.33, c: "#ff9e3d" }, { n: "E", f: 659.25, c: "#ffd24a" },
    { n: "F", f: 698.46, c: "#5ccb8b" }
  ];

  /* play("piano", 440, { when: 0.5, dur: 0.4, vel: 0.8 })
     when = seconds from now, dur = seconds held, vel = loudness 0..1 */
  function play(name, freq, o) {
    o = o || {};
    var c = ac();
    (INST[name] || INST.piano)(freq || 440, c.currentTime + (o.when || 0) + 0.01, o.dur || 0.35, o.vel == null ? 0.8 : o.vel);
  }

  return { play: play, NOTES: NOTES, unlock: ac };
})();
