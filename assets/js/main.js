/* ==========================================================================
   Site behaviour: language switch, navigation, reveal-on-scroll, budget
   bars, giving levels and the donation-lead form.
   Everything degrades gracefully — the page is fully readable without JS.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------------------
     Language
     Content for both languages lives in the HTML; CSS hides the inactive
     one. Here we only flip the html attributes and patch the handful of
     things CSS cannot reach — attributes like placeholder and aria-label.
     --------------------------------------------------------------------- */
  var LANG_KEY = "tzofeiyam.lang";

  function currentLang() {
    return docEl.getAttribute("data-lang") === "en" ? "en" : "he";
  }

  function setLang(lang, remember) {
    var isEn = lang === "en";
    docEl.setAttribute("data-lang", isEn ? "en" : "he");
    docEl.setAttribute("lang", isEn ? "en" : "he");
    docEl.setAttribute("dir", isEn ? "ltr" : "rtl");

    $$("[data-en-attr]").forEach(function (el) {
      var pairs = el.getAttribute("data-en-attr").split("|");
      pairs.forEach(function (pair) {
        var i = pair.indexOf(":");
        if (i < 0) return;
        var attr = pair.slice(0, i).trim();
        var enVal = pair.slice(i + 1).trim();
        var stash = "data-he-" + attr;
        if (!el.hasAttribute(stash)) el.setAttribute(stash, el.getAttribute(attr) || "");
        el.setAttribute(attr, isEn ? enVal : el.getAttribute(stash));
      });
    });

    $$("[data-lang-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === (isEn ? "en" : "he")));
    });

    if (remember) {
      try { localStorage.setItem(LANG_KEY, isEn ? "en" : "he"); } catch (e) { /* private mode */ }
    }
  }

  // Restore a previous choice, otherwise follow the browser for non-Hebrew speakers.
  (function initLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* private mode */ }
    if (saved !== "he" && saved !== "en") {
      var nav = (navigator.language || "he").toLowerCase();
      saved = nav.indexOf("he") === 0 || nav.indexOf("iw") === 0 ? "he" : "en";
    }
    setLang(saved, false);
  })();

  $$("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang-btn"), true); });
  });

  /* ---------------------------------------------------------------------
     Header + mobile navigation
     --------------------------------------------------------------------- */
  var header = $(".header");
  var nav = $(".nav");
  var navToggle = $(".nav-toggle");
  var donateBar = $(".donate-bar");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-stuck", y > 40);
    if (donateBar) donateBar.classList.toggle("is-visible", y > 620);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  var revealables = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     Budget bars — each need is drawn proportional to the largest item,
     so the visitor can see at a glance where the money goes.
     --------------------------------------------------------------------- */
  var bars = $$(".need__fill");
  if (bars.length) {
    var max = bars.reduce(function (m, el) {
      return Math.max(m, parseFloat(el.getAttribute("data-value")) || 0);
    }, 0);
    var drawBars = function () {
      bars.forEach(function (el) {
        var v = parseFloat(el.getAttribute("data-value")) || 0;
        el.style.inlineSize = max ? Math.max(6, (v / max) * 100) + "%" : "0%";
      });
    };
    var needsSection = $("#needs");
    if (!reduceMotion && "IntersectionObserver" in window && needsSection) {
      var bio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { drawBars(); bio.disconnect(); }
      }, { threshold: 0.2 });
      bio.observe(needsSection);
    } else {
      drawBars();
    }
  }

  /* ---------------------------------------------------------------------
     Giving levels — clicking a level fills in the amount on the form and
     scrolls the visitor straight to it.
     --------------------------------------------------------------------- */
  var amountField = $("#f-amount");
  $$("[data-tier]").forEach(function (tier) {
    tier.addEventListener("click", function () {
      $$("[data-tier]").forEach(function (t) { t.setAttribute("aria-pressed", "false"); });
      tier.setAttribute("aria-pressed", "true");
      if (amountField) {
        amountField.value = tier.getAttribute("data-tier");
        var form = $("#lead-form");
        if (form) {
          form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          window.setTimeout(function () { var n = $("#f-name"); if (n && !n.value) n.focus(); }, reduceMotion ? 0 : 620);
        }
      }
    });
  });

  /* ---------------------------------------------------------------------
     Donation-lead form
     --------------------------------------------------------------------- */
  var form = $("#lead-form");
  var status = $("#form-status");

  /* Accepts either a bare Formspree form ID ("mabcdefg") or a full URL, so it
     still works whichever of the two the troop pastes into config.js.
     Returns null while the placeholder is unset, which keeps the mailto
     fallback in play. */
  function resolveEndpoint() {
    var raw = CFG.formEndpoint || CFG.formspreeId || "";
    if (typeof raw !== "string") return null;
    raw = raw.trim();
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
    if (/^[A-Za-z0-9_-]{6,}$/.test(raw) && !/^x+$/i.test(raw)) {
      return "https://formspree.io/f/" + raw;
    }
    return null;
  }

  var ENDPOINT = resolveEndpoint();

  /* Point the form at Formspree natively too. If the submit handler below
     never binds — a script error, an old browser — the browser's own POST
     still reaches Formspree and the visitor lands on its thank-you page,
     rather than silently reloading and losing the lead. */
  if (form && ENDPOINT) form.setAttribute("action", ENDPOINT);

  var COPY = {
    sending: { he: "שולחים…", en: "Sending…" },
    ok: {
      he: "תודה! הפנייה נקלטה. נחזור אליכם בהקדם — בדרך כלל תוך יום או יומיים.",
      en: "Thank you! We've got your message and will be in touch — usually within a day or two."
    },
    mail: {
      he: "פתחנו עבורכם הודעת דוא\"ל עם כל הפרטים. רק לוחצים על 'שלח' והפנייה אצלנו. אם לא נפתח כלום, אפשר לכתוב ישירות אל ",
      en: "We've opened an email with all the details filled in — just press send. If nothing opened, write to us directly at "
    },
    err: {
      he: "משהו השתבש בשליחה. אפשר לנסות שוב, או פשוט לכתוב לנו אל ",
      en: "Something went wrong. Please try again, or simply email us at "
    },
    consent: {
      he: "כדי שנוכל לחזור אליכם, יש לאשר את יצירת הקשר.",
      en: "Please tick the box so we're allowed to get back to you."
    }
  };

  function t(key) { return COPY[key][currentLang()]; }

  function show(kind, html) {
    if (!status) return;
    status.className = "form-status " + (kind === "ok" ? "is-ok" : "is-err");
    status.innerHTML = html;
    status.setAttribute("role", kind === "ok" ? "status" : "alert");
    status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  }

  function mailLink() {
    var mail = CFG.email || "";
    return '<a href="mailto:' + mail + '">' + mail + "</a>";
  }

  function collect() {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (value, key) {
      if (data[key] === undefined) data[key] = value;
      else data[key] = [].concat(data[key], value).join(", ");
    });
    return data;
  }

  function composeMailto(data) {
    var isEn = currentLang() === "en";
    var subjectBase = isEn ? "Donation enquiry from the website" : "פנייה לתרומה מהאתר";
    var lines = [];
    var labels = {
      name:    isEn ? "Name" : "שם",
      email:   isEn ? "Email" : "אימייל",
      phone:   isEn ? "Phone" : "טלפון",
      org:     isEn ? "Organisation" : "ארגון",
      type:    isEn ? "Donor type" : "סוג התורם",
      help:    isEn ? "Would like to help with" : "מעוניין/ת לעזור ב",
      amount:  isEn ? "Amount in mind" : "סכום משוער",
      message: isEn ? "Message" : "הודעה"
    };
    Object.keys(labels).forEach(function (k) {
      if (data[k]) lines.push(labels[k] + ": " + data[k]);
    });
    return "mailto:" + encodeURIComponent(CFG.email || "") +
      "?subject=" + encodeURIComponent(subjectBase + (data.name ? " — " + data.name : "")) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var consent = $("#f-consent");
      if (consent && !consent.checked) {
        show("err", t("consent"));
        consent.focus();
        return;
      }
      if (!form.reportValidity()) return;

      var data = collect();
      data.lang = currentLang();
      data.page = location.href;

      /* Formspree reads these two: _subject titles the notification email,
         _replyto makes "Reply" in the troop's inbox go to the donor. */
      var isEn = currentLang() === "en";
      data._subject = (isEn ? "Donation enquiry from the website" : "פנייה לתרומה מהאתר") +
        (data.name ? " — " + data.name : "");
      if (data.email) data._replyto = data.email;

      var submitBtn = $("#f-submit");
      var originalHTML = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = t("sending"); }

      var restore = function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalHTML; }
      };

      // No endpoint configured yet → hand the lead to the visitor's mail client.
      if (!ENDPOINT) {
        window.location.href = composeMailto(data);
        show("ok", t("mail") + mailLink());
        restore();
        return;
      }

      // Formspree needs the Accept header, or it replies with its HTML
      // thank-you page instead of JSON.
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res.ok) return;
        // Formspree reports problems as {"errors":[{"message":"…"}]} —
        // surface the text so a wrong form ID is obvious, not mysterious.
        return res.json().catch(function () { return null; }).then(function (body) {
          var msg = body && body.errors && body.errors.length
            ? body.errors.map(function (e) { return e.message; }).join(", ")
            : "HTTP " + res.status;
          throw new Error(msg);
        });
      }).then(function () {
        show("ok", t("ok"));
        form.reset();
        $$("[data-tier]").forEach(function (tt) { tt.setAttribute("aria-pressed", "false"); });
      }).catch(function (err) {
        var detail = err && err.message
          ? ' <span style="opacity:.7">(' + String(err.message).slice(0, 120) + ")</span>"
          : "";
        show("err", t("err") + mailLink() + detail);
      }).finally(restore);
    });
  }

  /* ---------------------------------------------------------------------
     Fill contact details from the config so they only live in one place.
     --------------------------------------------------------------------- */
  $$("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    var value = key.split(".").reduce(function (o, k) { return o && o[k]; }, CFG);
    if (value === undefined || value === null) return;
    if (el.tagName === "A") {
      var href = el.getAttribute("data-cfg-href");
      if (href === "mailto") el.href = "mailto:" + value;
      else if (href === "tel") el.href = "tel:" + String(value).replace(/[^0-9+]/g, "");
      else if (href === "wa") el.href = "https://wa.me/" + value;
      else el.href = value;
    }
    if (el.hasAttribute("data-cfg-text")) el.textContent = value;
  });

  var waLinks = $$("[data-wa]");
  if (waLinks.length && CFG.whatsapp) {
    waLinks.forEach(function (a) {
      var msgHe = "שלום, הגעתי דרך האתר של צופי ים בת ים ואשמח לשמוע איך אפשר לתרום.";
      var msgEn = "Hello, I found the Sea Scouts of Bat Yam website and I'd like to hear how I can support you.";
      a.addEventListener("click", function () {
        a.href = "https://wa.me/" + CFG.whatsapp + "?text=" +
          encodeURIComponent(currentLang() === "en" ? msgEn : msgHe);
      });
      a.href = "https://wa.me/" + CFG.whatsapp;
    });
  }

  /* Current year in the footer (both language copies). */
  var thisYear = String(new Date().getFullYear());
  $$("[data-year]").forEach(function (el) { el.textContent = thisYear; });
})();
