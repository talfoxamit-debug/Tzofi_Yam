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

The form is wired for **Formspree**. It needs one thing from you: a form ID.

### Turning it on (about two minutes)

1. Go to **[formspree.io](https://formspree.io)** and sign up with the troop's
   email address — `yam.bat-yam@zofim.org.il`. The free plan is enough to start.
2. Create a new form. Name it something you'll recognise, e.g. *תרומות – אתר*.
3. Formspree shows you an endpoint that looks like
   `https://formspree.io/f/mabcdefg`. **Copy the last part** — the form ID.
4. Open [`assets/js/config.js`](assets/js/config.js) and paste it in:

   ```js
   formspreeId: "mabcdefg",
   ```

5. Commit and deploy, then **send yourself one test submission through the live
   site**. Formspree emails the troop asking to confirm the address — click that
   link. Until you do, submissions are accepted but nothing is delivered.

Pasting the whole `https://formspree.io/f/mabcdefg` URL instead of just the ID
also works — the code accepts either.

### What the troop receives

Each lead arrives as an email titled *"פנייה לתרומה מהאתר — דנה כהן"*, and
because the donor's address is set as reply-to, hitting **Reply** in the inbox
answers the donor directly. Every submission also appears in the Formspree
dashboard, where it can be exported to CSV.

The payload carries: `name, email, phone, org, type, help, amount, message,
consent, lang, page`. The `lang` field tells you whether the enquiry came from
the Hebrew or English version — useful for knowing which language to answer in.

### Watch the free-plan ceiling

The free plan allows **50 submissions per month**. For a campaign that gets
shared around, that ceiling is reachable — and once it's hit, further leads are
rejected rather than queued. Keep an eye on the dashboard during any push, and
upgrade before a big send rather than after.

### Spam

The form includes Formspree's `_gotcha` honeypot — a field hidden from people
but visible to bots; anything that fills it is discarded server-side. If spam
still gets through, turn on reCAPTCHA in the Formspree dashboard.

### If something goes wrong

The form reports Formspree's own error text on screen, so problems are
diagnosable rather than mysterious:

| What you see | What it means |
| --- | --- |
| `(Form not found)` | The form ID is wrong or the form was deleted |
| `(Form is disabled)` | Hit the monthly limit, or the form was paused |
| `(HTTP 429)` | Too many submissions too quickly |
| Email client opens instead | No `formspreeId` set — step 4 wasn't saved or deployed |

Whatever the failure, the visitor is always offered the troop's email address as
a fallback, so a lead is never simply lost.

### Using something else instead

Set `formEndpoint` to a full URL and it takes precedence over `formspreeId`.
Anything that accepts a JSON `POST` works — a Google Apps Script web app, Getform,
Basin, or your own server.

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
