# TODO · צופי ים בת ים

Open items for the website. Nothing here blocks the site from being used —
it works as it stands — but each one closes a gap.

---

## 1. Get the credibility material  ·  biggest single win

The site now has a Transparency section and space for testimonials, but the
content has to come from the movement. `docs/materials-request.md` is a
ready-to-send Hebrew message asking for exactly what's missing — founding year,
testimonials, tax-receipt details, safety credentials, letters of support.

`docs/materials-request.md` now holds **two** messages — one for the troop
(founding year, testimonials, photos, safety, numbers) and one for whoever
handles money and receipts at the movement (the tax questions in item 3).

- [ ] Send message 1 to the troop
- [ ] Send message 2 to the finance/receipts contact
- [ ] Paste testimonials into the `testimonials` list in `assets/js/config.js`
      as they arrive — the section appears by itself once there's at least one

---

## 2. ~~Paste the YouTube video ID~~  ·  DONE

- [x] Set to `Gcehy3RlX08` — *"צופי ים בת ים"* from the troop's own channel
      [@yambatyam1](https://www.youtube.com/@yambatyam1). Verified public and
      embeddable. The channel is also linked from the contact section now.

---

## 3. Confirm the tax-receipt wording  ·  do NOT guess here

This is a legal claim on a public page, so the site ships with the US half
switched **off** until you confirm it.

- [ ] **Israel** — confirm receipts are issued through תנועת הצופים. If there's
      a סעיף 46 approval, set `trust.section46: true`
- [ ] **USA** — the likely route is *Friends of Israel Scouts, Inc.*
      (EIN 13-3843506), the North American arm of Tzofim. **But its published
      programming is North American chapters**, so before switching this on you
      must confirm: *does it accept a donation earmarked for our troop, or does
      the money go into a general fund?* The answer changes how you approach
      every overseas donor.
- [ ] Only once confirmed, set `trust.receiptsUSA: true`

---

## 4. Add the founding year

- [ ] Set `trust.foundedYear` in `assets/js/config.js`. The line
      "פועלים בבת ים מאז ____" appears automatically once it's filled in.

---

## 5. Turn on Formspree  ·  ~5 minutes

The form is wired and tested. It needs one value pasted in.

Until this is done, submitting opens the visitor's own email client with the
details pre-filled. That works, but you get no record you can track.

- [ ] Sign up at [formspree.io](https://formspree.io) with `yam.bat-yam@zofim.org.il`
- [ ] Create a form — name it something recognisable, e.g. *תרומות – אתר*
- [ ] Copy the form ID: `https://formspree.io/f/`**`mabcdefg`** ← just the last part
- [ ] Paste into `assets/js/config.js`:

      formspreeId: "mabcdefg",

- [ ] Deploy, then **submit the form once from the live site**
- [ ] **Click the confirmation link Formspree emails you.** This is the step
      people skip — until you click it, submissions are accepted but never
      delivered.

**Watch the ceiling:** the free plan allows 50 submissions/month and *rejects*
leads past that rather than queueing them.

---

## 6. Confirm photo permissions  ·  before sharing publicly

Every photograph on the site shows identifiable minors.

- [ ] Confirm parental consent covers public web use for each photo
- [ ] Swap out any photo that isn't covered (see README for the resize command)

---

## 7. Check the contact details are current

Taken from the troop's public listing on zofim.org.il.

- [ ] Bar Mosreri · 054-4320429 — still correct?
- [ ] Gal Magen · 050-4900060 — still correct?
- [ ] Both happy to appear on a public fundraising page?
- [ ] Update in `assets/js/config.js` if anything changed

---

## 8. When there's a real domain

Link previews in WhatsApp, Facebook and email need **absolute** URLs — a
relative path produces no preview image at all. Since the site is mostly shared
as a link, this matters more than it looks.

- [ ] In `index.html`, update:

      <link rel="canonical" href="https://your-domain.org/">
      <meta property="og:image" content="https://your-domain.org/assets/img/sailing-crew.jpg">

---

## 9. Accessibility statement  ·  legal requirement in Israel

The page is built to be keyboard- and screen-reader-friendly, but the formal
statement (הצהרת נגישות) is a legal document, not a technical one.

- [ ] Add a published accessibility statement
