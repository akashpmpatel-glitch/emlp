/* Illustrations (inline SVG) and the shared list of activities. */
window.Art = (function () {
  var S = 'stroke="#17265c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  function svg(body, box) {
    return '<svg viewBox="' + (box || "0 0 120 120") + '" aria-hidden="true" focusable="false">' + body + "</svg>";
  }
  function face(x, y, gap) {
    gap = gap || 12;
    return '<circle cx="' + (x - gap) + '" cy="' + y + '" r="4" fill="#17265c"/><circle cx="' + (x + gap) + '" cy="' + y + '" r="4" fill="#17265c"/>' +
      '<path d="M' + (x - 8) + " " + (y + 9) + " q8 9 16 0" + '" fill="none" ' + S + "/>";
  }

  var a = {};

  a.note = function (color) {
    return svg('<path d="M52 20v58" fill="none" ' + S + ' stroke-width="5"/><path d="M52 20c14 4 24 12 22 30-6-12-12-14-22-16z" fill="' + (color || "#ff7a66") + '" ' + S + '/><ellipse cx="38" cy="82" rx="20" ry="15" transform="rotate(-18 38 82)" fill="' + (color || "#ff7a66") + '" ' + S + "/>" + face(38, 79, 7), "0 0 90 104");
  };

  a.drum = function () {
    return svg('<path d="M20 44v38c0 9 18 15 40 15s40-6 40-15V44" fill="#ff7a66" ' + S + '/><path d="M20 62l13 22 13-20 14 23 14-23 13 20 13-22" fill="none" stroke="#ffd24a" stroke-width="3" stroke-linejoin="round"/><ellipse cx="60" cy="44" rx="40" ry="14" fill="#fff6dd" ' + S + '/><path d="M30 14l22 26M92 12L70 38" fill="none" ' + S + ' stroke-width="5"/><circle cx="29" cy="13" r="6" fill="#ffd24a" ' + S + '/><circle cx="93" cy="11" r="6" fill="#ffd24a" ' + S + "/>");
  };
  a.piano = function () {
    return svg('<rect x="12" y="26" width="96" height="70" rx="12" fill="#8a5cf5" ' + S + '/><rect x="12" y="58" width="96" height="26" fill="#fff" ' + S + '/><path d="M28 58v26M44 58v26M60 58v26M76 58v26M92 58v26" ' + S + '/><path d="M24 58h8v15h-8zM40 58h8v15h-8zM72 58h8v15h-8zM88 58h8v15h-8z" fill="#17265c"/><path d="M26 96v12M94 96v12" ' + S + ' stroke-width="5"/>');
  };
  a.violin = function () {
    return svg('<g transform="rotate(28 60 60)"><path d="M60 8v40" ' + S + ' stroke-width="7"/><path d="M53 8h14" ' + S + ' stroke-width="5"/><path d="M60 42c-16 0-20 12-14 22-12 8-12 44 14 44s26-36 14-44c6-10 2-22-14-22z" fill="#ff9e3d" ' + S + '/><path d="M56 12v84M64 12v84" stroke="#17265c" stroke-width="1.5"/><path d="M50 94h20" ' + S + '/></g><path d="M16 96L104 30" ' + S + ' stroke="#8a5cf5" stroke-width="4"/>');
  };
  a.guitar = function () {
    return svg('<g transform="rotate(35 60 60)"><rect x="54" y="2" width="12" height="16" rx="3" fill="#17265c"/><path d="M60 16v48" ' + S + ' stroke-width="8"/><path d="M60 50c-14 0-22 8-20 20-10 6-12 40 20 40s30-34 20-40c2-12-6-20-20-20z" fill="#ffd24a" ' + S + '/><circle cx="60" cy="78" r="10" fill="#17265c"/><path d="M48 98h24" ' + S + '/><path d="M57 16v82M63 16v82" stroke="#17265c" stroke-width="1.2"/></g>');
  };
  a.flute = function () {
    return svg('<g transform="rotate(-24 60 60)"><rect x="6" y="50" width="108" height="18" rx="9" fill="#bfe6fb" ' + S + '/><rect x="16" y="46" width="14" height="26" rx="5" fill="#fff" ' + S + '/><circle cx="46" cy="59" r="4" fill="#17265c"/><circle cx="60" cy="59" r="4" fill="#17265c"/><circle cx="74" cy="59" r="4" fill="#17265c"/><circle cx="88" cy="59" r="4" fill="#17265c"/><circle cx="102" cy="59" r="4" fill="#17265c"/></g><path d="M18 30q8-8 16 0M28 18q8-8 16 0" fill="none" ' + S + ' stroke="#8a5cf5"/>');
  };
  a.trumpet = function () {
    return svg('<path d="M8 56h60" ' + S + ' stroke-width="8"/><path d="M68 50c16 0 26-10 40-22v64c-14-12-24-22-40-22z" fill="#ffd24a" ' + S + '/><rect x="30" y="56" width="34" height="26" rx="13" fill="none" ' + S + ' stroke-width="6"/><path d="M36 42v18M47 42v18M58 42v18" ' + S + ' stroke-width="6"/><path d="M32 40h8M43 40h8M54 40h8" ' + S + ' stroke="#ff7a66" stroke-width="6"/><rect x="4" y="50" width="8" height="14" rx="3" fill="#17265c"/>');
  };
  a.maraca = function () {
    return svg('<g transform="rotate(-25 60 60)"><path d="M60 62v48" ' + S + ' stroke="#ff9e3d" stroke-width="10"/><ellipse cx="60" cy="40" rx="26" ry="32" fill="#ff9fcb" ' + S + '/><path d="M36 34q24 10 48 0M36 48q24 10 48 0" fill="none" stroke="#8a5cf5" stroke-width="4"/><circle cx="50" cy="24" r="3" fill="#17265c"/><circle cx="68" cy="22" r="3" fill="#17265c"/><circle cx="60" cy="60" r="3" fill="#17265c"/></g><path d="M96 26l8-6M100 40l10-2M92 14l4-8" ' + S + "/>");
  };
  a.xylophone = function () {
    var cols = ["#f2605b", "#ff9e3d", "#ffd24a", "#5ccb8b", "#3cc0cf", "#6f9cf5", "#b58af8"], out = "";
    cols.forEach(function (c, i) {
      var h = 78 - i * 7;
      out += '<rect x="' + (10 + i * 14.5) + '" y="' + (62 - h / 2) + '" width="11.5" height="' + h + '" rx="4" fill="' + c + '" ' + S + ' stroke-width="2.5"/>';
    });
    return svg(out + '<path d="M40 112l22-34M84 110L70 82" ' + S + ' stroke-width="4"/><circle cx="62" cy="78" r="6" fill="#ff7a66" ' + S + '/><circle cx="70" cy="82" r="6" fill="#ff7a66" ' + S + "/>");
  };

  a.pitch = function () {
    var cols = ["#f2605b", "#ff9e3d", "#ffd24a", "#5ccb8b", "#6f9cf5"], out = "";
    cols.forEach(function (c, i) {
      out += '<rect x="' + (10 + i * 20) + '" y="' + (86 - i * 16) + '" width="20" height="' + (24 + i * 16) + '" fill="' + c + '" ' + S + "/>";
    });
    return svg(out + '<ellipse cx="100" cy="12" rx="8" ry="6" transform="rotate(-18 100 12)" fill="#17265c"/>');
  };
  a.tempo = function () {
    return svg('<path d="M40 104L52 18h16l12 86z" fill="#5ccb8b" ' + S + '/><path d="M60 92L84 26" ' + S + ' stroke-width="4"/><rect x="74" y="34" width="14" height="10" rx="3" transform="rotate(20 81 39)" fill="#ffd24a" ' + S + '/><circle cx="60" cy="92" r="5" fill="#17265c"/><path d="M34 104h52" ' + S + ' stroke-width="6"/><path d="M12 40h16M8 54h18M12 68h14" ' + S + ' stroke="#ff7a66"/>');
  };
  a.volume = function () {
    return svg('<path d="M14 46h20l26-22v72L34 74H14z" fill="#ff9fcb" ' + S + '/><path d="M72 46q8 14 0 28M84 36q14 24 0 48M96 26q20 34 0 68" fill="none" ' + S + ' stroke="#8a5cf5" stroke-width="5"/>');
  };
  a.pattern = function () {
    return svg('<circle cx="34" cy="34" r="22" fill="#f2605b" ' + S + '/><circle cx="86" cy="34" r="22" fill="#ffd24a" ' + S + '/><circle cx="34" cy="86" r="22" fill="#5ccb8b" ' + S + '/><circle cx="86" cy="86" r="22" fill="#6f9cf5" ' + S + '/><path d="M34 34h52L34 86h52" fill="none" stroke="#17265c" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>');
  };
  a.melody = function () {
    var lines = "";
    for (var i = 0; i < 5; i++) lines += '<path d="M8 ' + (36 + i * 13) + 'h104" stroke="#17265c" stroke-width="2.5"/>';
    return svg(lines + '<ellipse cx="28" cy="82" rx="10" ry="7.5" transform="rotate(-18 28 82)" fill="#f2605b" ' + S + '/><ellipse cx="54" cy="62" rx="10" ry="7.5" transform="rotate(-18 54 62)" fill="#ffd24a" ' + S + '/><ellipse cx="78" cy="69" rx="10" ry="7.5" transform="rotate(-18 78 69)" fill="#5ccb8b" ' + S + '/><ellipse cx="100" cy="43" rx="10" ry="7.5" transform="rotate(-18 100 43)" fill="#b58af8" ' + S + "/>");
  };
  a.drawing = function () {
    return svg('<path d="M12 92c18-34 30 14 48-10s22-10 46-30" fill="none" stroke="#8a5cf5" stroke-width="9" stroke-linecap="round"/><path d="M70 30l18 18-34 34-22 6 6-22z" fill="#ffd24a" ' + S + '/><path d="M70 30l10-10c5-5 13-5 18 0s5 13 0 18L88 48z" fill="#ff7a66" ' + S + '/><path d="M38 66l16 16" ' + S + '/><path d="M96 82l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="#ff9fcb" ' + S + ' stroke-width="2"/>');
  };

  a.ear = function () { return svg('<path d="M40 100c-4-20-16-28-16-48a36 36 0 0172 0c0 22-20 22-24 38s-18 22-32 10z" fill="#ffd9c2" ' + S + '/><path d="M44 54a16 16 0 0132 0c0 10-12 10-14 20" fill="none" ' + S + '/><path d="M102 30q10 14 0 28" fill="none" ' + S + ' stroke="#8a5cf5"/>'); };
  a.share = function () { return svg('<circle cx="40" cy="42" r="18" fill="#ffd24a" ' + S + "/>" + face(40, 40, 6) + '<circle cx="84" cy="50" r="14" fill="#ff9fcb" ' + S + "/>" + face(84, 48, 5) + '<path d="M14 104c0-22 12-34 26-34s26 12 26 34zM64 104c0-18 8-28 20-28s20 10 20 28z" fill="#bfe6fb" ' + S + "/>"); };

  /* Characters for the home page band. */
  a.drumChar = function () {
    return svg('<path d="M38 150l-6 24M92 150l6 24" ' + S + ' stroke-width="6"/><path d="M22 176h14M94 176h14" ' + S + ' stroke-width="7"/><path d="M14 84L0 52M116 84l14-32" ' + S + ' stroke-width="5"/><path d="M0 52l26-30M130 52L104 22" ' + S + ' stroke="#ff9e3d" stroke-width="5"/><circle cx="27" cy="21" r="7" fill="#ffd24a" ' + S + '/><circle cx="103" cy="21" r="7" fill="#ffd24a" ' + S + '/><path d="M14 70v62c0 12 22 20 51 20s51-8 51-20V70" fill="#ff7a66" ' + S + '/><path d="M14 132l17-18 17 22 17-22 17 22 17-22 17 18" fill="none" stroke="#ffd24a" stroke-width="4" stroke-linejoin="round"/><ellipse cx="65" cy="70" rx="51" ry="17" fill="#fff6dd" ' + S + "/>" + face(65, 100, 16), "-6 6 142 180");
  };
  a.pianoChar = function () {
    return svg('<path d="M30 140v30M130 140v30" ' + S + ' stroke-width="7"/><path d="M18 172h24M118 172h24" ' + S + ' stroke-width="7"/><rect x="8" y="30" width="144" height="112" rx="18" fill="#8a5cf5" ' + S + '/><circle cx="56" cy="62" r="13" fill="#fff" ' + S + '/><circle cx="104" cy="62" r="13" fill="#fff" ' + S + '/><circle cx="59" cy="64" r="5.5" fill="#17265c"/><circle cx="107" cy="64" r="5.5" fill="#17265c"/><path d="M26 92h108v20a18 18 0 01-18 18H44a18 18 0 01-18-18z" fill="#fff" ' + S + '/><path d="M44 92v37M62 92v38M80 92v38M98 92v38M116 92v37" ' + S + ' stroke-width="2.5"/><path d="M39 92h10v20H39zM57 92h10v20H57zM93 92h10v20H93zM111 92h10v20h-10z" fill="#17265c"/><circle cx="34" cy="84" r="6" fill="#ff9fcb"/><circle cx="126" cy="84" r="6" fill="#ff9fcb"/>', "0 20 160 162");
  };
  a.cloud = function () {
    return svg('<path d="M96 20v70" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/><path d="M96 20c26 4 40 20 34 44-8-16-18-18-34-22z" fill="#fff"/><g fill="#fff"><circle cx="40" cy="96" r="24"/><circle cx="66" cy="84" r="28"/><circle cx="84" cy="100" r="20"/><rect x="34" y="96" width="56" height="24" rx="12"/></g>', "0 0 140 130");
  };
  a.star = function (c) {
    return svg('<path d="M20 2l4.5 11.5L36 18l-11.5 4.5L20 34l-4.5-11.5L4 18l11.5-4.5z" fill="' + (c || "#ffd24a") + '" stroke="#17265c" stroke-width="2" stroke-linejoin="round"/>', "0 0 40 36");
  };
  a.logo = function () {
    return svg('<circle cx="24" cy="24" r="22" fill="#ffd24a" stroke="#17265c" stroke-width="3"/><path d="M22 12v18" stroke="#17265c" stroke-width="3.5" stroke-linecap="round"/><path d="M22 12c7 2 12 6 11 14-3-5-6-6-11-7z" fill="#ff7a66" stroke="#17265c" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="17" cy="32" rx="7.5" ry="5.5" transform="rotate(-18 17 32)" fill="#ff7a66" stroke="#17265c" stroke-width="2.5"/>', "0 0 48 48");
  };

  a.ACTIVITIES = [
    { id: "beat", href: "beat.html", title: "Feel the Beat", text: "Tap along with a steady beat and make your own rhythm.", art: "drum", tint: "#ffd9d2" },
    { id: "pitch", href: "pitch.html", title: "Explore Pitch", text: "Climb the musical stairs from low sounds to high sounds.", art: "pitch", tint: "#bfe6fb" },
    { id: "instruments", href: "instruments.html", title: "Meet the Instruments", text: "Visit Instrument World and hear how each one sounds.", art: "trumpet", tint: "#fff1bf" },
    { id: "tempo", href: "tempo.html", title: "Fast or Slow", text: "Make a tune walk slowly or zoom along.", art: "tempo", tint: "#c4f1dc" },
    { id: "volume", href: "volume.html", title: "Loud or Soft", text: "Slide from a whisper sound to a big sound.", art: "volume", tint: "#ffe3f0" },
    { id: "pattern", href: "pattern.html", title: "Remember the Pattern", text: "Listen to a sound pattern, then change it your way.", art: "pattern", tint: "#e6dffc" },
    { id: "melody", href: "melody.html", title: "Make a Melody", text: "Put colorful notes on the lines and hear your own tune.", art: "melody", tint: "#bfe6fb" },
    { id: "drawing", href: "drawing.html", title: "Music Drawing", text: "Draw while music plays and watch your lines dance.", art: "drawing", tint: "#fff1bf" }
  ];

  return a;
})();
