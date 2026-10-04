/* Grown-up pages: listening room videos, events, class request, legal sign-off. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const ORG = window.ORG;

  /* Founding members come from content.js. */
  const team = $("#team");
  if (team) {
    team.innerHTML = window.CONTENT.team.map((m) =>
      '<article class="sticker member"><img src="' + m.photo + '" alt="' + m.name + '" width="500" height="500" loading="lazy">' +
      '<div class="member__body"><h3>' + m.name + '</h3><p class="member__role">' + m.instrument + " &middot; " + m.role + " since " + m.since + "</p>" +
      '<ul class="ticks">' + m.bio.map((b) => "<li>" + b + "</li>").join("") + "</ul></div></article>").join("");
  }

  /* Video cards come from content.js. */
  const vids = $("#videos");
  if (vids) {
    vids.innerHTML = window.CONTENT.videos.map((v) =>
      '<article class="sticker video"><div class="video__frame"><button class="btn btn--sun" type="button" data-yt="' + v.id + '">Play video<span class="sr">: ' + v.title + "</span></button></div>" +
      '<div class="video__body"><h3>' + v.title + "</h3><p>" + v.text + "</p>" +
      '<a href="https://www.youtube.com/watch?v=' + v.id + '" rel="noopener noreferrer" target="_blank">Watch on YouTube</a></div></article>').join("");
  }

  /* Videos load only after a grown-up presses Play, and use YouTube's privacy-enhanced player. */
  $$("button[data-yt]").forEach((b) => {
    b.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + b.dataset.yt + "?rel=0&autoplay=1";
      f.title = b.closest(".video").querySelector("h3").textContent;
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.allowFullscreen = true;
      b.parentNode.replaceChildren(f);
    });
  });

  $$("[data-mail]").forEach((a) => {
    a.href = "mailto:" + ORG.email + "?subject=" + encodeURIComponent(a.dataset.mail);
  });
  $$("[data-email]").forEach((el) => { el.textContent = ORG.email; });
  $$("[data-print]").forEach((b) => b.addEventListener("click", () => window.print()));

  /* ---------- Events ---------- */
  const list = $("#events");
  if (list) {
    const events = window.CONTENT.events;
    $("#events-sample").classList.toggle("hide", !window.CONTENT.eventsAreSamples);
    const draw = (type) => {
      list.innerHTML = events.filter((e) => type === "All" || e.type === type).map((e) =>
        '<article class="event sticker"><div class="event__date"><small>' + e.m + "</small>" + e.d + "</div>" +
        '<div><span class="badge">' + e.type + "</span> <h3>" + e.title + "</h3><p>" + e.time + " &middot; " + e.where + "</p><p>" + e.who + "</p></div></article>").join("");
    };
    $("#event-types").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-v]");
      if (!b) return;
      $$("#event-types button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      draw(b.dataset.v);
    });
    draw("All");
  }

  /* ---------- Class request ----------
     Nothing typed here is stored or sent by the website. The last step opens the
     grown-up's own email app with a draft they can read before sending. */
  const ask = $("#ask");
  if (ask) {
    const groups = { "3 to 4": "Little Listeners", "5 to 6": "Beat Builders", "7 to 8": "Melody Makers", "9 to 10": "Young Composers" };
    const pickd = { age: null, when: null };
    const steps = $$(".ask-step", ask);
    const go = (n) => { steps.forEach((s, i) => s.classList.toggle("hide", i !== n)); steps[n].querySelector("h3").focus(); };

    ["age", "when"].forEach((key, n) => {
      $("#ask-" + key).addEventListener("click", (e) => {
        const b = e.target.closest("button[data-v]");
        if (!b) return;
        $$("#ask-" + key + " button").forEach((x) => x.setAttribute("aria-pressed", x === b));
        pickd[key] = b.dataset.v;
        if (key === "age") $("#ask-match").textContent = "A good fit: " + groups[b.dataset.v] + ", for ages " + b.dataset.v + ".";
        $$(".ask-next", steps[n])[0].disabled = false;
      });
    });
    $$(".ask-next", ask).forEach((b) => b.addEventListener("click", () => go(+b.dataset.to)));
    $$(".ask-back", ask).forEach((b) => b.addEventListener("click", () => go(+b.dataset.to)));

    const boxes = $$("#ask-consent input[required]");
    const finish = $("#ask-finish");
    $("#ask-consent").addEventListener("change", () => { finish.disabled = !boxes.every((x) => x.checked); });
    finish.addEventListener("click", () => {
      const group = groups[pickd.age];
      $("#ask-summary").textContent = group + " (ages " + pickd.age + "), " + pickd.when + ".";
      const body = "Hello,\n\nI would like to ask about a class.\n\nGroup: " + group + " (ages " + pickd.age + ")\nPreferred time: " + pickd.when +
        "\nPhotos and video of my child: " + ($("#ask-media").checked ? "I am open to discussing consent" : "No, please do not photograph or record my child") +
        "\n\nI am the child's parent or legal guardian and I have read the Terms, Privacy and Safety page.\n\nThank you.";
      $("#ask-mail").href = "mailto:" + ORG.email + "?subject=" + encodeURIComponent("Class request: " + group) + "&body=" + encodeURIComponent(body);
      go(3);
    });
  }

  /* ---------- Legal sign-off ---------- */
  const form = $("#signoff");
  if (form) {
    const done = $("#signed"), err = $("#sign-error");
    const next = new URLSearchParams(location.search).get("next");
    const safeNext = next && /^[a-z-]+\.html$/.test(next) ? next : "explore.html";
    const paint = () => {
      const ok = Store.get("emlp-ok");
      form.classList.toggle("hide", !!ok);
      done.classList.toggle("hide", !ok);
      if (ok) { $("#signed-date").textContent = ok; $("#signed-go").href = safeNext; }
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const year = parseInt($("#birth").value, 10), now = new Date().getFullYear();
      if (!$$("input[type=checkbox]", form).every((x) => x.checked)) { err.textContent = "Please tick all three boxes to continue."; return; }
      if (!(year >= 1900 && year <= now - 18)) {
        err.textContent = "This step needs a parent, guardian or teacher who is 18 or older. Please ask a grown-up to fill it in.";
        return;
      }
      // Only the date of the OK is kept, on this device. The birth year is checked and thrown away.
      Store.set("emlp-ok", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
      location.href = safeNext;
    });
    $("#unsign").addEventListener("click", () => { Store.del("emlp-ok"); paint(); });
    paint();
  }
})();
