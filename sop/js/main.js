(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var duration = reduced ? 0 : 480;
  var mobileQuery = window.matchMedia("(max-width: 800px)");

  function storyById(id) {
    return window.STORIES.find(function (story) { return story.id === id; });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function themeMatch(story, theme) {
    return theme === "all" || story.themes.indexOf(theme) !== -1;
  }

  function countLabel(theme, matches) {
    var total = window.STORIES.length;
    if (theme === "all") return total + (total === 1 ? " story" : " stories");
    return matches + " of " + total + " · " + theme;
  }

  function fillMotifs(root) {
    (root || document).querySelectorAll("[data-motif]").forEach(function (node) {
      if (node.querySelector("svg")) return;
      var svg = window.MOTIFS[node.getAttribute("data-motif")];
      if (svg) node.insertAdjacentHTML("beforeend", svg);
    });
  }

  function initChrome() {
    document.querySelectorAll("[data-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });

    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  function cardHtml(story, level) {
    var tag = level || "h2";
    return (
      '<a class="card" href="story.html?id=' + story.id + '">' +
        '<div class="motif motif--' + story.motif + '">' + window.MOTIFS[story.motif] + "</div>" +
        '<div class="card__body">' +
          '<p class="card__index">' + story.index + "</p>" +
          "<" + tag + ">" + escapeHtml(story.title) + "</" + tag + ">" +
          '<p class="card__place">' + escapeHtml(story.place) + " · " + escapeHtml(story.locality) + "</p>" +
          '<p class="card__excerpt">' + escapeHtml(story.dek) + "</p>" +
          '<p class="card__themes">' + story.themes.map(function (theme) {
            return "<span>" + escapeHtml(theme) + "</span>";
          }).join("") + "</p>" +
        "</div>" +
      "</a>"
    );
  }

  function renderChips(container, current) {
    var items = ["all"].concat(window.THEMES);
    container.innerHTML = items.map(function (theme) {
      var label = theme === "all" ? "All" : theme;
      var on = theme === current;
      return (
        '<button type="button" class="chip' + (on ? " is-on" : "") + '" data-theme="' + theme + '" aria-pressed="' + on + '">' +
          label +
        "</button>"
      );
    }).join("");
  }

  function paintChips(container, current) {
    container.querySelectorAll(".chip").forEach(function (button) {
      var on = button.getAttribute("data-theme") === current;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function markerSrc(state) {
    var svg;
    if (state === "selected") {
      svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">' +
          '<circle cx="23" cy="23" r="11" fill="#1E3A2B"/>' +
          '<circle cx="23" cy="23" r="15.5" fill="none" stroke="#E4C57A" stroke-width="2.4"/>' +
          '<circle cx="23" cy="23" r="4" fill="#E4C57A"/>' +
        "</svg>";
    } else {
      var opacity = state === "dim" ? "0.38" : "1";
      svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">' +
          '<g opacity="' + opacity + '">' +
            '<circle cx="23" cy="25" r="13" fill="rgba(20,30,24,0.16)"/>' +
            '<circle cx="23" cy="23" r="12" fill="#FFFcf7" stroke="#1E3A2B" stroke-width="2"/>' +
            '<circle cx="23" cy="23" r="3.6" fill="#A6843D"/>' +
          "</g>" +
        "</svg>";
    }
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function controlDefaults(options) {
    var factory = ol.control.defaults;
    if (factory && factory.defaults) return factory.defaults(options);
    return factory(options);
  }

  function interactionDefaults(options) {
    var factory = ol.interaction.defaults;
    if (factory && factory.defaults) return factory.defaults(options);
    return factory(options);
  }

  function initMapPage() {
    var mapEl = document.getElementById("map");
    var panel = document.getElementById("panel");
    var list = document.getElementById("story-list");
    var chips = document.getElementById("map-chips");
    var count = document.getElementById("count");
    var popup = document.getElementById("popup");
    var toggle = document.getElementById("panel-toggle");
    var reset = document.getElementById("reset-map");
    var theme = "all";
    var selectedId = null;
    var map;
    var view;
    var source;
    var overlay;

    renderChips(chips, theme);
    renderRows();

    chips.addEventListener("click", function (event) {
      var button = event.target.closest(".chip");
      if (!button) return;
      applyTheme(button.getAttribute("data-theme"), true);
    });

    list.addEventListener("click", function (event) {
      var button = event.target.closest(".story-row__select");
      if (!button) return;
      selectStory(button.getAttribute("data-id"));
    });

    if (toggle) {
      toggle.addEventListener("click", function (event) {
        event.stopPropagation();
        setCollapsed(!panel.classList.contains("is-collapsed"));
      });
    }

    var headingRow = document.querySelector(".panel__heading-row");
    if (headingRow) {
      headingRow.addEventListener("click", function () {
        if (!mobileQuery.matches) return;
        setCollapsed(!panel.classList.contains("is-collapsed"));
      });
    }

    if (reset) {
      reset.addEventListener("click", function () {
        selectedId = null;
        theme = "all";
        paintChips(chips, theme);
        clearPopup();
        refreshStyles();
        renderRows();
        updateCount();
        fitVisible();
        writeParams();
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        selectedId = null;
        clearPopup();
        refreshStyles();
        renderRows();
        writeParams();
      }
    });

    if (mobileQuery.matches) setCollapsed(true);

    mobileQuery.addEventListener("change", function (event) {
      if (!event.matches) setCollapsed(false);
      if (map) window.setTimeout(function () { map.updateSize(); fitVisible(); }, 80);
    });

    if (!window.ol || !mapEl) {
      if (mapEl) {
        mapEl.innerHTML = '<p class="map-fallback">Open this page with a network connection to load the map. The story list is still available.</p>';
      }
      return;
    }

    popup.addEventListener("click", function (event) {
      if (event.target.closest(".popup__close")) {
        selectedId = null;
        clearPopup();
        refreshStyles();
        renderRows();
        writeParams();
      }
    });

    source = new ol.source.Vector({
      features: window.STORIES.map(function (story) {
        var feature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([story.lng, story.lat])),
          storyId: story.id
        });
        feature.setId(story.id);
        return feature;
      })
    });

    view = new ol.View({
      center: ol.proj.fromLonLat([-114.4, 53.4]),
      zoom: 5,
      maxZoom: 16,
      enableRotation: false
    });

    map = new ol.Map({
      target: mapEl,
      layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        new ol.layer.Vector({ source: source, updateWhileAnimating: true })
      ],
      view: view,
      controls: controlDefaults({ attribution: true, rotate: false, zoom: true }),
      interactions: interactionDefaults({ altShiftDragRotate: false, pinchRotate: false })
    });

    overlay = new ol.Overlay({
      element: popup,
      positioning: "bottom-center",
      offset: [0, -18],
      stopEvent: true,
      autoPan: reduced ? false : { animation: { duration: 250 }, margin: 24 }
    });
    map.addOverlay(overlay);

    map.on("singleclick", function (event) {
      var feature = map.forEachFeatureAtPixel(event.pixel, function (item) { return item; }, { hitTolerance: 8 });
      if (!feature) {
        selectedId = null;
        clearPopup();
        refreshStyles();
        renderRows();
        writeParams();
        return;
      }
      selectStory(feature.get("storyId"));
    });

    map.on("pointermove", function (event) {
      if (event.dragging) return;
      var hit = map.hasFeatureAtPixel(event.pixel, { hitTolerance: 8 });
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });

    var params = new URLSearchParams(window.location.search);
    var themeParam = params.get("theme");
    var storyParam = params.get("story");
    if (themeParam && window.THEMES.indexOf(themeParam) !== -1) {
      theme = themeParam;
      paintChips(chips, theme);
    }

    refreshStyles();
    renderRows();
    updateCount();
    fitVisible();

    if (storyParam && storyById(storyParam)) {
      window.setTimeout(function () { selectStory(storyParam); }, reduced ? 0 : 250);
    }

    window.addEventListener("resize", function () {
      if (!map) return;
      map.updateSize();
      if (!selectedId) fitVisible();
    });

    function matchingStories() {
      return window.STORIES.filter(function (story) { return themeMatch(story, theme); });
    }

    function fitPadding() {
      if (mobileQuery.matches) {
        var panelHeight = 110;
        if (panel && !panel.classList.contains("is-collapsed")) {
          panelHeight = Math.min(panel.getBoundingClientRect().height, window.innerHeight * 0.55);
        }
        return [68, 24, panelHeight + 20, 24];
      }
      var panelWidth = panel ? panel.getBoundingClientRect().width : 380;
      return [72, 96, 64, panelWidth + 40];
    }

    function fitVisible() {
      var stories = matchingStories();
      if (!stories.length) return;
      var features = stories.map(function (story) { return source.getFeatureById(story.id); }).filter(Boolean);
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      features.forEach(function (feature) {
        var extent = feature.getGeometry().getExtent();
        minX = Math.min(minX, extent[0]);
        minY = Math.min(minY, extent[1]);
        maxX = Math.max(maxX, extent[2]);
        maxY = Math.max(maxY, extent[3]);
      });
      view.fit([minX, minY, maxX, maxY], {
        padding: fitPadding(),
        maxZoom: features.length === 1 ? 9 : 6.4,
        duration: duration
      });
    }

    function refreshStyles() {
      if (!source) return;
      source.getFeatures().forEach(function (feature) {
        var id = feature.get("storyId");
        var story = storyById(id);
        var dimmed = !themeMatch(story, theme) && id !== selectedId;
        var state = id === selectedId ? "selected" : dimmed ? "dim" : "on";
        feature.setStyle(new ol.style.Style({
          image: new ol.style.Icon({
            src: markerSrc(state),
            anchor: [0.5, 0.5],
            scale: id === selectedId ? 1.12 : 1
          }),
          zIndex: id === selectedId ? 5 : 1
        }));
      });
    }

    function renderRows() {
      list.innerHTML = window.STORIES.map(function (story) {
        var dimmed = !themeMatch(story, theme);
        var selected = story.id === selectedId;
        return (
          '<div class="story-row' + (selected ? " is-selected" : "") + (dimmed ? " is-dim" : "") + '" data-id="' + story.id + '">' +
            '<button type="button" class="story-row__select" data-id="' + story.id + '">' +
              '<span class="story-row__index">' + story.index + "</span>" +
              "<span>" +
                '<span class="story-row__title">' + escapeHtml(story.title) + "</span>" +
                '<span class="story-row__meta">' + escapeHtml(story.locality) + "</span>" +
              "</span>" +
            "</button>" +
            '<a class="text-link story-row__open" href="story.html?id=' + story.id + '">View story</a>' +
          "</div>"
        );
      }).join("");
    }

    function updateCount() {
      count.textContent = countLabel(theme, matchingStories().length);
      if (toggle) {
        var label = toggle.querySelector(".sr-only");
        if (label) label.textContent = panel.classList.contains("is-collapsed") ? "Show stories" : "Hide stories";
      }
    }

    function popupHtml(story) {
      return (
        '<button type="button" class="popup__close" aria-label="Close">×</button>' +
        '<div class="motif motif--' + story.motif + ' popup__motif">' + window.MOTIFS[story.motif] + "</div>" +
        '<div class="popup__body">' +
          '<p class="popup__index">' + story.index + "</p>" +
          "<h2>" + escapeHtml(story.title) + "</h2>" +
          '<p class="popup__place">' + escapeHtml(story.place) + " · " + escapeHtml(story.locality) + "</p>" +
          '<p class="popup__excerpt">' + escapeHtml(story.dek) + "</p>" +
          '<a class="text-link" href="story.html?id=' + story.id + '">View story</a>' +
        "</div>"
      );
    }

    function clearPopup() {
      if (overlay) overlay.setPosition(undefined);
      popup.hidden = true;
    }

    function nudge(coord) {
      var resolution = view.getResolution() || 1;
      if (mobileQuery.matches) {
        var lift = Math.min(window.innerHeight * 0.16, 140) * resolution;
        return [coord[0], coord[1] + lift];
      }
      var panelWidth = panel.getBoundingClientRect().width;
      return [coord[0] - (panelWidth / 2) * resolution, coord[1] + 70 * resolution];
    }

    function selectStory(id) {
      var story = storyById(id);
      var feature = source.getFeatureById(id);
      if (!story || !feature) return;
      selectedId = id;
      refreshStyles();
      renderRows();
      var coord = feature.getGeometry().getCoordinates();
      view.animate({
        center: nudge(coord),
        zoom: Math.max(view.getZoom() || 5, mobileQuery.matches ? 6.2 : 7.1),
        duration: duration
      });

      if (mobileQuery.matches) {
        clearPopup();
        setCollapsed(false);
        var row = list.querySelector('.story-row[data-id="' + id + '"]');
        if (row && row.scrollIntoView) row.scrollIntoView({ block: "nearest" });
      } else {
        popup.hidden = false;
        popup.innerHTML = popupHtml(story);
        overlay.setPosition(coord);
      }
      writeParams();
    }

    function applyTheme(next, refit) {
      theme = next;
      paintChips(chips, theme);
      if (selectedId) {
        var current = storyById(selectedId);
        if (current && !themeMatch(current, theme)) {
          selectedId = null;
          clearPopup();
        }
      }
      refreshStyles();
      renderRows();
      updateCount();
      if (refit) fitVisible();
      writeParams();
    }

    function writeParams() {
      var url = new URL(window.location.href);
      if (theme === "all") url.searchParams.delete("theme");
      else url.searchParams.set("theme", theme);
      if (selectedId) url.searchParams.set("story", selectedId);
      else url.searchParams.delete("story");
      window.history.replaceState(null, "", url);
    }

    function setCollapsed(collapsed) {
      if (!mobileQuery.matches) collapsed = false;
      panel.classList.toggle("is-collapsed", collapsed);
      if (toggle) toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
      updateCount();
      if (map) {
        window.setTimeout(function () { map.updateSize(); }, 60);
      }
    }
  }

  function initStoriesPage() {
    var grid = document.getElementById("card-grid");
    var chips = document.getElementById("story-chips");
    var count = document.getElementById("story-count");
    var empty = document.getElementById("empty");
    var params = new URLSearchParams(window.location.search);
    var theme = params.get("theme");
    if (!theme || (theme !== "all" && window.THEMES.indexOf(theme) === -1)) theme = "all";

    renderChips(chips, theme);
    paint();

    chips.addEventListener("click", function (event) {
      var button = event.target.closest(".chip");
      if (!button) return;
      theme = button.getAttribute("data-theme");
      paintChips(chips, theme);
      paint();
      var url = new URL(window.location.href);
      if (theme === "all") url.searchParams.delete("theme");
      else url.searchParams.set("theme", theme);
      window.history.replaceState(null, "", url);
    });

    function paint() {
      var matches = window.STORIES.filter(function (story) { return themeMatch(story, theme); });
      grid.innerHTML = window.STORIES.map(function (story) {
        return cardHtml(story, "h2");
      }).join("");
      Array.prototype.forEach.call(grid.children, function (card, index) {
        card.hidden = !themeMatch(window.STORIES[index], theme);
      });
      count.textContent = countLabel(theme, matches.length);
      empty.hidden = matches.length !== 0;
    }
  }

  function initStoryPage() {
    var root = document.getElementById("content");
    var params = new URLSearchParams(window.location.search);
    var story = storyById(params.get("id")) || window.STORIES[0];
    document.title = story.title + " — Indigenous Stories of Philosophy";

    var others = window.STORIES.filter(function (item) { return item.id !== story.id; }).slice(0, 3);
    var paragraphs = story.body.map(function (paragraph) { return "<p>" + escapeHtml(paragraph) + "</p>"; });
    var article = paragraphs[0] +
      "<blockquote><p>" + escapeHtml(story.quote) + "</p></blockquote>" +
      paragraphs.slice(1).join("") +
      '<p class="sample-note">Sample passage for this interface mockup. It stands in for the researched account and does not record a traditional story.</p>';

    root.innerHTML =
      '<header class="story-hero motif motif--scrim motif--' + story.motif + '">' +
        window.MOTIFS[story.motif] +
        '<div class="story-hero__inner">' +
          '<nav class="crumbs" aria-label="Breadcrumb">' +
            '<a href="index.html">Map</a><span aria-hidden="true">/</span>' +
            '<a href="stories.html">Stories</a><span aria-hidden="true">/</span>' +
            "<span>" + escapeHtml(story.title) + "</span>" +
          "</nav>" +
          '<p class="story-hero__index">' + story.index + " · " + escapeHtml(story.locality) + "</p>" +
          "<h1>" + escapeHtml(story.title) + "</h1>" +
          '<p class="dek">' + escapeHtml(story.dek) + "</p>" +
        "</div>" +
      "</header>" +
      '<div class="meta-strip">' +
        '<dl class="meta-strip__inner">' +
          "<div><dt>Place</dt><dd>" + escapeHtml(story.place) + "</dd></div>" +
          "<div><dt>Locality</dt><dd>" + escapeHtml(story.locality) + "</dd></div>" +
          "<div><dt>Setting</dt><dd>" + escapeHtml(story.setting) + "</dd></div>" +
          "<div><dt>Themes</dt><dd>" + story.themes.map(escapeHtml).join(" · ") + "</dd></div>" +
        "</dl>" +
      "</div>" +
      '<div class="story-layout">' +
        '<article class="story-copy">' + article + "</article>" +
        '<aside class="story-aside">' +
          '<div id="story-map" class="story-map" role="region" aria-label="Locator map for ' + escapeHtml(story.place) + '"></div>' +
          '<a class="text-link" href="index.html?story=' + story.id + '">Show on the map</a>' +
          '<div class="reserved">' +
            '<p class="eyebrow">Held for the research record</p>' +
            "<ul>" +
              "<li><span>Nation or community</span><em>To be confirmed</em></li>" +
              "<li><span>Language</span><em>To be confirmed</em></li>" +
              "<li><span>Further categories</span><em>To be confirmed</em></li>" +
            "</ul>" +
            "<p>These fields are reserved for categorical metadata still being defined. Once confirmed, they can be shown here and used as themes on the map.</p>" +
          "</div>" +
        "</aside>" +
      "</div>" +
      '<section class="related">' +
        '<div class="related__inner">' +
          "<h2>Other stories</h2>" +
          '<div class="card-grid card-grid--related">' +
            others.map(function (item) { return cardHtml(item, "h3"); }).join("") +
          "</div>" +
        "</div>" +
      "</section>";

    if (!window.ol) return;

    var center = ol.proj.fromLonLat([story.lng, story.lat]);
    var feature = new ol.Feature({ geometry: new ol.geom.Point(center) });
    feature.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
        src: markerSrc("selected"),
        anchor: [0.5, 0.5]
      })
    }));

    new ol.Map({
      target: "story-map",
      layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        new ol.layer.Vector({ source: new ol.source.Vector({ features: [feature] }) })
      ],
      view: new ol.View({ center: center, zoom: 8, enableRotation: false, maxZoom: 16 }),
      controls: controlDefaults({ attribution: true, zoom: false, rotate: false }),
      interactions: interactionDefaults({
        altShiftDragRotate: false,
        pinchRotate: false,
        mouseWheelZoom: false
      })
    });
  }

  fillMotifs(document);
  initChrome();

  var page = document.body.getAttribute("data-page");
  if (page === "map") initMapPage();
  if (page === "stories") initStoriesPage();
  if (page === "story") initStoryPage();
})();
