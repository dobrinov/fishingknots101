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
