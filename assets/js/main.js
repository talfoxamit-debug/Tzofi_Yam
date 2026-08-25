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

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-stuck", y > 40);
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
      phone:   isEn ? "Phone" : "טלפון",
      email:   isEn ? "Email" : "אימייל",
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
  function cfgValue(path) {
    return path.split(".").reduce(function (o, k) { return o && o[k]; }, CFG);
  }

  /* Anything marked data-requires="some.config.path" is removed unless that
     path holds a real value. Sections the troop hasn't filled in yet — the
     video, the founding year, the US tax details — simply don't appear,
     so an unverified claim can never reach the page. */
  $$("[data-requires]").forEach(function (el) {
    var v = cfgValue(el.getAttribute("data-requires"));
    if (v === undefined || v === null || v === false || v === "") el.remove();
  });

  $$("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    var value = cfgValue(key);
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

  /* ---------------------------------------------------------------------
     Video — a click-to-play facade rather than a YouTube iframe on load.
     The iframe pulls ~1MB and sets cookies before anyone has decided to
     watch; a thumbnail costs a few KB. The real player is only inserted
     once someone actually presses play.
     --------------------------------------------------------------------- */
  (function video() {
    var mount = $("#video-mount");
    if (!mount) return;                        // removed by data-requires
    var raw = String(CFG.youtubeId || "").trim();
    // Accept a bare ID or any of YouTube's URL shapes.
    var m = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    var id = m ? m[1] : (/^[A-Za-z0-9_-]{6,}$/.test(raw) ? raw : null);
    if (!id) { mount.remove(); return; }

    var thumb = document.createElement("img");
    thumb.src = "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";
    thumb.alt = "";
    thumb.loading = "lazy";
    // Not every upload has a maxres thumbnail; fall back rather than break.
    thumb.addEventListener("error", function () {
      thumb.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    }, { once: true });

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "video__play";
    btn.setAttribute("aria-label", currentLang() === "en" ? "Play video" : "נגן סרטון");
    btn.setAttribute("data-en-attr", "aria-label: Play video");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">' +
                    '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';

    btn.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      frame.title = currentLang() === "en" ? "Sea Scouts of Bat Yam" : "צופי ים בת ים";
      frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      frame.allowFullscreen = true;
      frame.setAttribute("frameborder", "0");
      mount.replaceChildren(frame);
    });

    mount.replaceChildren(thumb, btn);
  })();

  /* ---------------------------------------------------------------------
     Personalised links. The page is sent one-to-one, so ?to=דוד opens with
     a line addressed to that person. Written with textContent, never
     innerHTML — the value comes from a URL anyone can edit.
     --------------------------------------------------------------------- */
  (function greeting() {
    var host = $("#greeting");
    if (!host) return;
    var name = "";
    try {
      name = (new URLSearchParams(location.search).get("to") || "").trim();
    } catch (e) { /* very old browser */ }
    if (!name || name.length > 40) { host.remove(); return; }
    $$("[data-greet-name]", host).forEach(function (el) { el.textContent = name; });
    host.hidden = false;
  })();

  /* Current year in the footer (both language copies). */
  var thisYear = String(new Date().getFullYear());
  $$("[data-year]").forEach(function (el) { el.textContent = thisYear; });
})();
