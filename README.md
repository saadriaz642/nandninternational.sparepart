# N&N International @ ASH Spare Parts

A premium, fully static vendor directory and market showcase for **ASH Spare Parts Market** — presented by **Dr. Nadeem Nazir & Associates**.

- Brand: **N&N international** — sub-brand **@ashspareparts** (typography only, no logo image)
- Purpose: help visitors discover spare-parts shops, explore spare-parts categories, and contact vendors. **This is a directory, not a shop.** No prices are shown anywhere, and there is no shopping cart.
- Stack: HTML5, CSS3, vanilla JavaScript. No build step, no framework, no backend. Classic scripts (no ES modules), so pages also open directly from `file://`.

## Pages

| Page | Contents |
|---|---|
| `index.html` | Hero, About, Vendor Directory (525 shops), Spare Parts Catalog (10 categories), Why Choose Us, FAQ accordion, Blog listing, Contact form |
| `blog.html` | Blog listing + Add New Blog manager (localStorage) |
| `blog-understanding-automotive-spare-parts-market.html` | Blog 01 (full article) |
| `blog-complete-guide-exploring-spare-parts-vendors.html` | Blog 02 (full article, written new for this site) |

## Project structure

```
nn-international-ash-spare-parts/
├── index.html
├── blog.html
├── blog-understanding-automotive-spare-parts-market.html
├── blog-complete-guide-exploring-spare-parts-vendors.html
├── README.md
├── IMAGE-CREDITS.md
└── assets/
    ├── css/
    │   ├── style.css
    │   └── responsive.css
    ├── js/
    │   ├── vendors.js        # vendor data — the 525 shops (window.NN_VENDORS)
    │   ├── catalog.js        # 10 catalog categories + keyword mapping + catalog rendering
    │   ├── blogs.js          # built-in blogs + local blog manager (localStorage)
    │   ├── main.js           # vendor directory logic, header/nav, FAQ accordion, modal
    │   └── contact.js        # contact form validation + mailto fallback
    └── images/
        ├── hero/             # hero photograph
        ├── branding/         # Dr Nadeem portrait + shop-shelves photograph
        ├── categories/       # 10 real product photographs
        ├── blogs/            # blog cover photographs
        └── vendors/          # empty — no vendor/shop photographs were supplied
```

## Setup & deploy

No installation is needed.

**Local preview:**

```bash
cd nn-international-ash-spare-parts
python3 -m http.server 8000
# open http://localhost:8000/
```

Pages also open by double-clicking `index.html` (file:// works — all scripts are classic scripts and all assets are relative).

**Deploy:** upload the whole folder to any static host (GitHub Pages, Netlify, Vercel, or any web server). There is nothing to build and no server-side code.

## Vendor directory — how it works

- Data lives in `assets/js/vendors.js` (`window.NN_VENDORS`, 525 shops). Fields appear **only** when the supplied value is real: `id, name, address, area, city, type, parts, phones/phone/phoneTel, whatsapp/whatsappLink, email, services`. Missing fields are omitted from cards and from the detail modal — never shown as "not available".
- **Search** matches shop name and main-parts text.
- **Category filter** uses a shop's *primary* category; **Specialization filter** matches *any* category a shop's parts match; **City filter** is an extra (Faisalabad / Lahore / Multan / Gujranwala). Sorting is A–Z / Z–A, pagination is 24 vendors per page, and the count reads from the actual loaded records ("Showing X–Y of 525 vendors").
- **View Details** opens a modal with the full supplied details, a `tel:` call link, and a WhatsApp (`wa.me`) button where a WhatsApp number was supplied.
- Vendor cards use a neutral initials tile. No stock photograph is ever presented as a shop's photograph.

### Category / specialization — keyword mapping (derived, not supplied)

No category or specialization classification was supplied with the vendor data. Both are derived from each vendor's free-text `parts` field by keyword matching, in `assets/js/catalog.js` (`window.NN_CATEGORIES`, each category's `keywords` array) and applied in `assets/js/main.js` (`NN_deriveCategories`). A vendor can match several specializations; its primary category is its first match in catalog order; vendors matching none are **General Spare Parts**.

