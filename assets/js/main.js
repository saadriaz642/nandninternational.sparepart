/* N&N International @ ASH Spare Parts — vendor directory
   Data: window.NN_VENDORS from assets/js/vendors.js (525 shops).
   Category / specialization are keyword-derived from each vendor's
   `parts` text via window.NN_deriveCategories (catalog.js). A vendor's
   PRIMARY category is its first match in catalog order; vendors matching
   none are "General Spare Parts". A vendor can match several
   specializations. No vendor field is invented: a missing phone, address
   or parts value is simply omitted from the card and the modal. */
(function () {
  var PAGE_SIZE = 24;
  var state = { q: "", category: "", specialization: "", city: "", sort: "az", page: 1 };
  var enriched = [];
  var grid, countEl, emptyEl, paginationEl;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function initials(name) {
    var words = String(name || "").split(/[\s()\-]+/).filter(Boolean);
    var out = words.slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
    return out || "N";
  }
  function phoneOf(v) {
    if (v.phoneTel && v.phone) return { display: v.phone, tel: v.phoneTel };
    if (v.phones && v.phones.length) return { display: v.phones[0].display, tel: v.phones[0].tel };
    return null;
  }
  function whatsappOf(v) {
    if (v.whatsappLink) return v.whatsappLink;
    if (v.whatsapp) {
      var digits = String(v.whatsapp).replace(/\D/g, "");
      if (digits.charAt(0) === "0") digits = "92" + digits.slice(1);
      return "https://wa.me/" + digits;
    }
    return null;
  }

  function enrich() {
    enriched = (window.NN_VENDORS || []).map(function (v) {
      var cats = window.NN_deriveCategories ? window.NN_deriveCategories(v.parts) : [];
      return {
        v: v,
        categories: cats,
        primary: cats.length ? cats[0] : "general-spare-parts",
        searchText: ((v.name || "") + " " + (v.parts || "") + " " + (v.address || "") + " " + (v.city || "")).toLowerCase()
      };
    });
  }

  function filtered() {
    var list = enriched.filter(function (item) {
      var v = item.v;
      if (state.q && item.searchText.indexOf(state.q) === -1) return false;
      if (state.category && item.primary !== state.category) return false;
      if (state.specialization && item.categories.indexOf(state.specialization) === -1) return false;
      if (state.city && v.city !== state.city) return false;
      return true;
    });
    list.sort(function (a, b) {
      var an = (a.v.name || "").toLowerCase(), bn = (b.v.name || "").toLowerCase();
      if (an < bn) return state.sort === "az" ? -1 : 1;
      if (an > bn) return state.sort === "az" ? 1 : -1;
      return 0;
    });
    return list;
  }

  function render() {
    if (!grid) return;
    var list = filtered();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = list.slice(start, start + PAGE_SIZE);
    grid.innerHTML = "";
    pageItems.forEach(function (item) {
      var v = item.v;
      var card = document.createElement("article");
      card.className = "vendor-card";
      var tags = item.categories.length
        ? item.categories.map(function (c) { return '<span class="tag">' + esc(window.NN_categoryLabel(c)) + "</span>"; }).join("")
        : '<span class="tag tag-general">General Spare Parts</span>';
      var phone = phoneOf(v);
      var wa = whatsappOf(v);
      var meta = [v.city, v.type].filter(Boolean).join(" · ");
      var html =
        '<div class="vendor-top"><span class="initials-tile" aria-hidden="true">' + esc(initials(v.name)) + "</span><div>" +
        "<h3>" + esc(v.name) + "</h3>" +
        (meta ? '<p class="vendor-meta">' + esc(meta) + "</p>" : "") +
        "</div></div>" +
        '<div class="tag-row">' + tags + "</div>" +
        (v.parts ? '<p class="vendor-parts">' + esc(v.parts) + "</p>" : "") +
        (v.address ? '<p class="vendor-address">' + esc(v.address) + "</p>" : "") +
        '<div class="vendor-actions">' +
        (phone ? '<a class="btn btn-ghost btn-small" href="tel:' + esc(phone.tel) + '">' + esc(phone.display) + "</a>" : "") +
        (wa ? '<a class="btn btn-whatsapp btn-small" href="' + esc(wa) + '" target="_blank" rel="noopener">WhatsApp</a>' : "") +
        '<button type="button" class="btn btn-primary btn-small" data-vendor-id="' + esc(v.id) + '">View Details</button>' +
        "</div>";
      card.innerHTML = html;
      grid.appendChild(card);
    });
    if (countEl) {
      countEl.innerHTML = total === 0
        ? "<strong>0</strong> vendors found"
        : "Showing <strong>" + (start + 1) + "–" + (start + pageItems.length) + "</strong> of <strong>" + total + "</strong> vendors";
    }
    if (emptyEl) emptyEl.style.display = total === 0 ? "block" : "none";
    if (paginationEl) {
      paginationEl.innerHTML = "";
      var prev = document.createElement("button");
      prev.type = "button"; prev.className = "btn btn-ghost btn-small"; prev.textContent = "← Previous";
      prev.disabled = state.page <= 1;
      prev.addEventListener("click", function () { if (state.page > 1) { state.page--; render(); scrollToVendors(false); } });
      var info = document.createElement("span");
      info.className = "page-info"; info.textContent = "Page " + state.page + " of " + pages;
      var next = document.createElement("button");
      next.type = "button"; next.className = "btn btn-ghost btn-small"; next.textContent = "Next →";
      next.disabled = state.page >= pages;
      next.addEventListener("click", function () { if (state.page < pages) { state.page++; render(); scrollToVendors(false); } });
      paginationEl.appendChild(prev); paginationEl.appendChild(info); paginationEl.appendChild(next);
    }
  }

  function scrollToVendors(smooth) {
    var el = document.getElementById("vendors");
    if (el) el.scrollIntoView({ behavior: smooth === false ? "auto" : "smooth" });
  }

  /* Modal */
  var overlay, modalBody, lastFocus;
  function openModal(id) {
    var item = null;
    enriched.forEach(function (it) { if (String(it.v.id) === String(id)) item = it; });
    if (!item || !overlay) return;
    var v = item.v;
    var phone = phoneOf(v);
    var wa = whatsappOf(v);
    var rows = "";
    function row(label, value) { if (value) rows += "<dt>" + label + "</dt><dd>" + value + "</dd>"; }
    row("Shop", esc(v.name));
    row("City", esc(v.city));
    row("Business type", esc(v.type));
    row("Area", esc(v.area));
    row("Address", esc(v.address));
    row("Main parts", esc(v.parts));
    row("Services", esc(v.services));
    if (v.email) rows += "<dt>Email</dt><dd><a href=\"mailto:" + esc(v.email) + "\">" + esc(v.email) + "</a></dd>";
    if (phone) rows += "<dt>Phone</dt><dd><a href=\"tel:" + esc(phone.tel) + "\">" + esc(phone.display) + "</a></dd>";
    var tags = item.categories.length
      ? item.categories.map(function (c) { return esc(window.NN_categoryLabel(c)); }).join(", ")
      : "General Spare Parts";
    rows += "<dt>Specializations</dt><dd>" + tags + "</dd>";
    modalBody.innerHTML =
      "<h2>" + esc(v.name) + "</h2>" +
      '<div class="tag-row">' + (item.categories.length
        ? item.categories.map(function (c) { return '<span class="tag">' + esc(window.NN_categoryLabel(c)) + "</span>"; }).join("")
        : '<span class="tag tag-general">General Spare Parts</span>') + "</div>" +
      "<dl>" + rows + "</dl>" +
      '<div class="modal-actions">' +
      (phone ? '<a class="btn btn-primary" href="tel:' + esc(phone.tel) + '">Call ' + esc(phone.display) + "</a>" : "") +
      (wa ? '<a class="btn btn-whatsapp" href="' + esc(wa) + '" target="_blank" rel="noopener">WhatsApp</a>' : "") +
      "</div>" +
      '<p class="catalog-note">Details shown are those supplied for this shop. Fields that were not supplied are not shown.</p>';
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    var closeBtn = overlay.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.NN_openVendorModal = openModal;
  window.NN_closeVendorModal = closeModal;

  /* Category filter from catalog "Explore Category" buttons. */
  window.NN_applyCategoryFilter = function (categoryId) {
    state.category = categoryId;
    state.specialization = "";
    state.page = 1;
    var catSel = document.getElementById("filter-category");
    var specSel = document.getElementById("filter-specialization");
    if (catSel) catSel.value = categoryId;
    if (specSel) specSel.value = "";
    render();
    scrollToVendors(true);
  };

  function fillSelect(sel, options, allLabel) {
    if (!sel) return;
    var current = sel.value;
    sel.innerHTML = "";
    var all = document.createElement("option");
    all.value = ""; all.textContent = allLabel;
    sel.appendChild(all);
    options.forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.value; opt.textContent = o.label;
      sel.appendChild(opt);
    });
    sel.value = current;
  }

  function init() {
    grid = document.getElementById("vendor-grid");
    if (!grid) return;
    countEl = document.getElementById("vendor-count");
    emptyEl = document.getElementById("vendor-empty");
    paginationEl = document.getElementById("vendor-pagination");
    overlay = document.getElementById("vendor-modal");
    modalBody = document.getElementById("vendor-modal-body");
    enrich();

    var catSel = document.getElementById("filter-category");
    var specSel = document.getElementById("filter-specialization");
    var citySel = document.getElementById("filter-city");
    var sortSel = document.getElementById("sort-vendors");
    var searchInput = document.getElementById("search-vendors");

    var catOptions = (window.NN_CATEGORIES || []).map(function (c) { return { value: c.id, label: c.label }; });
    catOptions.push({ value: "general-spare-parts", label: "General Spare Parts" });
    fillSelect(catSel, catOptions, "All categories");
    fillSelect(specSel, catOptions, "All specializations");
    var cities = [];
    enriched.forEach(function (it) { if (it.v.city && cities.indexOf(it.v.city) === -1) cities.push(it.v.city); });
    cities.sort();
    fillSelect(citySel, cities.map(function (c) { return { value: c, label: c }; }), "All cities");

    if (searchInput) searchInput.addEventListener("input", function () { state.q = searchInput.value.trim().toLowerCase(); state.page = 1; render(); });
    if (catSel) catSel.addEventListener("change", function () { state.category = catSel.value; state.page = 1; render(); });
    if (specSel) specSel.addEventListener("change", function () { state.specialization = specSel.value; state.page = 1; render(); });
    if (citySel) citySel.addEventListener("change", function () { state.city = citySel.value; state.page = 1; render(); });
    if (sortSel) sortSel.addEventListener("change", function () { state.sort = sortSel.value; state.page = 1; render(); });

    var clearBtn = document.getElementById("clear-filters");
    if (clearBtn) clearBtn.addEventListener("click", function () {
      state = { q: "", category: "", specialization: "", city: "", sort: "az", page: 1 };
      if (searchInput) searchInput.value = "";
      if (catSel) catSel.value = "";
      if (specSel) specSel.value = "";
      if (citySel) citySel.value = "";
      if (sortSel) sortSel.value = "az";
      render();
    });

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-vendor-id]");
      if (btn) openModal(btn.getAttribute("data-vendor-id"));
    });
    if (overlay) {
      overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
      var closeBtn = overlay.querySelector(".modal-close");
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
    }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* Header, navigation, FAQ — shared by all pages. */
(function () {
  function init() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.textContent = open ? "Close" : "Menu";
      });
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.textContent = "Menu"; }
      });
    }

    /* Active nav state for in-page sections (index.html only). */
    var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]'));
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id); });
        });
      }, { rootMargin: "-30% 0px -60% 0px" });
      sections.forEach(function (s) { observer.observe(s); });
    }

    /* FAQ accordion: click toggles, open question closes on second click. */
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      var answer = item.querySelector(".faq-answer");
      if (!btn || !answer) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".faq-answer").style.maxHeight = "0px";
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
