(function () {
  "use strict";

  var LANGUAGES = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
    { code: "uk", label: "Українська" },
    { code: "de", label: "Deutsch" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "it", label: "Italiano" },
    { code: "pt", label: "Português" },
    { code: "pl", label: "Polski" },
    { code: "tr", label: "Türkçe" },
    { code: "ar", label: "العربية" },
    { code: "he", label: "עברית" },
    { code: "zh", label: "中文" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" }
  ];

  var RTL_LANGS = ["ar", "he"];
  var T = window.REIKI_TRANSLATIONS || {};

  var langSwitcher = document.querySelector(".lang-switcher");
  var langBtn = document.querySelector(".lang-btn");
  var langMenu = document.querySelector(".lang-menu");
  var langCurrent = document.querySelector(".lang-current");
  var themeBtns = document.querySelectorAll(".theme-btn");
  var i18nEls = document.querySelectorAll("[data-i18n]");

  function buildLangMenu() {
    langMenu.innerHTML = "";
    LANGUAGES.forEach(function (lang) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = lang.label;
      btn.dataset.lang = lang.code;
      btn.addEventListener("click", function () {
        setLanguage(lang.code);
        closeLangMenu();
      });
      li.appendChild(btn);
      langMenu.appendChild(li);
    });
  }

  function getLangLabel(code) {
    var found = LANGUAGES.find(function (l) { return l.code === code; });
    return found ? found.label : code;
  }

  function setLanguage(code) {
    if (!T[code]) code = "en";
    var texts = T[code];

    document.body.dataset.lang = code;
    document.documentElement.lang = code;
    document.body.dir = RTL_LANGS.indexOf(code) !== -1 ? "rtl" : "ltr";
    langCurrent.textContent = getLangLabel(code);

    langMenu.querySelectorAll("button").forEach(function (btn) {
      btn.classList.toggle("selected", btn.dataset.lang === code);
    });

    i18nEls.forEach(function (el) {
      var key = el.dataset.i18n;
      if (texts[key]) el.textContent = texts[key];
    });

    document.title = texts.title + " " + texts.subtitle;
    localStorage.setItem("reiki-lang", code);
  }

  function setTheme(theme) {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add("theme-" + theme);
    themeBtns.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });
    localStorage.setItem("reiki-theme", theme);
  }

  function openLangMenu() {
    langMenu.hidden = false;
    langBtn.setAttribute("aria-expanded", "true");
  }

  function closeLangMenu() {
    langMenu.hidden = true;
    langBtn.setAttribute("aria-expanded", "false");
  }

  langBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (langMenu.hidden) openLangMenu();
    else closeLangMenu();
  });

  document.addEventListener("click", function (e) {
    if (!langSwitcher.contains(e.target)) closeLangMenu();
  });

  themeBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setTheme(btn.dataset.theme);
    });
  });

  buildLangMenu();
  setLanguage(localStorage.getItem("reiki-lang") || "en");
  setTheme(localStorage.getItem("reiki-theme") || "light");
})();