| Category | Keywords matched against the `parts` text |
|---|---|
| Engine Parts | engine, piston, gasket, timing, crank, camshaft, cylinder, turbo, valve |
| Suspension Parts | suspension, shock absorber, shock, spring, bush, ball joint, strut |
| Brake Components | brake |
| Electrical Components | electrical, alternator, starter, battery, batteries, spark plug, bulb, led, halogen, hid, wiring, ignition, fuse |
| Filters | filter |
| Clutch & Transmission | clutch, transmission, gearbox, gear, drivetrain, axle, differential |
| Body Parts | body, bumper, fender, headlight, tail light, mirror, exterior, door, panel |
| Cooling System | cooling, radiator, thermostat, water pump, coolant, antifreeze |
| Steering Components | steering |
| Automotive Accessories | accessories, accessory, seat cover, floor mat, car care, decoration |

To change the mapping, edit the `keywords` arrays in `assets/js/catalog.js`. The mapping is documented here and in a code comment in that file.

## Adding a vendor

Edit `assets/js/vendors.js` and add an entry to the `window.NN_VENDORS` array, copying the shape of an existing entry:

```js
{
  "id": 526,
  "name": "Shop Name",
  "address": "Market address",
  "city": "Faisalabad",
  "type": "Retailer",
  "parts": "Engine parts, brake pads",
  "phone": "0300-0000000",
  "phoneTel": "+923000000000",
  "whatsapp": "0300-0000000",
  "whatsappLink": "https://wa.me/923000000000"
}
```

Rules: use a new unique `id`; include a field **only** if the value is real and supplied — omit it otherwise; never invent a phone number, address or specialization. If a real shop photograph is supplied later, add it to `assets/images/vendors/` and record its source in `IMAGE-CREDITS.md` (the card code will need a small update to use an `image` field — the initials tile is the current behaviour).

## Adding a blog

**Built-in blogs** (visible to everyone): add a full article page following the pattern of the two existing article pages, then add its entry to the `BUILTIN` array in `assets/js/blogs.js` (title, excerpt, date, category, image, slug).

**Local blogs** (this browser only): on `blog.html`, click **Add New Blog**, fill in title, category, excerpt, cover image (chosen from photographs already on the site) and article content, then **Publish**. The blog is saved in `localStorage` under key `nn_ash_blogs_local` and appears in the listing on `blog.html` only, in this browser on this device. It can be edited or deleted from there. Built-in blogs cannot be edited or deleted. The page states this plainly next to the manager. A future backend/CMS can replace `loadLocalBlogs` / `saveLocalBlogs` in `assets/js/blogs.js` without changing the listing code.

## Contact form

No directory contact email address was supplied and no email service is configured, so the static site cannot send a message to an inbox by itself. The form validates Name, Email, Phone (optional), Subject and Message; on a valid submit it builds a `mailto:` link with subject and message prefilled and a **blank recipient**, and shows an "Open in Email App" link plus a "Copy message" button. The visitor adds the directory's email address in their own mail app. The section states this plainly on the page. No submission is faked. A backend can replace the mailto step in `assets/js/contact.js` later.

## Images

All photographs are real photographs stored locally in `assets/images/` — no external image is hotlinked at runtime. Full source, author and licence for every image: see `IMAGE-CREDITS.md`.

- Hero: interior of an Advance Auto Parts store (Harrison Keely, CC BY 4.0).
- About: shelves of boxed auto parts (Visitor7, CC BY-SA 3.0).
- Dr Nadeem Nazir portrait: supplied by the project owner, used unaltered; no bio, qualifications or achievements are claimed for him anywhere on the site.
- Catalog: 10 verified Wikimedia Commons photographs of real components. Where no specific photograph existed for a category (Suspension Parts, Steering Components, Automotive Accessories), the card uses a real shop/shelves photograph and says so in the card and in its alt text — it never claims the photograph shows that component.

