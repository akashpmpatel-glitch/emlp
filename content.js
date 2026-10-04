/* ============================================================
   SITE CONTENT — the one file to edit for day-to-day updates.

   You can edit this file right on GitHub: open it, press the
   pencil icon, change the text between the quotes, then press
   "Commit changes". The live site updates in about a minute.

   Rules: keep the quotes, commas and brackets exactly as they
   are. Only change the words inside the quotes.
   ============================================================ */
window.CONTENT = {

  /* Contact details shown across the site. */
  org: {
    name: "Early Music Literacy Program",
    email: "hello@earlymusicliteracy.example"   // placeholder: replace with the real address
  },

  /* Founding members on the About page.
     To replace a photo: upload the new picture to assets/img/team/ and put its
     file name in "photo" (or upload it with the same file name as the old one).
     Square pictures with the face near the top work best. */
  team: [
    { name: "Justin Lee", instrument: "Cello", role: "Regional Director", since: "Summer 2025",
      photo: "assets/img/team/justin-lee.jpg",
      bio: [
        "Studies at Juilliard Pre-College",
        "Grand Prize winner of the Enkor International Music Competition, the New York Laureate International Music Competition and the Korean Youth Honor Society Competition",
        "Attended Morningside Music Bridge and the Heifetz International Music Institute",
        "OrigamiUSA junior member"
      ] },
    { name: "Vihaan Patel", instrument: "Cello", role: "Founding member", since: "Summer 2025",
      photo: "assets/img/team/vihaan-patel.jpg",
      bio: [
        "Took part in the Tennessee Cello competition at the University of Tennessee",
        "Solo and ensemble competitions for the past four years",
        "Plays in the top-level chamber ensemble of the school orchestra"
      ] },
    { name: "Devin Lee", instrument: "Bass", role: "Founding member", since: "Spring 2025",
      photo: "assets/img/team/devin-lee.jpg",
      bio: [
        "Principal bass of the American Youth String Ensemble",
        "Principal bass of the school string ensemble",
        "Selected to play in the Junior District Orchestra"
      ] },
    { name: "Aaron Liu", instrument: "Piano", role: "Founding member", since: "Fall 2025",
      photo: "assets/img/team/aaron-liu.png",
      bio: [
        "First prize in the Royal Foundation online competition",
        "Has played piano for nine years",
        "Competes internationally"
      ] }
  ],

  /* Shows a "Sample listings" notice above the events. Change to false once the dates are real. */
  eventsAreSamples: true,

  /* Events on the Classes page, in date order.
     type must be one of: "Free trial", "Community", "Camp", "Teacher seminar" */
  events: [
    { day: "17", month: "Oct 2026", type: "Free trial",      title: "Hello, Music! free trial session",                    time: "Saturday, 10:30 am", where: "Community library meeting room", who: "Ages 4 to 7 with a grown-up" },
    { day: "7",  month: "Nov 2026", type: "Community",       title: "Meet the Instruments family afternoon",               time: "Saturday, 2:00 pm",  where: "Community library meeting room", who: "All ages" },
    { day: "14", month: "Nov 2026", type: "Teacher seminar", title: "Music play in the classroom, no instruments needed",  time: "Saturday, 9:30 am",  where: "Online",                          who: "Pre-K to grade 3 teachers" },
    { day: "5",  month: "Dec 2026", type: "Free trial",      title: "Beat and rhythm free trial session",                  time: "Saturday, 10:30 am", where: "Community library meeting room", who: "Ages 5 to 8 with a grown-up" },
    { day: "28", month: "Dec 2026", type: "Camp",            title: "Winter break music camp",                             time: "Three mornings, 9:30 am to noon", where: "Location to be announced", who: "Ages 6 to 10" },
    { day: "16", month: "Jan 2027", type: "Community",       title: "Traveling the world with music",                      time: "Saturday, 2:00 pm",  where: "Online",                          who: "All ages" }
  ],

  /* Videos on the For Adults page.
     id is the part of a YouTube link after "watch?v=".
     Only add videos from official channels of orchestras, venues or artists,
     and watch each one all the way through before adding it. */
  videos: [
    { id: "M0Jc4sP0BEE", title: "George Meets the Orchestra",
      text: "Sydney Opera House. A young boy visits an orchestra and meets each instrument family. A friendly first look at how instruments are played." },
    { id: "4vbvhU22uAM", title: "The Young Person's Guide to the Orchestra",
      text: "Benjamin Britten, played by the WDR Symphony Orchestra (ARD Klassik). Written to show children every section of the orchestra, one at a time." },
    { id: "1prweT95Mo0", title: "Bach: Cello Suite No. 1, Prelude",
      text: "Yo-Yo Ma, official video. One cello, one flowing pattern that rises and falls. Good for listening for high and low." },
    { id: "pzlw6fUux4o", title: "Bach: Air on the G String",
      text: "Voices of Music, on instruments from Bach's time. Slow and calm. A good piece for the drawing activity or for winding down." },
    { id: "QLj_gMBqHX8", title: "Bach: Brandenburg Concerto No. 3",
      text: "Freiburger Barockorchester (EuroArts). Quick and lively, with string players passing the tune around. Good for feeling a fast, steady beat." }
  ]
};
