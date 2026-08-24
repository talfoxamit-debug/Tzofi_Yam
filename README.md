# צופי ים בת ים · Sea Scouts of Bat Yam

A bilingual (Hebrew / English) one-page website for **שבט הסלע – צופי ים בת ים**,
built to showcase the troop and collect donation leads.

Everything is plain HTML, CSS and JavaScript — no build step, no framework, no
dependencies. Open `index.html` in a browser and it works.

---

## התחלה מהירה · Quick start

```bash
# view it locally
python3 -m http.server 8000
# then open http://localhost:8000
```

To edit **contact details, phone numbers, campaign amounts or the form
destination**, you only need one file: [`assets/js/config.js`](assets/js/config.js).
It is commented in plain language. The rest of the site reads from it.

To edit **wording**, open `index.html`. Every piece of text appears twice,
once per language:

```html
<h2>
  <span lang="he">הצי שלנו</span>
  <span lang="en">Our fleet</span>
</h2>
```

Both versions live in the HTML (so search engines index both, and the page
still reads correctly with JavaScript disabled); CSS shows the active one.
If you change the Hebrew, change the English next to it.

---

## Collecting donation leads

**Out of the box, with nothing configured**, the form opens the visitor's email
client with every field pre-filled and addressed to the troop. That works
immediately — but you get no record you can track, and it fails for people
without a mail client set up.

**To collect leads properly**, pick one option below and set `formEndpoint` in
`assets/js/config.js`.

### Option A — Formspree (easiest, ~2 minutes, free tier)

1. Sign up at [formspree.io](https://formspree.io) and create a new form.
2. Copy the endpoint URL it gives you.
3. In `assets/js/config.js`:
   ```js
   formEndpoint: "https://formspree.io/f/xxxxxxx",
   ```

Submissions arrive by email and are listed in the Formspree dashboard.

### Option B — Netlify Forms (free, if you host on Netlify)

Deploy the folder to Netlify and you're done — the form markup already carries
`data-netlify="true"` and a honeypot field. Leave `formEndpoint` as `null` and
**remove the `e.preventDefault()` path** by setting:

```js
formEndpoint: "/",   // Netlify intercepts the POST
```

Leads then appear under *Site → Forms* in the Netlify dashboard.

### Option C — Google Sheets (free, keeps everything in your Drive)

Create a Google Apps Script web app that appends `e.postData` to a sheet,
deploy it with access set to "Anyone", and paste the `/exec` URL into
`formEndpoint`.

Whatever you pick, the form posts JSON with these keys:
`name, email, phone, org, type, help, amount, message, consent, lang, page`.

---

## Deploying

The site is static, so any host works.

**GitHub Pages** — repository *Settings → Pages → Source: Deploy from a branch*,
pick this branch and `/ (root)`. Live within a minute.

**Netlify / Vercel** — drag the folder onto their dashboard, or connect the
repository. No build command; the publish directory is the repository root.

**Any web host** — upload `index.html` and the `assets/` folder over FTP.

### After you have a real domain

Two lines in `index.html` should point at it so link previews work properly in
WhatsApp, Facebook and email:

```html
<link rel="canonical" href="https://your-domain.org/">
<meta property="og:image" content="https://your-domain.org/assets/img/sailing-crew.jpg">
```

Facebook and WhatsApp need the **absolute** image URL — a relative path will
not produce a preview image.

---

## Before you go live — a short checklist

- [ ] **Photo permissions.** Every photograph shows identifiable minors. Confirm
      you hold parental consent for public web use of each one. Any photo can be
      swapped out — see below.
- [ ] **Tax receipts.** The site deliberately says *"contact us about receipts and
      tax"* rather than promising a 46א deduction. If the troop does issue
      recognised receipts, say so explicitly — it measurably increases giving.
      If it doesn't, leave the wording as it is.
- [ ] **Contact details.** The names, phone numbers and email in `config.js` were
      taken from the troop's public page on zofim.org.il. Check they are current,
      and that the people listed are happy to appear on a public fundraising page.
- [ ] **Amounts.** The campaign figures come from the troop's own presentation
      (200,000 / 60,000 / 20,000 / 20,000 ₪, plus the 150,000 ₪ slope project).
      Update `config.js` and the matching text in `index.html` if they've moved.
- [ ] **Accessibility statement.** Israeli law requires a published accessibility
      statement (הצהרת נגישות) for many organisational sites. The page is built to
      be keyboard- and screen-reader-friendly, but the formal statement is a legal
      document you should add.

---

## Replacing the photographs

Images live in `assets/img/` and are referenced from `index.html`. Keep the same
filename and the swap is automatic. If you use a new filename, update the `src`,
the `width`/`height` attributes, and both `alt` descriptions.

Keep files under roughly 250 KB each. To re-optimise a photo:

```bash
python3 -c "
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open('new-photo.jpg')).convert('RGB')
im.thumbnail((1500, 1500), Image.LANCZOS)
im.save('assets/img/new-photo.jpg', 'JPEG', quality=82, optimize=True, progressive=True)
"
```

---

## What's in here

```
index.html               the whole page — all content, both languages
assets/css/styles.css    design system and layout (RTL/LTR aware)
assets/js/config.js      ← the file you edit: contacts, amounts, form endpoint
assets/js/main.js        language switch, navigation, form handling
assets/img/              photographs from the troop
```

### Notes for whoever maintains this

- The stylesheet uses **logical properties** (`margin-inline`, `inset-inline-start`)
  throughout, so a single set of rules serves both Hebrew (RTL) and English (LTR).
  If you add CSS, use logical properties too — `margin-left` will break one language.
- Reveal-on-scroll is scoped to `.js .reveal`, so nothing is ever invisible if
  JavaScript fails to run.
- `prefers-reduced-motion` is respected; all animation is disabled for visitors
  who ask for it.
- The navigation collapses to a drawer below 1180px, which is where the longer
  English menu stops fitting.

---

*A branch of the Hebrew Scouts Movement in Israel · ענף של תנועת הצופים העבריים בישראל*
