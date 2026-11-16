/* N&N International @ ASH Spare Parts — blog system
   Built-in blogs are fixed content (assets: the two detail pages).
   Locally created blogs are stored ONLY in this browser/device in
   localStorage under key "nn_ash_blogs_local". They are NOT published to
   other visitors and are NOT a shared database — the page says so
   wherever the manager appears. Built-in blogs cannot be edited or
   deleted. A future backend/CMS can replace the localStorage functions
   (loadLocalBlogs / saveLocalBlogs) without changing the listing code. */
(function () {
  var STORAGE_KEY = "nn_ash_blogs_local";
  var BUILTIN = [
    {
      id: "understanding-automotive-spare-parts-market",
      slug: "blog-understanding-automotive-spare-parts-market.html",
      title: "Understanding the Automotive Spare Parts Market",
      excerpt: "Genuine and compatible parts, the main spare-parts categories, and how an organised vendor directory helps buyers and businesses find the right shop in a busy market.",
      date: "16 November 2026",
      dateISO: "2026-11-16",
      category: "Market Guide",
      image: "assets/images/blogs/blog-understanding-market.jpg",
      imageAlt: "Rows of automotive engine air filters on display",
      local: false
    },
    {
      id: "complete-guide-exploring-spare-parts-vendors",
      slug: "blog-complete-guide-exploring-spare-parts-vendors.html",
      title: "A Complete Guide to Exploring Spare Parts Vendors",
      excerpt: "How to explore spare-parts shops, understand vendor specializations, use a vendor directory, and check the right information before contacting a shop.",
      date: "16 November 2026",
      dateISO: "2026-11-16",
      category: "Vendor Guide",
      image: "assets/images/blogs/blog-exploring-vendors.jpg",
      imageAlt: "An automotive front disc brake pad held against a brake rotor",
      local: false
    }
  ];
  window.NN_BUILTIN_BLOGS = BUILTIN;

  var COVER_CHOICES = [
    { value: "assets/images/blogs/blog-understanding-market.jpg", label: "Engine air filters (blog cover 1)" },
    { value: "assets/images/blogs/blog-exploring-vendors.jpg", label: "Front disc brake pads (blog cover 2)" },
    { value: "assets/images/categories/engine-oil-filter.jpg", label: "Engine oil filter" },
    { value: "assets/images/categories/alternator.jpg", label: "Alternator" },
    { value: "assets/images/categories/radiator.jpg", label: "Radiator" },
    { value: "assets/images/categories/headlight-assembly.jpg", label: "Headlight assembly" },
    { value: "assets/images/categories/manual-transmission-gearbox.jpg", label: "Manual transmission gearbox" },
    { value: "assets/images/hero/hero-spare-parts-shop.jpg", label: "Spare-parts shop interior" }
  ];
  window.NN_BLOG_COVER_CHOICES = COVER_CHOICES;

  function loadLocalBlogs() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveLocalBlogs(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }
  window.NN_loadLocalBlogs = loadLocalBlogs;
  window.NN_saveLocalBlogs = saveLocalBlogs;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
  }

  function blogCard(blog) {
    var card = document.createElement("article");
    card.className = "blog-card";
    var actions;
    if (blog.local) {
      actions =
        '<button type="button" class="btn btn-ghost btn-small" data-read-local="' + esc(blog.id) + '">Read</button>' +
        '<button type="button" class="btn btn-ghost btn-small" data-edit-local="' + esc(blog.id) + '">Edit</button>' +
        '<button type="button" class="btn btn-ghost btn-small" data-delete-local="' + esc(blog.id) + '">Delete</button>';
    } else {
      actions = '<a class="btn btn-primary btn-small" href="' + esc(blog.slug) + '">Read Article</a>';
    }
    card.innerHTML =
      '<img src="' + esc(blog.image) + '" alt="' + esc(blog.imageAlt || blog.title) + '" loading="lazy">' +
      '<div class="blog-body"><p class="blog-meta">' + esc(blog.category) + " · " + '<time datetime="' + esc(blog.dateISO) + '">' + esc(blog.date) + "</time>" +
      (blog.local ? " · Saved in this browser only" : "") + "</p>" +
      "<h3>" + (blog.local ? esc(blog.title) : '<a href="' + esc(blog.slug) + '">' + esc(blog.title) + "</a>") + "</h3>" +
      "<p>" + esc(blog.excerpt) + '</p><div class="blog-actions">' + actions + "</div></div>";
    return card;
  }

  function renderListing(containerId, includeLocal) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    BUILTIN.forEach(function (b) { container.appendChild(blogCard(b)); });
    if (includeLocal !== false) loadLocalBlogs().forEach(function (b) { container.appendChild(blogCard(b)); });
  }

  /* Local blog detail reader (blog.html only): renders the full article
     of a locally created blog in place, with a Back to Blogs link. */
  function showLocalArticle(id) {
    var blog = null;
    loadLocalBlogs().forEach(function (b) { if (b.id === id) blog = b; });
    var reader = document.getElementById("local-blog-reader");
    var listing = document.getElementById("blog-listing");
    if (!blog || !reader) return;
    reader.style.display = "block";
    if (listing) listing.style.display = "none";
    var formWrap = document.getElementById("blog-manager");
    if (formWrap) formWrap.style.display = "none";
    reader.innerHTML =
      '<p><a href="blog.html">&larr; Back to Blogs</a></p>' +
      '<span class="eyebrow">' + esc(blog.category) + "</span>" +
      "<h2>" + esc(blog.title) + "</h2>" +
      '<p class="byline"><time datetime="' + esc(blog.dateISO) + '">' + esc(blog.date) + "</time> · Saved in this browser only</p>" +
      '<figure><img src="' + esc(blog.image) + '" alt="' + esc(blog.imageAlt || blog.title) + '"></figure>' +
      paragraphs(blog.content).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    reader.scrollIntoView({ behavior: "smooth" });
  }

  function init() {
    renderListing("blog-grid-index", false);
    renderListing("blog-grid");
    var grid = document.getElementById("blog-grid");
    if (grid) {
      grid.addEventListener("click", function (e) {
        var readBtn = e.target.closest("[data-read-local]");
        if (readBtn) { showLocalArticle(readBtn.getAttribute("data-read-local")); return; }
        var editBtn = e.target.closest("[data-edit-local]");
        if (editBtn) { startEdit(editBtn.getAttribute("data-edit-local")); return; }
        var delBtn = e.target.closest("[data-delete-local]");
        if (delBtn) {
          var list = loadLocalBlogs().filter(function (b) { return b.id !== delBtn.getAttribute("data-delete-local"); });
          saveLocalBlogs(list);
          renderListing("blog-grid");
          setStatus("Blog deleted from this browser.", "success");
        }
      });
    }

    /* Manager form (blog.html only). */
    var form = document.getElementById("blog-form");
    if (!form) return;
    var coverSel = document.getElementById("blog-cover");
    if (coverSel) {
      COVER_CHOICES.forEach(function (c) {
        var opt = document.createElement("option");
        opt.value = c.value; opt.textContent = c.label;
        coverSel.appendChild(opt);
      });
    }
    var editingId = null;
    window.NN_startBlogEdit = startEdit;
    function startEdit(id) {
      var blog = null;
      loadLocalBlogs().forEach(function (b) { if (b.id === id) blog = b; });
      if (!blog) return;
      editingId = id;
      document.getElementById("blog-title").value = blog.title;
      document.getElementById("blog-category").value = blog.category;
      document.getElementById("blog-excerpt").value = blog.excerpt;
      document.getElementById("blog-cover").value = blog.image;
      document.getElementById("blog-content").value = blog.content;
      document.getElementById("blog-form-heading").textContent = "Edit Blog (saved in this browser only)";
      document.getElementById("blog-submit").textContent = "Save Changes";
      var mgr = document.getElementById("blog-manager");
      if (mgr) mgr.style.display = "block";
      form.scrollIntoView({ behavior: "smooth" });
    }
    var addBtn = document.getElementById("add-blog-btn");
    var mgrWrap = document.getElementById("blog-manager");
    if (addBtn && mgrWrap) {
      addBtn.addEventListener("click", function () {
        editingId = null;
        form.reset();
        document.getElementById("blog-form-heading").textContent = "Add New Blog (saved in this browser only)";
        document.getElementById("blog-submit").textContent = "Publish";
        mgrWrap.style.display = mgrWrap.style.display === "none" ? "block" : "none";
        if (mgrWrap.style.display === "block") mgrWrap.scrollIntoView({ behavior: "smooth" });
      });
    }
    var cancelBtn = document.getElementById("blog-cancel");
    if (cancelBtn) cancelBtn.addEventListener("click", function () {
      editingId = null; form.reset();
      if (mgrWrap) mgrWrap.style.display = "none";
      setStatus("", "");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var title = document.getElementById("blog-title").value.trim();
      var category = document.getElementById("blog-category").value.trim();
      var excerpt = document.getElementById("blog-excerpt").value.trim();
      var image = document.getElementById("blog-cover").value;
      var content = document.getElementById("blog-content").value.trim();
      if (!title || !category || !excerpt || !content) {
        setStatus("Please fill in the title, category, excerpt and article content.", "error");
        return;
      }
      if (excerpt.length > 300) { setStatus("Excerpt must be 300 characters or fewer.", "error"); return; }
      var list = loadLocalBlogs();
      var today = new Date();
      var dateStr = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      var dateISO = today.toISOString().slice(0, 10);
      if (editingId) {
        list.forEach(function (b) {
          if (b.id === editingId) {
            b.title = title; b.category = category; b.excerpt = excerpt;
            b.image = image; b.content = content;
          }
        });
        setStatus("Blog updated in this browser.", "success");
      } else {
        list.push({
          id: "local-" + Date.now(),
          title: title, category: category, excerpt: excerpt, image: image,
          imageAlt: title, content: content, date: dateStr, dateISO: dateISO, local: true
        });
        setStatus("Blog published in this browser only. It is not visible to other visitors.", "success");
      }
      if (!saveLocalBlogs(list)) { setStatus("Could not save — this browser's storage may be full or disabled.", "error"); return; }
      editingId = null;
      form.reset();
      if (mgrWrap) mgrWrap.style.display = "none";
      renderListing("blog-grid");
      var listing = document.getElementById("blog-listing");
      if (listing) listing.scrollIntoView({ behavior: "smooth" });
    });
  }

  function setStatus(msg, kind) {
    var el = document.getElementById("blog-form-status");
    if (!el) return;
    el.textContent = msg;
    el.className = "form-status" + (kind ? " " + kind : "");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
