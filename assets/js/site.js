/* Shared page chrome: header, footer, motion setting, grown-up gate, home hero. */
(function () {
  // Contact details live in content.js so they can be edited without touching code.
  var ORG = window.CONTENT.org;
  window.ORG = ORG;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.dataset.page || "";

  // Only two things are ever saved, both on this device only: the motion choice and the grown-up OK.
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  window.Store = store;

  /* ---------- Motion ---------- */
  var root = document.documentElement;
  var prefersLess = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.dataset.motion = store.get("emlp-motion") || (prefersLess ? "off" : "on");

  /* ---------- Header and footer ---------- */
  var links = [
    ["index.html", "Home", "home"], ["explore.html", "Explore music", "explore"],
    ["instruments.html", "Instrument world", "instruments"], ["adults.html", "For adults", "adults"],
    ["classes.html", "Classes", "classes"], ["educators.html", "Educators", "educators"], ["about.html", "About", "about"]
  ];
  var header = $("#site-header");
  if (header) {
    header.outerHTML =
      '<header class="top"><div class="wrap top__in">' +
      '<a class="brand" href="index.html">' + Art.logo() + "<span>Early Music<br>Literacy Program</span></a>" +
      '<button class="btn menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>' +
      '<nav id="nav" aria-label="Main">' +
      links.map(function (l) { return '<a href="' + l[0] + '"' + (l[2] === page ? ' aria-current="page"' : "") + ">" + l[1] + "</a>"; }).join("") +
      "</nav>" +
      '<button class="btn motion-btn" type="button" id="motion"></button>' +
      "</div></header>";
  }
  var footer = $("#site-footer");
  if (footer) {
    footer.outerHTML =
      '<footer class="foot"><div class="wrap"><div class="foot__grid">' +
      "<div><h2>" + ORG.name + "</h2><p>A pressure-free place for children to explore music. No accounts, no scores, no ads.</p>" +
      '<p><button class="btn motion-btn" type="button" id="motion2"></button></p></div>' +
      "<div><h2>Play</h2><ul>" + '<li><a href="explore.html">Explore music</a></li>' +
      Art.ACTIVITIES.slice(0, 4).map(function (x) { return '<li><a href="' + x.href + '">' + x.title + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h2>Create</h2><ul>" +
      Art.ACTIVITIES.slice(4).map(function (x) { return '<li><a href="' + x.href + '">' + x.title + "</a></li>"; }).join("") + "</ul></div>" +
      '<div><h2>Grown-ups</h2><ul><li><a href="adults.html">For adults</a></li><li><a href="classes.html">Classes and events</a></li>' +
      '<li><a href="educators.html">Educators</a></li><li><a href="about.html">About the organization</a></li>' +
      '<li><a href="legal.html">Terms, privacy and safety</a></li></ul></div>' +
      "</div><small>&copy; 2026 " + ORG.name + ". This site does not collect personal information from children.</small></div></footer>";
  }

  var menu = $(".menu-btn"), nav = $("#nav");
  if (menu) menu.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", open);
  });

  function paintMotion() {
    var off = root.dataset.motion === "off";
    $$(".motion-btn").forEach(function (b) {
      b.textContent = off ? "Turn motion on" : "Reduce motion";
      b.setAttribute("aria-pressed", off);
    });
  }
  $$(".motion-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      root.dataset.motion = root.dataset.motion === "off" ? "on" : "off";
      store.set("emlp-motion", root.dataset.motion);
      paintMotion();
    });
  });
  paintMotion();

  /* ---------- Illustrations and activity cards ---------- */
  $$("[data-art]").forEach(function (el) {
    var fn = Art[el.dataset.art];
    if (fn) el.innerHTML = fn(el.dataset.color);
  });
  $$("[data-cards]").forEach(function (el) {
    el.innerHTML = Art.ACTIVITIES.filter(function (x) { return x.id !== page; }).map(function (x) {
      return '<article class="card"><div class="card__art" style="--tint:' + x.tint + '">' + Art[x.art]() + "</div>" +
        '<div class="card__body"><h3>' + x.title + "</h3><p>" + x.text + "</p>" +
        '<a class="btn btn--sun" href="' + x.href + '">Try it<span class="sr">: ' + x.title + "</span></a></div></article>";
    }).join("");
  });

  /* ---------- Grown-up gate ----------
     Play pages open only after a parent, guardian or teacher has signed off on legal.html. */
  if (document.body.hasAttribute("data-gated") && !store.get("emlp-ok")) {
    var here = (location.pathname.split("/").pop() || "index.html");
    var next = "legal.html?next=" + encodeURIComponent(here) + "#sign-off";
    var main = $("main");
    if (main) main.inert = true;
    var gate = document.createElement("div");
    gate.className = "gate";
    gate.innerHTML =
      '<div class="gate__box sticker" role="dialog" aria-modal="true" aria-labelledby="gate-h">' + Art.note("#ffd24a") +
      '<div id="gate-ask"><h2 id="gate-h">One quick thing before we play</h2><p>How old are you?</p>' +
      '<div class="btn-row" style="justify-content:center"><button class="btn btn--sun btn--big" type="button" id="gate-kid">I am under 18</button>' +
      '<a class="btn btn--big" href="' + next + '">I am 18 or older</a></div></div>' +
      '<div id="gate-kidmsg" class="hide"><h2>Please get a grown-up</h2><p>Ask a parent, guardian or teacher to come and sit with you. They need to say OK on one short page. Then the music starts!</p>' +
      '<div class="btn-row" style="justify-content:center"><a class="btn btn--sun btn--big" href="' + next + '">My grown-up is here</a>' +
      '<a class="btn" href="index.html">Back to home</a></div></div></div>';
    document.body.appendChild(gate);
    $("#gate-kid").addEventListener("click", function () {
      $("#gate-ask").classList.add("hide");
      $("#gate-kidmsg").classList.remove("hide");
      $("#gate-kidmsg a").focus();
    });
    $("#gate-kid").focus();
  }

  /* ---------- Home hero ---------- */
  if (page === "home") {
    var N = Sound.NOTES;

    // Notes sitting on the staff rainbow. Each one plays its pitch.
    var holder = $("#rainbow-notes"), out = "";
    for (var k = 0; k < 8; k++) {
      var t = 0.2 + k * 0.086, x = -40 + 1280 * t;
      var y = 250 * (1 - t) * (1 - t) - 140 * t * (1 - t) + 250 * t * t + (4 - k * 0.5) * 22;
      out += '<g class="rnote" tabindex="0" role="button" aria-label="Play note ' + N[k].n + '" data-i="' + k + '">' +
        '<circle cx="' + x + '" cy="' + y + '" r="34" fill="transparent"/>' +
        '<path d="M' + (x + 16) + " " + (y - 4) + "v-58" + '" stroke="#17265c" stroke-width="5" stroke-linecap="round"/>' +
        '<ellipse cx="' + x + '" cy="' + y + '" rx="19" ry="14" transform="rotate(-18 ' + x + " " + y + ')" fill="' + N[k].c + '" stroke="#17265c" stroke-width="4"/></g>';
    }
    holder.innerHTML = out;
    function ring(i) { Sound.play("xylophone", N[i].f); }
    holder.addEventListener("click", function (e) { var g = e.target.closest(".rnote"); if (g) ring(+g.dataset.i); });
    holder.addEventListener("keydown", function (e) {
      var g = e.target.closest(".rnote");
      if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); ring(+g.dataset.i); }
    });

    var xylo = $("#xylo");
    N.slice(0, 8).forEach(function (n, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.style.height = 150 - i * 11 + "px";
      b.style.background = n.c;
      b.textContent = n.n;
      b.setAttribute("aria-label", "Xylophone bar " + n.n);
      b.addEventListener("click", function () { ring(i); });
      xylo.appendChild(b);
    });
    $("#char-drum").addEventListener("click", function () { Sound.play("drum"); Sound.play("drum", 0, { when: 0.18 }); Sound.play("clap", 0, { when: 0.36 }); });
    $("#char-piano").addEventListener("click", function () { [0, 2, 4, 7].forEach(function (n, i) { Sound.play("piano", N[n].f, { when: i * 0.14 }); }); });

    // Sky decorations. They sit behind the words and never cover them.
    var hero = $(".hero");
    [
      ["deco--cloud", Art.cloud(), "top:26%;left:3%"], ["deco--cloud", Art.cloud(), "top:40%;right:4%;animation-delay:-9s"],
      ["deco--clef", "&#x1D11E;", "top:34%;left:13%"], ["deco--clef", "&#x1D122;", "top:36%;right:13%;animation-delay:-4s"],
      ["deco--star", Art.star(), "top:30%;left:30%"], ["deco--star far", Art.star("#ff9fcb"), "top:52%;left:8%;animation-delay:-1s"],
      ["deco--star", Art.star("#fff"), "top:33%;right:28%;animation-delay:-1.6s"], ["deco--star far", Art.star(), "top:62%;right:7%;animation-delay:-0.6s"],
      ["deco--note", Art.note("#ff9fcb"), "left:7%"], ["deco--note", Art.note("#ffd24a"), "left:24%;animation-delay:-3s"],
      ["deco--note", Art.note("#c4f1dc"), "right:22%;animation-delay:-5s"], ["deco--note", Art.note("#b58af8"), "right:6%;animation-delay:-7s"]
    ].forEach(function (d) {
      var el = document.createElement("div");
      el.className = "deco " + d[0];
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = d[2];
      el.innerHTML = d[1];
      hero.appendChild(el);
    });
  }
})();
