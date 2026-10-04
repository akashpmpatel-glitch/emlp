# Early Music Literacy Program website

A music playground for young children, plus pages for parents, teachers and schools.

It is a plain static website: HTML, CSS and JavaScript files. There is no build step, no database, no server code and no CMS. GitHub hosts it for free and GitHub's own editor is the admin panel.

## Put it online with GitHub Pages

1. Create a new repository on GitHub and upload everything in this folder (or `git init`, commit, and push).
2. In the repository go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch", choose the `main` branch and the `/ (root)` folder, then **Save**.
4. After about a minute the site is live at `https://<your-account>.github.io/<repository-name>/`.

Every later commit to `main` republishes the site automatically. To use your own domain, add it under **Settings → Pages → Custom domain**.

The two planning PDFs are listed in `.gitignore` so they are not published. One is marked confidential.

## Change the content

| To change | Edit this file |
|---|---|
| Contact email, founding members, events calendar, video list | `content.js` (instructions are at the top of the file) |
| Words on a page | That page's `.html` file, for example `about.html` |
| Terms, privacy and safety text | `legal.html` |
| Lesson outlines for teachers | `educators.html` |
| Colors and fonts | The `:root` block at the top of `assets/css/site.css` |

To edit on GitHub: open the file, press the pencil icon, make the change, press **Commit changes**. To let someone review first, choose "Create a new branch and start a pull request" when committing.

## Preview on your own computer

```
python -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` directly also works for everything except the YouTube videos.)

## What is in the folder

```
index.html            Home
explore.html          Activity picker
beat.html … drawing.html   The eight activities
adults.html           For parents and teachers, home ideas, videos
classes.html          Events and class request
educators.html        Lesson outlines, school partnerships
about.html            About and contact
legal.html            Terms, privacy, safety and the grown-up sign-off
content.js            Editable content: contact, events, videos
assets/css/site.css   All styles
assets/js/audio.js    Sound engine (sounds are generated, there are no audio files)
assets/js/art.js      Illustrations and the list of activities
assets/js/site.js     Header, footer, motion setting, grown-up gate
assets/js/activities.js   The eight activities
assets/js/grownups.js     Videos, events, class request, sign-off
assets/fonts/         Self-hosted fonts (SIL Open Font License)
assets/img/team/      Founding member photos
docs/REQUIREMENTS.md  Structured requirements and what is built
```

## Before launch

See the launch checklist at the end of `docs/REQUIREMENTS.md`.