## Honest limitations

1. **No vendor/shop photographs were supplied.** Vendor cards use an initials tile; `assets/images/vendors/` is empty. No stock photo is presented as a shop photo.
2. **No directory contact email or phone was supplied.** Hence the contact form's mailto fallback with a blank recipient (see "Contact form" above), and the FAQ answer for new listings directs shops to the Contact section without inventing a process, fee or approval promise.
3. **Category and specialization are keyword-derived** from each vendor's `parts` text (mapping above), not classifications supplied with the data. A shop's listed parts wording decides its categories.
4. **No Dubai section in this build.** Dubai content belonged to the earlier grain-market build and no Dubai vendor data was supplied for ASH Spare Parts.
5. **No market history, establishment date, partnerships or achievements are stated**, because none were supplied. The site does not claim them.
6. **The Website column from the source data was omitted for all vendors**, as in the source build: its values are brand/manufacturer sites shared by many shops, not the shops' own websites.
7. **Locally added blogs are browser-only** (see "Adding a blog"). They are not published to other visitors.

## Testing

Tested 2026-11-16 (see TESTING section below for the method and counts). Summary: `node --check` clean on all 5 JS files; all 4 pages return HTTP 200, all 12 assets referenced in the HTML return HTTP 200, and all 15 image files on disk return HTTP 200; no external image URLs and no product prices, price amounts or discount percentages anywhere in the site; jsdom DOM smoke test 38/38 checks passed (vendor grid, search, both filters, sort, clear, pagination, modal, catalog explore, FAQ, blog manager round-trip, contact validation + mailto, hamburger, zero JS errors).

### TESTING (2026-11-16)

- `node --check` on `assets/js/vendors.js`, `catalog.js`, `blogs.js`, `main.js`, `contact.js` — **5/5 pass, no errors**.
- Served with `python3 -m http.server`; `curl` on all 4 pages — **4/4 HTTP 200**. `curl` on every asset referenced in the HTML (2 CSS, 5 JS, 5 images) — **12/12 HTTP 200**. `curl` on every image file on disk (10 category photos, hero, portrait, shelves, 2 blog covers) — **15/15 HTTP 200**. All 7 JS/CSS files — **7/7 HTTP 200**.
- Grep for external image sources (`<img` with `http` src, `url(http`) — **none**.
- Targeted grep for price amounts (`Rs`/`PKR`/`$` followed by digits, `% off`, `price: <number>`) in HTML/JS — **none**. The word "price" appears only in blog prose ("a fair price", "low price" as general advice, and "no prices are shown") — never as a product price. The word "Discounted" appears once, inside one vendor's supplied `parts` text in `vendors.js` ("Discounted motorcycle spare parts…"), i.e. the vendor's own wording as supplied, not a price or discount offer shown by the site.
- jsdom DOM smoke test (jsdom installed locally for the test in `/tmp`, not part of the site): **38/38 checks passed** — vendor grid renders 24 cards with "Showing 1–24 of 525 vendors"; search "muslim" → 2 vendors; empty search shows the empty state; category filter "Brake Components" narrows the list and all results have brake as primary; specialization filter "Filters" matches vendors whose parts include filters; city filter Lahore → 220 vendors; sort Z–A reverses the first card; clear filters restores 525; page 2 shows vendors 25–48; detail modal opens with the vendor name and closes; catalog "Explore Category" sets the category filter and the count changes; FAQ first question expands and collapses; hamburger toggles the nav open and closed; page 1 has `tel:` and `wa.me` links; blog listing shows the 2 built-in blogs with no edit/delete buttons; localStorage add → appears, Read → full article shown, edit → title changes, delete → removed, empty blog form rejected; contact form rejects a bad email, and a valid submit builds a `mailto:` link; footer DigiNixIT link and credits verified; zero JS errors on both pages tested.
- Manual checks: sticky header, smooth-scroll nav, active nav state, modal Escape/overlay close, responsive layouts at 1280 / 820 / 390 px widths with no horizontal scroll.
