// PageGen — Search, Filter & Lazy YouTube
(function () {
  "use strict";

  // ── Index page: Search + Filter ──────────────────────────
  var searchInput = document.getElementById("search-input");
  var cardGrid = document.getElementById("card-grid");
  var noResults = document.getElementById("no-results");

  if (searchInput && cardGrid) {
    var cards = Array.from(cardGrid.querySelectorAll(":scope > li"));
    var filters = Array.from(document.querySelectorAll("[data-filter]"));
    var filterStatus = document.getElementById("filter-status");
    var filterStatusText = document.getElementById("filter-status-text");
    var clearFilters = document.getElementById("clear-filters");
    var total = cards.length;

    function applyFilters() {
      var query = searchInput.value.toLowerCase().trim();
      var visible = 0;

      var hasActiveFilter = !!query || filters.some(function (s) { return s.value !== ""; });

      cards.forEach(function (card) {
        var title = card.getAttribute("data-title") || "";
        var desc = card.getAttribute("data-description") || "";
        var matchesSearch = !query || title.indexOf(query) !== -1 || desc.indexOf(query) !== -1;

        var matchesFilters = true;
        filters.forEach(function (select) {
          var prop = select.getAttribute("data-filter");
          var val = select.value;
          if (val) {
            var cardVal = card.getAttribute("data-" + prop) || "";
            if (cardVal !== val) matchesFilters = false;
          }
        });

        if (matchesSearch && matchesFilters) {
          card.style.display = "";
          visible++;
        } else {
          card.style.display = "none";
        }
      });

      if (noResults) {
        noResults.style.display = visible === 0 ? "block" : "none";
        noResults.classList.toggle("hidden", visible !== 0);
      }

      if (filterStatus) {
        if (hasActiveFilter) {
          filterStatus.classList.remove("hidden");
          filterStatusText.textContent = "Showing " + visible + " of " + total;
        } else {
          filterStatus.classList.add("hidden");
        }
      }
    }

    searchInput.addEventListener("input", applyFilters);
    filters.forEach(function (select) {
      select.addEventListener("change", applyFilters);
    });

    if (clearFilters) {
      clearFilters.addEventListener("click", function () {
        searchInput.value = "";
        filters.forEach(function (select) { select.value = ""; });
        applyFilters();
      });
    }
  }

  // ── All pages: Lurepedia ad banner ───────────────────────
  var AD_TEXTS = {
    en: { label: "Ad", tagline: "Find the right lure for every catch", cta: "Explore Lurepedia" },
    de: { label: "Anzeige", tagline: "Finde den richtigen Köder für jeden Fang", cta: "Lurepedia entdecken" },
    fr: { label: "Publicité", tagline: "Trouvez le bon leurre pour chaque prise", cta: "Découvrir Lurepedia" },
    es: { label: "Anuncio", tagline: "Encuentra el señuelo perfecto para cada captura", cta: "Explora Lurepedia" },
    bg: { label: "Реклама", tagline: "Открий правилната примамка за всеки улов", cta: "Разгледай Lurepedia" },
    el: { label: "Διαφήμιση", tagline: "Βρες το σωστό δόλωμα για κάθε ψάρεμα", cta: "Εξερεύνησε το Lurepedia" },
    zh: { label: "广告", tagline: "为每次垂钓找到合适的路亚饵", cta: "探索 Lurepedia" },
    ja: { label: "広告", tagline: "釣果につながるルアー選びを", cta: "Lurepediaを見る" },
    ru: { label: "Реклама", tagline: "Подберите правильную приманку для любой рыбалки", cta: "Смотреть Lurepedia" },
    nl: { label: "Advertentie", tagline: "Vind het juiste kunstaas voor elke vangst", cta: "Ontdek Lurepedia" },
    pt: { label: "Anúncio", tagline: "Encontre a isca certa para cada pescaria", cta: "Explorar a Lurepedia" },
    it: { label: "Annuncio", tagline: "Trova l'esca giusta per ogni cattura", cta: "Scopri Lurepedia" },
    tr: { label: "Reklam", tagline: "Her av için doğru yapay yemi bulun", cta: "Lurepedia'yı keşfet" },
    hi: { label: "विज्ञापन", tagline: "हर मछली के लिए सही लूर खोजें", cta: "Lurepedia देखें" }
  };

  var lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  var adText = AD_TEXTS[lang] || AD_TEXTS.en;

  var adStyle = document.createElement("style");
  adStyle.textContent =
    "#lurepedia-ad-panel{transition:transform .3s ease,opacity .3s ease}" +
    "#lurepedia-ad-panel.collapsed{transform:translateY(120%);opacity:0;pointer-events:none}" +
    "#lurepedia-ad-pill{transition:transform .3s ease,opacity .3s ease}" +
    "#lurepedia-ad-pill.collapsed{transform:translateY(200%);opacity:0;pointer-events:none}";
  document.head.appendChild(adStyle);

  var ad = document.createElement("aside");
  ad.id = "lurepedia-ad";
  ad.setAttribute("aria-label", adText.label);
  ad.className = "fixed inset-x-0 bottom-0 z-40 pointer-events-none";
  ad.innerHTML =
    '<div id="lurepedia-ad-panel" class="pointer-events-auto max-w-screen-md mx-auto pl-4 pr-16 sm:px-4 pb-4">' +
    '<div class="relative rounded-xl border border-gray-200 bg-white shadow-lg">' +
    '<button id="lurepedia-ad-collapse" aria-label="Collapse" title="Collapse"' +
    ' class="absolute -top-2.5 -right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow text-gray-400 hover:text-gray-600 cursor-pointer">' +
    '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>' +
    "</button>" +
    '<div class="text-right text-[10px] uppercase tracking-wide text-gray-400 pt-1.5 pr-3">' + adText.label + "</div>" +
    '<a href="https://lurepedia.com" target="_blank" rel="sponsored noopener"' +
    ' class="group flex items-center gap-4 px-4 pb-3 pt-1">' +
    '<span class="text-3xl shrink-0" aria-hidden="true">🎣</span>' +
    '<span class="flex-1 min-w-0">' +
    '<span class="block text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Lurepedia</span>' +
    '<span class="block text-sm text-gray-600">' + adText.tagline + "</span>" +
    "</span>" +
    '<span class="hidden sm:inline-flex shrink-0 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow group-hover:bg-indigo-500 transition">' +
    adText.cta +
    "</span>" +
    "</a>" +
    "</div>" +
    "</div>" +
    '<button id="lurepedia-ad-pill" aria-label="' + adText.cta + '"' +
    ' class="collapsed pointer-events-auto fixed bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur shadow-md border border-gray-200/80 pl-2 pr-3 py-1.5 hover:shadow-lg cursor-pointer">' +
    '<span aria-hidden="true">🎣</span>' +
    '<span class="text-sm font-medium text-gray-700">Lurepedia</span>' +
    '<span class="text-[9px] uppercase tracking-wide text-gray-400">' + adText.label + "</span>" +
    "</button>";
  document.body.appendChild(ad);

  var adPanel = document.getElementById("lurepedia-ad-panel");
  var adPill = document.getElementById("lurepedia-ad-pill");
  var adPinned = false;

  function setAdCollapsed(collapsed) {
    adPanel.classList.toggle("collapsed", collapsed);
    adPill.classList.toggle("collapsed", !collapsed);
    document.body.style.paddingBottom = collapsed ? "" : adPanel.offsetHeight + "px";
  }
  setAdCollapsed(false);
  window.addEventListener("load", function () {
    if (!adPanel.classList.contains("collapsed")) setAdCollapsed(false);
  });

  var adStartY = window.scrollY;
  window.addEventListener("scroll", function () {
    if (adPinned) return;
    if (Math.abs(window.scrollY - adStartY) > 60) setAdCollapsed(true);
  }, { passive: true });

  adPill.addEventListener("click", function () {
    adPinned = true;
    setAdCollapsed(false);
  });

  document.getElementById("lurepedia-ad-collapse").addEventListener("click", function () {
    adPinned = true;
    setAdCollapsed(true);
  });

  // ── Detail page: Lazy YouTube ────────────────────────────
  var player = document.getElementById("video-player");
  if (player) {
    player.addEventListener("click", function () {
      var url = player.getAttribute("data-video-url");
      if (!url) return;
      var sep = url.indexOf("?") !== -1 ? "&" : "?";
      var iframe = document.createElement("iframe");
      iframe.src = url + sep + "autoplay=1";
      iframe.className = "w-full h-full absolute inset-0";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      iframe.setAttribute("allowfullscreen", "");
      player.innerHTML = "";
      player.appendChild(iframe);
      player.style.cursor = "default";
    });
  }
})();
