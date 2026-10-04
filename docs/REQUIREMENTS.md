# Early Music Literacy Program website: requirements

Version 1.0, October 4, 2026

Sources: "Early Music Website for Claude to Create" (the children's experience brief), "Website Development Proposal" (the platform proposal), the Back to BACH Project Fairfax County page, and two instructions from the project owner: add a separate legal sign-off page that asks for a parent when the visitor is under age, and keep the site deployable and manageable through GitHub without a CMS.

## 1. Purpose and audiences

One website that serves three audiences, kept apart from each other.

| Audience | What they need | Where |
|---|---|---|
| Children, roughly 3 to 10, new to music | A place to play with sound, with no pressure | Home, Explore Music, eight activities |
| Parents and guardians | Reassurance, ideas for home, a way to ask about classes | For Adults, Classes, Legal |
| Teachers and schools | Lesson material and a way to arrange a visit | Educators |

## 2. Conflicts between the two source documents, and how they are resolved

The two documents disagree. The brief forbids registration, accounts, payment, data collection, scores and progress tracking. The proposal asks for a registration portal, payments, a members dashboard with milestone charts and badges, and a gated educator hub.

| Topic | Brief | Proposal | Decision |
|---|---|---|---|
| Accounts and registration | None | Sign-up portal | None in the children's area, ever. Adults ask about a class through a three-step request that opens an email draft. Nothing is stored by the site. |
| Payment | None | Payment gateway | Not on the website. Deferred to phase 2 through a hosted third-party checkout, if the organization charges at all. |
| Progress tracking, badges, milestones | Forbidden | Members dashboard | Not built. It contradicts the program's core promise. If a members area is added later, limit it to attendance and extra videos for adults. |
| Educator hub | Not mentioned | Gated bulk downloads | Phase 1 publishes four open lesson outlines. A gated library is phase 2. |
| "Join a Class" button everywhere | "Do not use Register, Sign Up, Join Now" | Omnipresent | Child pages use "Start making music" and "Try it". "Ask about a class" appears only on adult pages. |
| CMS | Not mentioned | WordPress or Webflow Enterprise | Superseded by the owner: static site on GitHub Pages, content edited in `content.js` and the HTML files. |
| Hero video | Illustrated, playable scene | Background video | Illustrated, playable scene. Third-party video is kept off child pages for privacy. |
| Text-free playroom | Short friendly sentences | Text-free | Short sentences plus large illustrated controls. |

## 3. Functional requirements

Status: **Built** means present and working in this repository. **Later** means deferred, with the reason.

### Children's area

| ID | Requirement | Status |
|---|---|---|
| K-1 | Home hero: sky scene, staff rainbow, note clouds, clefs, stars, drum and piano characters, xylophone, sound waves, floating notes. Headline "What will you create with sound?", supporting sentence, buttons "Start making music" and "Explore the music world". | Built. Rainbow notes, xylophone, drum and piano all play. |
| K-2 | Five curiosity questions on the home page, as invitations, not a quiz. | Built. Each links to an activity. |
| K-3 | "Goal of this organization" section visible on the home page with the ten aims. | Built |
| K-4 | Home sections: What is early music literacy, Why music matters, How children learn here (4 steps), Choose your adventure (8 cards with illustration, title, one sentence, "Try it"), Message for parents and teachers with two buttons. | Built |
| K-5 | Explore Music page: all activities, any order, required heading and explanation, no completion markers. | Built |
| K-6 | Feel the Beat: several speeds, bouncing note, pulsing circle, choice of drum sounds, start, pause, restart, visual rhythm lines. Timing is never judged. | Built. Tapping near the edge plays softer. |
| K-7 | Explore Pitch: row of colored notes, rising staircase, sound waves, character moving up and down, compare two notes. Describes "higher" and "lower", never asks for a correct pitch. | Built |
| K-8 | Fast or Slow: slow, medium, fast, tempo slider, moving character, definition of tempo. | Built |
| K-9 | Loud or Soft: slider, three presets, waves that change size, instrument that grows and shrinks, hearing reminder. | Built |
| K-10 | Instrument World: drums, piano, violin, guitar, flute, trumpet, maraca, xylophone, in five families, each with illustration, name, description, hear button, animation. | Built |
| K-11 | Remember the Pattern: play, hear again, change, make my own, start over. Never a test. | Built |
| K-12 | Make a Melody: staff, colored note buttons, instruments, play, pause, clear, speed, background themes. | Built |
| K-13 | Music Drawing: canvas, colors, brush sizes, shapes, music that changes the visuals, clear and restart. | Built |
| K-14 | Only encouraging, descriptive messages. No "wrong", "failed", scores, levels, timers, rankings or progress indicators anywhere. | Built |
| K-15 | Every activity can be repeated, changed and restarted. | Built |

### Grown-up area

| ID | Requirement | Status |
|---|---|---|
| G-1 | For Adults page with "How adults can help" and "Music ideas for home". | Built |
| G-2 | Sample music and videos from credible sources. | Built. Five videos (Sydney Opera House, ARD Klassik/WDR, Yo-Yo Ma official, Voices of Music, EuroArts). Each ID was confirmed to exist and be embeddable on October 4, 2026. A person should still watch each one through before launch. |
| G-3 | About page: philosophy, how the program works, founding members with photos and bios, contact. | Built. No research statistics are quoted, because the brief forbids exaggerated claims and none were supplied. |
| G-4 | Events calendar, filterable by type. | Built with sample listings, flagged as samples on the page. |
| G-5 | Class enquiry with age-group matching and consent checkboxes. | Built as an email draft. No data is stored or transmitted by the site. |
| G-6 | Educator resources and partnership contact. | Built: four lesson outlines, printable, plus email contact. |
| G-7 | Contact routing for general and school enquiries. | Built as two pre-addressed email links. Conditional web forms need a backend: Later. |
| G-8 | Accounts, payments, members dashboard, gated educator downloads, ticket booking. | Later. Each needs a backend service and a privacy review. |

### Legal and consent

| ID | Requirement | Status |
|---|---|---|
| L-1 | A separate legal page that protects both the creators and the families. | Built: `legal.html`, ten sections covering permission, children's privacy, outside video, safe listening, educational-purpose disclaimer, classes and media consent, ownership, warranty and liability, changes and governing law. |
| L-2 | Sign-off by an adult. | Built: three checkboxes and a birth-year check. Only the date of sign-off is kept, in the browser. It can be withdrawn on the same page. |
| L-3 | Ask for a parent if the visitor is under age. | Built: play pages ask "How old are you?" Under 18 is told to fetch a parent, guardian or teacher, who is sent to the sign-off. The sign-off rejects a birth year under 18. |
| L-4 | The home page, About and Legal pages stay open without sign-off. | Built |

## 4. Non-functional requirements

| ID | Requirement | How it is met |
|---|---|---|
| N-1 | Children's privacy (COPPA-minded) | No accounts, forms, cookies, analytics or ad code. Fonts are self-hosted, so child pages make no third-party requests. Videos sit on an adult page and load only on a click, through youtube-nocookie.com. |
| N-2 | Accessibility, aiming at WCAG 2.1 AA | Navy on light backgrounds, visible focus rings, skip link, keyboard-operable controls, labelled buttons, live status messages, large touch targets, Reduce motion button that also follows the system setting. Not yet audited with a screen reader. |
| N-3 | Safe listening | Output volume is capped and limited in the sound engine. Reminder on the volume activity and in the legal page. |
| N-4 | Visual identity | Navy headings, sky blue, lavender, yellow, mint, coral, orange, pink and purple, white reading areas. Rounded display type with a high-legibility body face. |
| N-5 | Hosting and management | Static files on GitHub Pages. Day-to-day content in `content.js`. See `README.md`. |
| N-6 | Devices | Works with touch, mouse and keyboard. Checked at desktop and 390px phone width with no sideways scrolling. |
| N-7 | No licensing exposure | All sounds are synthesized in the browser. The only tune quoted is the opening of "Ode to Joy" (public domain). Fonts are under the SIL Open Font License. |

## 5. Sitemap

Home · Explore Music · Feel the Beat · Explore Pitch · Fast or Slow · Loud or Soft · Instrument World · Remember the Pattern · Make a Melody · Music Drawing · For Adults · Classes and Events · Educators · About the Organization · Terms, Privacy and Safety

## 6. Launch checklist

1. Have an attorney review `legal.html`. It is marked as a draft on the page. Confirm the governing-law clause and the legal name of the organization.
2. Replace the placeholder email in `content.js`.
3. Replace the sample events in `content.js` and set `eventsAreSamples` to `false`.
4. Replace the founding member photos in `assets/img/team/` (they are temporary copies from the Back to BACH Fairfax County page) and get written parent or guardian consent for each member's name, photo and bio.
5. Confirm with the Back to BACH Project that the "Who is behind it" paragraph in `about.html` describes the relationship correctly, or remove it.
6. Watch each listed video from start to finish.
7. Test on real phones and tablets (iOS and Android) and with a screen reader.
8. Decide whether any phase 2 item (payments, accounts, gated downloads) is wanted at all, given the program's no-accounts promise.
