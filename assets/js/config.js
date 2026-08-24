/* ==========================================================================
   SITE CONFIG — this is the only file you normally need to edit.
   קובץ ההגדרות — זה הקובץ היחיד שצריך לערוך בדרך כלל.
   ========================================================================== */

window.SITE_CONFIG = {

  /* --------------------------------------------------------------------
     1. WHERE THE DONATION-LEAD FORM SENDS ITS DATA
        לאן נשלחים הפרטים מטופס התרומה

     Leave as null and the form falls back to opening the visitor's email
     client with everything pre-filled — it works out of the box, but you
     will not get a record of leads you can track.

     To collect leads properly, pick ONE (each takes ~2 minutes, all free):

       Formspree  → sign up at formspree.io, create a form, paste the URL:
                    formEndpoint: "https://formspree.io/f/xxxxxxx"
       Netlify    → deploy on Netlify; forms are picked up automatically
                    (the markup already carries the netlify attributes).
       Google     → use a Google Apps Script web-app URL.

     See README.md for step-by-step instructions.
     -------------------------------------------------------------------- */
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

  /* --------------------------------------------------------------------
     3. CAMPAIGN NUMBERS — מספרי הקמפיין
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
