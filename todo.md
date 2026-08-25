# TODO · צופי ים בת ים

Open items for the website. Nothing here blocks the site from being used —
it works as it stands — but each one closes a gap.

---

## 1. Turn on Formspree  ·  ~5 minutes

The donation-lead form is fully wired and tested. It needs one value pasted in.

Until this is done, submitting the form opens the visitor's own email client
with the details pre-filled. That works, but you get no record you can track.

- [ ] Sign up at [formspree.io](https://formspree.io) with `yam.bat-yam@zofim.org.il`
      (free plan is enough to start)
- [ ] Create a form — name it something recognisable, e.g. *תרומות – אתר*
- [ ] Copy the form ID from the endpoint it shows you:
      `https://formspree.io/f/`**`mabcdefg`** ← just the last part
- [ ] Paste it into `assets/js/config.js`:

      formspreeId: "mabcdefg",

- [ ] Deploy, then **submit the form once from the live site**
- [ ] **Click the confirmation link Formspree emails you.** This step is the one
      people skip — until you click it, submissions are accepted but nothing is
      ever delivered.

Pasting the full `https://formspree.io/f/mabcdefg` URL instead of just the ID
also works; the code accepts either.

**Watch the ceiling:** the free plan allows 50 submissions per month, and past
that Formspree *rejects* leads rather than queueing them. If the page ever gets
pushed to a mailing list or WhatsApp groups, upgrade before the send, not after.

Full details, error-message table and CSV export notes: see README.md.

---

## 2. Confirm photo permissions  ·  before sharing publicly

Every photograph on the site shows identifiable minors.

- [ ] Confirm parental consent covers public web use for each photo
- [ ] Swap out any photo that isn't covered (see README for the resize command)

---

## 3. Decide what to say about tax receipts  ·  affects giving directly

The site currently says *"צרו קשר לגבי קבלה וזיכוי מס"* — deliberately vague,
because the troop's status wasn't verified.

- [ ] Establish: is there a registered עמותה? Does תנועת הצופים issue the
      receipts? Is there a סעיף 46 approval?
- [ ] If recognised receipts *are* available, say so explicitly on the page.
      This is one of the first things a serious donor checks, and a clear
      answer measurably increases giving.

---

## 4. Check the contact details are current

Taken from the troop's public listing on zofim.org.il.

- [ ] Bar Mosreri · 054-4320429 — still correct?
- [ ] Gal Magen · 050-4900060 — still correct?
- [ ] Both happy to appear on a public fundraising page?
- [ ] Update in `assets/js/config.js` if anything changed

---

## 5. When there's a real domain

Link previews in WhatsApp, Facebook and email need **absolute** URLs — a
relative path produces no preview image at all. Since the site is mostly shared
as a link, this matters more than it looks.

- [ ] In `index.html`, update:

      <link rel="canonical" href="https://your-domain.org/">
      <meta property="og:image" content="https://your-domain.org/assets/img/sailing-crew.jpg">

---

## 6. Accessibility statement  ·  legal requirement in Israel

The page is built to be keyboard- and screen-reader-friendly, but the formal
statement (הצהרת נגישות) is a legal document, not a technical one.

- [ ] Add a published accessibility statement
