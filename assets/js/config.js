/* ==========================================================================
   SITE CONFIG — this is the only file you normally need to edit.
   קובץ ההגדרות — זה הקובץ היחיד שצריך לערוך בדרך כלל.
   ========================================================================== */

window.SITE_CONFIG = {

  /* --------------------------------------------------------------------
     1. WHERE THE DONATION-LEAD FORM SENDS ITS DATA
        לאן נשלחים הפרטים מטופס התרומה

     The form is wired for Formspree. To switch it on:

       1. Go to formspree.io and sign up (free) with the troop's email.
       2. Create a new form. Call it something like "תרומות – אתר".
       3. Formspree shows you an endpoint like
              https://formspree.io/f/mabcdefg
          Copy the LAST PART only — the form ID, e.g. mabcdefg.
       4. Paste it between the quotes below:

              formspreeId: "mabcdefg",

       5. Submit the form once yourself. Formspree emails the troop to
          confirm the address — click the link in that email, or nothing
          will come through.

     That is all. Leads then arrive by email and are listed in the
     Formspree dashboard.

     NOTE ON THE FREE PLAN: it allows 50 submissions per month. If the
     campaign takes off you will hit that ceiling and further leads are
     rejected, so keep an eye on the dashboard and upgrade if needed.

     Until an ID is set, the form falls back to opening the visitor's
     email client with everything pre-filled. That works, but gives you
     no record you can track.
     -------------------------------------------------------------------- */
  formspreeId: null,

  /* Only needed for a different service (Netlify, Google Apps Script, your
     own endpoint). A full URL here overrides formspreeId above. */
  formEndpoint: null,

  /* --------------------------------------------------------------------
     2. CONTACT DETAILS — פרטי קשר
        Sourced from the troop's official page on zofim.org.il.
        Update freely; every place they appear on the site reads from here.
     -------------------------------------------------------------------- */
  email: "yam.bat-yam@zofim.org.il",

  /* Phone used for the WhatsApp button. International format, no +, no dashes. */
  whatsapp: "972544320429",

  contacts: [
    { name: { he: "בר מוסרי",  en: "Bar Mosreri" }, role: { he: "ריכוז השבט",  en: "Troop Coordinator" }, phone: "054-4320429" },
    { name: { he: "גל מגן",    en: "Gal Magen"   }, role: { he: "ראשות השבט",  en: "Troop Head"        }, phone: "050-4900060" }
  ],

  address: {
    he: "רחוב יורדי הים, בת ים",
    en: "Yordei HaYam St., Bat Yam, Israel"
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=%D7%99%D7%95%D7%A8%D7%93%D7%99+%D7%94%D7%99%D7%9D+%D7%91%D7%AA+%D7%99%D7%9D",

  facebook:  "https://www.facebook.com/BatYamSeaScouts",
  instagram: "https://www.instagram.com/yam_bat_yam",
  youtube:   "https://www.youtube.com/@yambatyam1",

  /* --------------------------------------------------------------------
     3. VIDEO  ·  סרטון

     Paste the YouTube video ID — the part after "v=" in the URL.
     From https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  "dQw4w9WgXcQ"
     A full YouTube URL works too.

     While this is null the whole video section stays hidden.
     -------------------------------------------------------------------- */
  youtubeId: "Gcehy3RlX08",

  /* --------------------------------------------------------------------
     4. TRUST  ·  אמון

     This is the section a serious donor actually reads. Every field here
     is optional — anything left null simply doesn't appear, so nothing
     unverified ever goes on the page.

     IMPORTANT: tax-deductibility is a legal claim. Do not switch these on
     until someone at the movement has confirmed the exact wording. See
     docs/materials-request.md for the questions to ask.
     -------------------------------------------------------------------- */
  trust: {
    /* Year the troop was founded, e.g. 1965. Shows as "פועלים מאז 1965". */
    foundedYear: null,

    /* Israel: set true once confirmed that receipts are issued through
       תנועת הצופים. Fill amuta/section46 only if you have the real values. */
    receiptsIsrael: true,
    amutaNumber: null,
    section46: false,

    /* USA: set true ONLY after confirming that the US entity accepts a
       donation earmarked for this troop — not merely that it exists.
       Friends of Israel Scouts, Inc. (EIN 13-3843506) is the North American
       arm of Tzofim and is the likely route, but its published programming
       is North American chapters, so earmarking must be verified first. */
    receiptsUSA: false,
    usEntity: null,
    usEin: null
  },

  /* --------------------------------------------------------------------
     TESTIMONIALS  ·  המלצות

     The whole section stays hidden while this list is empty. Add entries as
     they come in — no other file needs touching.

     Each entry:
       quote : what they said. "en" is optional; if you leave it out, the
               Hebrew is shown to English readers too.
       name  : full name. Only publish with the person's permission.
       role  : who they are — "אמא של חניך", "בוגר מחזור 2015", "מדריך".

     Example (delete the // to switch it on):

       { quote: { he: "השבט נתן לבן שלי ביטחון שלא ראיתי בשום מקום אחר.",
                  en: "The troop gave my son a confidence I hadn't seen anywhere else." },
         name: "רונית לוי",
         role: { he: "אמא של חניך", en: "Parent" } },
     -------------------------------------------------------------------- */
  testimonials: [
  ],

  /* Optional link to the PDF deck, if you want the site to carry it too.
     Drop the file in and point at it, e.g. "assets/tzofei-yam-deck.pdf". */
  deckUrl: null,

  /* --------------------------------------------------------------------
     5. CAMPAIGN NUMBERS — מספרי הקמפיין
        Straight from the troop's own presentation. Change the amounts here
        and the budget bars, totals and giving levels all follow.
     -------------------------------------------------------------------- */
  currency: "₪",

  needs: [
    { key: "equipment",  amount: 200000, major: true },
    { key: "carriages",  amount: 60000 },
    { key: "assistance", amount: 20000 },
    { key: "education",  amount: 20000 }
  ],

  /* A separate, larger infrastructure project (the second launch slope). */
  slopeProject: 150000,

  /* Cost of one participant's full year — the anchor for the giving levels. */
  yearPerChild: 1420,

  /* Participation today vs. the goal. */
  participantsNow: 60,
  participantsGoal: 120
};
