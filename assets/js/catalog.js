/* N&N International @ ASH Spare Parts — spare-parts catalog
   The 10 categories below are the only catalog categories. Each category
   carries the keywords used to derive a vendor's category / specializations
   from that vendor's free-text `parts` field (see main.js). The mapping is
   keyword-derived, NOT a classification supplied with the vendor data —
   see README.md "Honest limitations".
   Image rule: a category uses a real photograph of that component where
   one exists in assets/images/categories/. Where no specific photograph
   exists (Suspension Parts, Steering Components, Automotive Accessories),
   the card uses a real photograph of a spare-parts shop interior / shelves
   of boxed parts, and the alt text says exactly what the photograph shows
   — it never claims the photograph shows that component. */
(function () {
  var CATEGORIES = [
    {
      id: "engine-parts",
      label: "Engine Parts",
      description: "Engine components and related parts, including pistons, gaskets, belts and timing components.",
      image: "assets/images/categories/engine-oil-filter.jpg",
      alt: "An automotive engine oil filter, spin-on canister type",
      keywords: ["engine", "piston", "gasket", "timing", "crank", "camshaft", "cylinder", "turbo", "valve"]
    },
    {
      id: "suspension-parts",
      label: "Suspension Parts",
      description: "Suspension components such as shock absorbers, springs, bushes and ball joints.",
      image: "assets/images/branding/shop-shelves.jpg",
      alt: "Shelves of boxed spare parts in a spare-parts shop",
      photoNote: "Photograph shows shelves of boxed spare parts, not a suspension component.",
      keywords: ["suspension", "shock absorber", "shock", "spring", "bush", "ball joint", "strut"]
    },
    {
      id: "brake-components",
      label: "Brake Components",
      description: "Braking parts including brake pads, discs, shoes and related components.",
      image: "assets/images/categories/front-disc-brake-pads.jpg",
      alt: "An automotive front disc brake pad held against a brake rotor",
      keywords: ["brake"]
    },
    {
      id: "electrical-components",
      label: "Electrical Components",
      description: "Electrical parts such as alternators, starter motors, batteries, spark plugs, bulbs and wiring.",
      image: "assets/images/categories/alternator.jpg",
      alt: "A car alternator on a workbench in a garage",
      keywords: ["electrical", "alternator", "starter", "battery", "batteries", "spark plug", "bulb", "led", "halogen", "hid", "wiring", "ignition", "fuse"]
    },
    {
      id: "filters",
      label: "Filters",
      description: "Engine air filters, oil filters and cabin filters — the most frequently replaced consumables.",
      image: "assets/images/categories/engine-air-filter.jpg",
      alt: "Rows of automotive engine air filters on display",
      keywords: ["filter"]
    },
    {
      id: "clutch-transmission",
      label: "Clutch & Transmission",
      description: "Clutch plates and cables, gearboxes, gear parts and drivetrain components.",
      image: "assets/images/categories/manual-transmission-gearbox.jpg",
      alt: "A manual transmission gearbox",
      keywords: ["clutch", "transmission", "gearbox", "gear", "drivetrain", "axle", "differential"]
    },
    {
      id: "body-parts",
      label: "Body Parts",
      description: "Body panels, bumpers, fenders, doors, mirrors and lighting assemblies.",
      image: "assets/images/categories/headlight-assembly.jpg",
      alt: "Close-up of a modern car headlight assembly",
      keywords: ["body", "bumper", "fender", "headlight", "tail light", "mirror", "exterior", "door", "panel"]
    },
    {
      id: "cooling-system",
      label: "Cooling System",
      description: "Radiators and cooling components that keep an engine at its working temperature.",
      image: "assets/images/categories/radiator.jpg",
      alt: "An automotive radiator",
      keywords: ["cooling", "radiator", "thermostat", "water pump", "coolant", "antifreeze"]
    },
    {
      id: "steering-components",
      label: "Steering Components",
      description: "Steering parts that connect the steering wheel to the wheels of the vehicle.",
      image: "assets/images/branding/shop-shelves.jpg",
      alt: "Shelves of boxed spare parts in a spare-parts shop",
      photoNote: "Photograph shows shelves of boxed spare parts, not a steering component.",
      keywords: ["steering"]
    },
    {
      id: "automotive-accessories",
      label: "Automotive Accessories",
      description: "Accessories and add-on items for cars and other vehicles.",
      image: "assets/images/hero/hero-spare-parts-shop.jpg",
      alt: "Interior of a spare-parts shop with shelves stocked with oil, filters and boxed parts",
      photoNote: "Photograph shows a spare-parts shop interior, not a specific accessory.",
      keywords: ["accessories", "accessory", "seat cover", "floor mat", "car care", "decoration"]
    }
  ];

  window.NN_CATEGORIES = CATEGORIES;
  window.NN_GENERAL_CATEGORY = { id: "general-spare-parts", label: "General Spare Parts" };

  /* Derive the categories a vendor's `parts` text matches.
     Returns an array of category ids in catalog order. */
  function deriveCategories(partsText) {
    var text = (partsText || "").toLowerCase();
    var matched = [];
    CATEGORIES.forEach(function (cat) {
      for (var i = 0; i < cat.keywords.length; i++) {
        if (text.indexOf(cat.keywords[i]) !== -1) { matched.push(cat.id); break; }
      }
    });
    return matched;
  }
  window.NN_deriveCategories = deriveCategories;

  function categoryLabel(id) {
    if (id === "general-spare-parts") return "General Spare Parts";
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i].label;
    }
    return id;
  }
  window.NN_categoryLabel = categoryLabel;

  /* Render the catalog grid on pages that have #catalog-grid. */
  function renderCatalog() {
    var grid = document.getElementById("catalog-grid");
    if (!grid) return;
    grid.innerHTML = "";
    CATEGORIES.forEach(function (cat) {
      var card = document.createElement("article");
      card.className = "catalog-card";
      var note = cat.photoNote ? '<p class="catalog-note" style="margin-top:0">' + cat.photoNote + "</p>" : "";
      card.innerHTML =
        '<img src="' + cat.image + '" alt="' + cat.alt + '" loading="lazy">' +
        '<div class="catalog-body"><h3>' + cat.label + "</h3><p>" + cat.description + "</p>" + note +
        '<button type="button" class="btn btn-secondary btn-small" data-category="' + cat.id + '">Explore Category</button></div>';
      grid.appendChild(card);
    });
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-category]");
      if (!btn) return;
      if (typeof window.NN_applyCategoryFilter === "function") {
        window.NN_applyCategoryFilter(btn.getAttribute("data-category"));
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCatalog);
  } else {
    renderCatalog();
  }
})();
