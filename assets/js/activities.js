/* The eight play activities. None of them score, time, rank or record anything. */
(function () {
  const page = document.body.dataset.page;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const N = Sound.NOTES;
  const motionOK = () => document.documentElement.dataset.motion !== "off";
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  function say(msg) {
    const el = $("#say");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  // A row of chips where one is pressed at a time.
  function choose(sel, fn) {
    const box = $(sel);
    if (!box) return;
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-v]");
      if (!b) return;
      $$("button[data-v]", box).forEach((x) => x.setAttribute("aria-pressed", x === b));
      fn(b.dataset.v);
    });
  }
  function press(sel, v) {
    $$(sel + " button[data-v]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.v === String(v)));
  }

  function fit(canvas) {
    const r = canvas.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    canvas.width = Math.round(r.width * d);
    canvas.height = Math.round(r.height * d);
    const g = canvas.getContext("2d");
    g.setTransform(d, 0, 0, d, 0, 0);
    return { g, w: r.width, h: r.height };
  }

  const init = {};

  /* ---------- Feel the Beat ---------- */
  init.beat = function () {
    const pad = $("#pad"), bouncer = $("#bouncer"), canvas = $("#lines");
    let bpm = 90, sound = "drum", hear = true, running = false, timer, marks = [], taps = 0, dims = fit(canvas);
    bouncer.innerHTML = Art.note("#b58af8");

    function draw() {
      const { g, w, h } = dims, now = performance.now();
      g.clearRect(0, 0, w, h);
      marks = marks.filter((m) => now - m.t < 6500);
      marks.forEach((m) => {
        const x = w - ((now - m.t) / 6000) * w;
        if (m.beat) {
          g.strokeStyle = "#b9c2e0"; g.lineWidth = 4; g.lineCap = "round";
          g.beginPath(); g.moveTo(x, 14); g.lineTo(x, h - 14); g.stroke();
        } else {
          g.fillStyle = "#ff7a66"; g.strokeStyle = "#17265c"; g.lineWidth = 3;
          g.beginPath(); g.arc(x, h / 2, 6 + m.vel * 16, 0, 7); g.fill(); g.stroke();
        }
      });
    }
    (function loop() { if (motionOK()) draw(); requestAnimationFrame(loop); })();

    function tick() {
      if (!running) return;
      const beat = 60000 / bpm;
      if (hear) Sound.play("tick", 0, { vel: 0.6 });
      marks.push({ t: performance.now(), beat: true });
      if (motionOK()) {
        pad.animate([{ transform: "scale(1.07)" }, { transform: "scale(1)" }], { duration: beat * 0.8, easing: "ease-out" });
        bouncer.animate([{ transform: "translateY(0)" }, { transform: "translateY(-30px)" }, { transform: "translateY(0)" }], { duration: beat, easing: "ease-in-out" });
      } else draw();
      timer = setTimeout(tick, beat);
    }
    function start() {
      if (running) return;
      Sound.unlock();
      running = true;
      tick();
      say("The beat is going. Tap along!");
    }
    function pause() { running = false; clearTimeout(timer); }
    function tap(vel) {
      Sound.play(sound, 0, { vel });
      marks.push({ t: performance.now(), vel });
      taps++;
      if (!motionOK()) draw();
      if (taps === 1) say("You made a sound!");
      else if (taps % 5 === 0) say(pick(["You made a rhythm!", "Try a different speed.", "What happens if you tap softly?", "Nice listening!", "Try a new drum sound."]));
    }

    pad.addEventListener("pointerdown", (e) => {
      const r = pad.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) / (r.width / 2);
      tap(Math.max(0.2, 1 - d * 0.85));
    });
    pad.addEventListener("keydown", (e) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); tap(0.8); }
    });

    choose("#speeds", (v) => { bpm = +v; say("New speed! Can you feel the beat?"); });
    choose("#sounds", (v) => { sound = v; Sound.play(v); say("You discovered a new sound!"); });
    $("#hear").addEventListener("click", (e) => {
      hear = !hear;
      e.currentTarget.setAttribute("aria-pressed", hear);
      e.currentTarget.textContent = hear ? "Beat sound is on" : "Beat sound is off";
    });
    $("#start").addEventListener("click", start);
    $("#pause").addEventListener("click", () => { pause(); say("Paused. Press Start when you are ready."); });
    $("#restart").addEventListener("click", () => { pause(); marks = []; taps = 0; draw(); start(); });
    addEventListener("resize", () => { dims = fit(canvas); });
  };

  /* ---------- Explore Pitch ---------- */
  init.pitch = function () {
    const stairs = $("#stairs"), hopper = $("#hopper"), canvas = $("#wave");
    let last = null, prev = null, dims = fit(canvas), phase = 0, cycles = 3, until = 0;
    hopper.innerHTML = Art.note("#ffffff");

    const btns = N.slice(0, 8).map((n, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.style.height = 64 + i * 24 + "px";
      b.style.background = n.c;
      b.textContent = n.n;
      b.setAttribute("aria-label", "Step " + (i + 1) + " of 8, note " + n.n);
      b.addEventListener("click", () => go(i));
      stairs.appendChild(b);
      return b;
    });

    function wave() {
      const { g, w, h } = dims;
      g.clearRect(0, 0, w, h);
      g.strokeStyle = last === null ? "#b9c2e0" : N[last].c; g.lineWidth = 6; g.lineCap = "round";
      g.beginPath();
      for (let x = 8; x <= w - 8; x += 3) {
        const y = h / 2 + Math.sin((x / w) * cycles * Math.PI * 2 + phase) * (h * 0.32);
        x === 8 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
      if (motionOK() && performance.now() < until) { phase -= 0.25; requestAnimationFrame(wave); }
    }
    function hop(i) {
      const b = btns[i];
      hopper.style.left = b.offsetLeft + b.offsetWidth / 2 + "px";
      hopper.style.bottom = b.offsetHeight + "px";
      btns.forEach((x) => x.classList.toggle("on", x === b));
      cycles = 2 + i * 1.1;
      last = i;
      until = performance.now() + 900;
      wave();
    }
    function go(i) {
      Sound.play("piano", N[i].f, { dur: 0.5 });
      prev = last;
      hop(i);
      if (prev === null) say("You played a sound! Try another step.");
      else if (i > prev) say("That sound is higher.");
      else if (i < prev) say("That sound is lower.");
      else say("That is the same sound again.");
      $("#again").disabled = $("#both").disabled = prev === null;
    }
    function walk(order) {
      order.forEach((i, k) => setTimeout(() => { Sound.play("piano", N[i].f, { dur: 0.3 }); hop(i); }, k * 330));
    }

    $("#again").addEventListener("click", () => {
      const a = prev, b = last;
      walk([a, b]);
      prev = a;
      say(b > a ? "The second sound is higher." : b < a ? "The second sound is lower." : "Both sounds are the same.");
    });
    $("#both").addEventListener("click", () => {
      Sound.play("piano", N[prev].f, { dur: 0.8, vel: 0.6 });
      Sound.play("piano", N[last].f, { dur: 0.8, vel: 0.6 });
      say("Two notes at once! Try combining different notes.");
    });
    $("#up").addEventListener("click", () => { walk([0, 1, 2, 3, 4, 5, 6, 7]); say("Up we go, from low to high."); });
    $("#down").addEventListener("click", () => { walk([7, 6, 5, 4, 3, 2, 1, 0]); say("Down we go, from high to low."); });
    addEventListener("resize", () => { dims = fit(canvas); wave(); if (last !== null) hop(last); });
    hopper.style.left = btns[0].offsetLeft + btns[0].offsetWidth / 2 + "px";
    hopper.style.bottom = btns[0].offsetHeight + "px";
    wave();
  };

  /* ---------- Fast or Slow ---------- */
  init.tempo = function () {
    // Opening of "Ode to Joy" (Beethoven, public domain): [note, beats]
    const tune = [[2, 1], [2, 1], [3, 1], [4, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1], [0, 1], [1, 1], [2, 1], [2, 1.5], [1, 0.5], [1, 2]];
    const slider = $("#tempo"), walker = $("#walker"), dots = $("#dots"), label = $("#tempo-word");
    let bpm = 100, i = 0, running = false, timer;
    walker.innerHTML = Art.note("#ff9fcb");
    tune.forEach(() => dots.appendChild(document.createElement("i")));

    function show() {
      slider.value = bpm;
      const w = bpm < 80 ? "slow, like a sleepy turtle" : bpm < 130 ? "medium, like walking" : "fast, like running";
      label.textContent = "This tempo is " + w + ".";
      press("#tempos", bpm);
    }
    function step() {
      if (!running) return;
      const n = tune[i][0], len = tune[i][1], beat = 60 / bpm;
      Sound.play("piano", N[n].f, { dur: beat * len * 0.8 });
      $$("i", dots).forEach((d, k) => d.classList.toggle("on", k === i));
      walker.style.transitionDuration = beat * len + "s";
      walker.style.left = 5 + 90 * (i / (tune.length - 1)) + "%";
      if (motionOK()) walker.animate([{ transform: "translateY(0)" }, { transform: "translateY(-14px)" }, { transform: "translateY(0)" }], { duration: beat * 1000 * Math.min(len, 1) });
      i = (i + 1) % tune.length;
      timer = setTimeout(step, beat * len * 1000);
    }
    function play() { if (running) return; Sound.unlock(); running = true; step(); }
    function pause() { running = false; clearTimeout(timer); }

    slider.addEventListener("input", () => { bpm = +slider.value; show(); });
    choose("#tempos", (v) => { bpm = +v; show(); say("Listen. The tune is the same, but the speed changed."); play(); });
    $("#play").addEventListener("click", () => { play(); say("Slide the slider to change the speed."); });
    $("#pause").addEventListener("click", () => { pause(); say("Paused. Press Play to keep going."); });
    $("#restart").addEventListener("click", () => { pause(); i = 0; play(); say("Back to the start!"); });
    show();
  };

  /* ---------- Loud or Soft ---------- */
  init.volume = function () {
    const slider = $("#vol"), box = $("#loud"), label = $("#vol-word"), inst = $("#loud-inst");
    const arp = [0, 2, 4, 7, 4, 2];
    let v = 0.4, sound = "piano", running = false, timer, k = 0;

    function show() {
      box.style.setProperty("--v", v);
      slider.value = Math.round(v * 100);
      label.textContent = v < 0.34 ? "This is a soft sound." : v < 0.67 ? "This is a medium sound." : "This is a loud sound.";
      press("#vols", Math.round(v * 100));
    }
    function step() {
      if (!running) return;
      const vel = 0.05 + v * 0.95;
      if (sound === "drum") Sound.play("drum", 0, { vel });
      else Sound.play(sound, N[arp[k % arp.length]].f, { vel, dur: 0.3 });
      k++;
      if (motionOK()) inst.animate([{ scale: 1 + v * 0.12 }, { scale: 1 }], { duration: 300 });
      timer = setTimeout(step, 460);
    }
    function play() { if (running) return; Sound.unlock(); running = true; step(); }

    slider.addEventListener("input", () => { v = slider.value / 100; show(); });
    choose("#vols", (x) => { v = x / 100; show(); play(); say(v < 0.34 ? "Shh. A soft, gentle sound." : v < 0.67 ? "A medium sound, not too big." : "A big, strong sound!"); });
    choose("#loud-sounds", (x) => { sound = x; inst.innerHTML = Art[x](); say("You discovered a new sound!"); });
    $("#play").addEventListener("click", () => { play(); say("Slide the slider. Hear the sound grow and shrink."); });
    $("#pause").addEventListener("click", () => { running = false; clearTimeout(timer); say("Paused. Quiet is part of music too."); });
    $("#restart").addEventListener("click", () => { v = 0.4; k = 0; show(); play(); say("Back to a gentle sound."); });
    inst.innerHTML = Art.piano();
    show();
  };

  /* ---------- Instrument World ---------- */
  init.instruments = function () {
    const grid = $("#inst-grid");
    const list = [
      { id: "drum", name: "Drums", fam: "Percussion", text: "You hit a drum to make it boom. Drums keep the beat.", tint: "#ffd9d2", tune: [["drum", 1], ["drum", 1], ["clap", 1], ["drum", 0.5], ["drum", 0.5], ["clap", 1]] },
      { id: "piano", name: "Piano", fam: "Keyboard", text: "Press a key and a tiny hammer inside taps a string.", tint: "#e6dffc", tune: [[0, 0.5], [2, 0.5], [4, 0.5], [7, 0.5], [4, 0.5], [2, 0.5], [0, 1]] },
      { id: "violin", name: "Violin", fam: "Strings", text: "You slide a bow across the strings to make them sing.", tint: "#fff1bf", tune: [[4, 1.5], [5, 1.5], [7, 1.5], [4, 2]] },
      { id: "guitar", name: "Guitar", fam: "Strings", text: "You pluck or strum the strings with your fingers.", tint: "#c4f1dc", tune: [[0, 0.5], [2, 0.5], [4, 0.5], [7, 0.5], [4, 0.5], [2, 0.5], [0, 1]] },
      { id: "flute", name: "Flute", fam: "Woodwind", text: "You blow across a hole to make a light, airy sound.", tint: "#bfe6fb", tune: [[4, 1], [5, 0.5], [6, 0.5], [7, 1], [4, 1.5]] },
      { id: "trumpet", name: "Trumpet", fam: "Brass", text: "You buzz your lips to make a bright, shiny sound.", tint: "#fff1bf", tune: [[0, 0.5], [0, 0.5], [4, 0.5], [4, 0.5], [7, 2]] },
      { id: "maraca", name: "Maraca", fam: "Percussion", text: "Shake it! Little beads inside go ch-ch-ch.", tint: "#ffe3f0", tune: [["shaker", 0.5], ["shaker", 0.5], ["shaker", 0.25], ["shaker", 0.25], ["shaker", 0.5], ["shaker", 0.5], ["shaker", 1]] },
      { id: "xylophone", name: "Xylophone", fam: "Percussion", text: "Tap the bars with a mallet. Short bars sound higher.", tint: "#bfe6fb", tune: [[0, 0.5], [1, 0.5], [2, 0.5], [3, 0.5], [4, 0.5], [5, 0.5], [6, 0.5], [7, 1]] }
    ];

    grid.innerHTML = list.map((x) =>
      '<article class="card inst" data-fam="' + x.fam + '" id="i-' + x.id + '"><div class="card__art" style="--tint:' + x.tint + '">' + Art[x.id]() + "</div>" +
      '<div class="card__body"><h3>' + x.name + '</h3><span class="family">' + x.fam + "</span><p>" + x.text + "</p>" +
      '<button class="btn btn--sun" type="button" data-id="' + x.id + '">Hear the ' + x.name.toLowerCase() + "</button></div></article>").join("");

    grid.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-id]");
      if (!b) return;
      const x = list.find((y) => y.id === b.dataset.id), card = $("#i-" + x.id), beat = 0.42;
      let t = 0;
      x.tune.forEach(([n, len]) => {
        if (typeof n === "string") Sound.play(n, 0, { when: t });
        else Sound.play(x.id, N[n].f, { when: t, dur: beat * len * 0.85 });
        t += beat * len;
      });
      card.classList.add("playing");
      setTimeout(() => card.classList.remove("playing"), t * 1000);
      say("That was the " + x.name.toLowerCase() + ". It belongs to the " + x.fam.toLowerCase() + " family.");
    });

    choose("#families", (fam) => {
      $$(".inst", grid).forEach((c) => c.classList.toggle("hide", fam !== "All" && c.dataset.fam !== fam));
      say(fam === "All" ? "Here are all the instruments." : "These are the " + fam.toLowerCase() + " instruments.");
    });
  };

  /* ---------- Remember the Pattern ---------- */
  init.pattern = function () {
    const tones = [0, 1, 2, 4, 5], padBox = $("#pads"), trail = $("#trail");
    const fresh = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * tones.length));
    let pat = fresh(), making = false;

    const pads = tones.map((n, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.style.background = N[n].c;
      b.setAttribute("aria-label", "Sound pad " + (i + 1));
      b.addEventListener("click", () => {
        flash(i, 0);
        if (!making) return;
        pat.push(i);
        show(pat);
        if (pat.length >= 8) { making = false; say("You made your own pattern! Press Hear it again."); }
      });
      padBox.appendChild(b);
      return b;
    });

    function flash(i, wait) {
      setTimeout(() => {
        Sound.play("xylophone", N[tones[i]].f);
        pads[i].classList.add("on");
        setTimeout(() => pads[i].classList.remove("on"), 260);
      }, wait);
    }
    function show(seq) {
      trail.innerHTML = seq.map((p) => '<i style="background:' + N[tones[p]].c + '"></i>').join("");
    }
    function run(seq) { seq.forEach((p, k) => flash(p, k * 480)); show(seq); }

    $("#play").addEventListener("click", () => { making = false; run(pat); $("#again").disabled = false; say("Nice listening! Tap the pads to play it your way."); });
    $("#again").addEventListener("click", () => { making = false; run(pat); say("Here it is again. Listen for the high and low sounds."); });
    $("#change").addEventListener("click", () => {
      making = false;
      const k = Math.floor(Math.random() * pat.length);
      pat = pat.slice();
      pat[k] = (pat[k] + 1 + Math.floor(Math.random() * (tones.length - 1))) % tones.length;
      run(pat);
      $("#again").disabled = false;
      say("The pattern changed a little. What sounds different?");
    });
    $("#make").addEventListener("click", () => { making = true; pat = []; show(pat); $("#again").disabled = false; say("Your turn! Tap up to 8 pads to build a pattern."); });
    $("#over").addEventListener("click", () => { making = false; pat = fresh(); show([]); $("#again").disabled = true; say("A fresh pattern is ready. Press Play the pattern."); });
  };

  /* ---------- Make a Melody ---------- */
  init.melody = function () {
    const staff = $("#staff"), COLS = 12, LINES = [2, 4, 6, 8, 10];
    let grid = new Array(COLS).fill(null), inst = "piano", bpm = 110, col = 0, running = false, timer;

    let html = "";
    for (let r = 10; r >= 0; r--) {
      for (let c = 0; c < COLS; c++) {
        html += '<button type="button" data-c="' + c + '" data-r="' + r + '" style="--c:' + N[r].c + '" class="' +
          (LINES.includes(r) ? "line" : r === 0 ? "ledger" : "") + '" aria-pressed="false" aria-label="Step ' + (c + 1) + ", note " + N[r].n + (r > 6 ? " high" : "") + '"></button>';
      }
    }
    staff.innerHTML = html;
    const cell = (c, r) => $('button[data-c="' + c + '"][data-r="' + r + '"]', staff);

    function put(c, r) {
      if (grid[c] !== null) { const old = cell(c, grid[c]); old.classList.remove("note"); old.setAttribute("aria-pressed", "false"); }
      if (grid[c] === r) { grid[c] = null; say("Try moving the notes around."); return; }
      grid[c] = r;
      const b = cell(c, r);
      b.classList.add("note");
      b.setAttribute("aria-pressed", "true");
      Sound.play(inst, N[r].f);
      const count = grid.filter((x) => x !== null).length;
      say(count === 1 ? "Your first note! Add some more." : pick(["You created something new!", "Your melody has its own sound.", "Try moving the notes around.", "There is more than one way to make music."]));
    }
    staff.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-c]");
      if (b) put(+b.dataset.c, +b.dataset.r);
    });

    const nb = $("#notebtns");
    N.slice(0, 8).forEach((n, r) => {
      const b = document.createElement("button");
      b.type = "button";
      b.style.background = n.c;
      b.textContent = n.n;
      b.setAttribute("aria-label", "Add note " + n.n + (r === 7 ? " high" : ""));
      b.addEventListener("click", () => {
        const c = grid.indexOf(null);
        if (c === -1) { Sound.play(inst, n.f); say("Your staff is full. Press Play, or tap a note to take it away."); return; }
        put(c, r);
      });
      nb.appendChild(b);
    });

    function step() {
      if (!running) return;
      $$(".now", staff).forEach((x) => x.classList.remove("now"));
      $$('button[data-c="' + col + '"]', staff).forEach((x) => x.classList.add("now"));
      if (grid[col] !== null) Sound.play(inst, N[grid[col]].f, { dur: (60 / bpm) * 0.8 });
      col = (col + 1) % COLS;
      timer = setTimeout(step, 60000 / bpm);
    }
    function pause() { running = false; clearTimeout(timer); $$(".now", staff).forEach((x) => x.classList.remove("now")); }

    $("#play").addEventListener("click", () => {
      if (running) return;
      Sound.unlock();
      if (grid.every((x) => x === null)) { say("Tap the lines or the colorful buttons to add notes first."); return; }
      running = true; step(); say("Listen to your melody!");
    });
    $("#pause").addEventListener("click", () => { pause(); say("Paused. What will you change?"); });
    $("#clear").addEventListener("click", () => {
      pause(); col = 0; grid.fill(null);
      $$(".note", staff).forEach((x) => { x.classList.remove("note"); x.setAttribute("aria-pressed", "false"); });
      say("A clean staff. What will you create next?");
    });
    choose("#speeds", (v) => { bpm = +v; say("Tempo means how fast or slow music moves."); });
    choose("#insts", (v) => { inst = v; Sound.play(v, N[4].f); say("You discovered a new sound!"); });
    choose("#scenes", (v) => { $("#staffwrap").style.setProperty("--scene", v); });
  };

  /* ---------- Music Drawing ---------- */
  init.drawing = function () {
    const cv = $("#easel"), scale = [0, 1, 2, 4, 5, 7];
    const colors = ["#17265c", "#f2605b", "#ff9e3d", "#ffd24a", "#5ccb8b", "#3cc0cf", "#8a5cf5", "#ff9fcb"];
    let dims = fit(cv), g = dims.g, color = colors[6], size = 12, shape = "brush", mood = "calm";
    let music = false, timer, at = 2, pulse = 0, down = false, last = null, spot = null;

    function wipe() { g.fillStyle = "#fff"; g.fillRect(0, 0, dims.w, dims.h); }
    wipe();

    const sw = $("#colors");
    colors.forEach((c, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.v = c; b.style.background = c;
      b.setAttribute("aria-pressed", c === color);
      b.setAttribute("aria-label", "Color " + (i + 1));
      sw.appendChild(b);
    });
    choose("#colors", (v) => { color = v; });
    choose("#sizes", (v) => { size = +v; });
    choose("#shapes", (v) => { shape = v; });
    choose("#moods", (v) => { mood = v; say(v === "calm" ? "Calm music makes smooth, flowing lines." : "Bouncy music makes dotty, jumpy lines."); });

    function star(x, y, r, fill) {
      g.fillStyle = fill; g.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
        g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      g.closePath(); g.fill();
    }
    function stamp(p) {
      const r = size * 1.6 * (1 + pulse);
      g.fillStyle = color; g.strokeStyle = color;
      if (shape === "circle") { g.beginPath(); g.arc(p.x, p.y, r, 0, 7); g.fill(); }
      else if (shape === "star") star(p.x, p.y, r * 1.3, color);
      else {
        g.save(); g.translate(p.x, p.y);
        g.beginPath(); g.ellipse(0, 0, r, r * 0.75, -0.3, 0, 7); g.fill();
        g.lineWidth = Math.max(3, r * 0.22); g.lineCap = "round";
        g.beginPath(); g.moveTo(r * 0.85, -r * 0.2); g.lineTo(r * 0.85, -r * 2.6); g.stroke();
        g.restore();
      }
    }
    function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

    cv.addEventListener("pointerdown", (e) => {
      cv.setPointerCapture(e.pointerId);
      down = true; last = spot = pos(e);
      if (shape === "brush") { g.fillStyle = color; g.beginPath(); g.arc(last.x, last.y, (size * (1 + pulse)) / 2, 0, 7); g.fill(); }
      else stamp(last);
    });
    cv.addEventListener("pointermove", (e) => {
      if (!down) return;
      const p = pos(e), dist = Math.hypot(p.x - last.x, p.y - last.y);
      spot = p;
      if (shape !== "brush") { if (dist > size * 4) { stamp(p); last = p; } return; }
      const w = size * (1 + pulse * 1.4);
      if (music && mood === "bouncy") {
        if (dist > w * 1.3) { g.fillStyle = color; g.beginPath(); g.arc(p.x, p.y, w / 1.6, 0, 7); g.fill(); last = p; }
        return;
      }
      g.strokeStyle = color; g.lineWidth = w; g.lineCap = g.lineJoin = "round";
      g.beginPath(); g.moveTo(last.x, last.y); g.lineTo(p.x, p.y); g.stroke();
      last = p;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => cv.addEventListener(ev, () => { down = false; }));

    // Gentle wandering tune. Each note makes the brush swell and drops a sparkle where you draw.
    function note() {
      if (!music) return;
      at = Math.max(0, Math.min(scale.length - 1, at + pick([-2, -1, -1, 1, 1, 2])));
      const n = N[scale[at]];
      Sound.play(mood === "calm" ? "piano" : "xylophone", n.f, { vel: 0.5, dur: 0.4 });
      pulse = 1;
      if (down && spot) star(spot.x + (Math.random() - 0.5) * 70, spot.y + (Math.random() - 0.5) * 70, 9, n.c);
      timer = setTimeout(note, mood === "calm" ? 640 : 330);
    }
    (function fade() { pulse *= 0.93; requestAnimationFrame(fade); })();

    $("#music").addEventListener("click", (e) => {
      music = !music;
      e.currentTarget.setAttribute("aria-pressed", music);
      e.currentTarget.textContent = music ? "Stop the music" : "Play music";
      clearTimeout(timer);
      if (music) { Sound.unlock(); note(); say("Draw while the music plays. Watch your brush dance!"); }
      else say("The music stopped. You can still draw.");
    });
    $("#clear").addEventListener("click", () => { wipe(); say("A clean page. What does the music make you imagine?"); });
    $("#over").addEventListener("click", () => {
      wipe(); music = false; clearTimeout(timer);
      $("#music").setAttribute("aria-pressed", "false"); $("#music").textContent = "Play music";
      color = colors[6]; size = 12; shape = "brush"; mood = "calm";
      press("#colors", color); press("#sizes", 12); press("#shapes", "brush"); press("#moods", "calm");
      say("All fresh! Pick a color and start drawing.");
    });
    addEventListener("resize", () => {
      const keep = document.createElement("canvas");
      keep.width = cv.width; keep.height = cv.height;
      keep.getContext("2d").drawImage(cv, 0, 0);
      const old = dims;
      dims = fit(cv); g = dims.g; wipe();
      g.drawImage(keep, 0, 0, old.w, old.h);
    });
  };

  if (init[page]) init[page]();
})();
