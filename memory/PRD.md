# Sweet'O Clock — PRD

## Original Problem Statement
User provided a static HTML home page ("Sweet'O Clock" — handcrafted mithai e-commerce, pastel editorial vibe) and asked to:
1. Build a per-product detail page in the exact same vibe: 3–4 product images, add-to-cart, about section, quantity +/- selector, sliding comments (same as home), suggested products (home card style), same footer.
2. Add a multi-page checkout: cart → address page (first/last name, address, landmark, city, state dropdown of all Indian states, pincode) → Razorpay payment interface. Pincode should auto-fill city (and state). Razorpay is a placeholder interface (real key connected later).

## User Choices
- Product gallery: AI-generated matching extra angle/shots per sweet.
- Home product cards open the product page.
- Comments reused from home reviews.
- Front-end only (cart in localStorage, simulated checkout/payment).

## Architecture
- React (CRA + craco, `@/` alias) SPA, react-router. NO backend used — fully front-end.
- Global providers/components: `CartProvider` (localStorage cart + address + order state), `Nav`, `Footer`, `CartDrawer`, `Toast`.
- Styling: single `src/styles/sweet.css` replicating the original design tokens/fonts (Fraunces / Instrument Serif / Manrope, matcha–cream–butter palette).
- Data: `src/data/shop.js` (8 products with 4-image galleries, about, ingredients; testimonials, offers, chapters, marquee), `src/data/states.js`.
- Pincode auto-fill uses live India Post public API `api.postalpincode.in/pincode/<pin>`.

## Personas
- Gift buyers & sweet-lovers in India ordering fresh mithai for festivals/weddings.

## Implemented (2026-06)
- Converted static home page to React `Home` (hero + parallax, marquee, offers carousel, filterable product scroller, manifesto, reviews reel).
- `ProductDetail` (/product/:slug): 4-image gallery with thumbnails, breadcrumb, price/save badge, about + ingredient chips, qty +/- , add-to-cart & buy-now, assurances, sliding reviews reel, suggested-products scroller, shared footer.
- AI-generated product photography (4 shots/sweet); replaced dead Unsplash source images.
- Multi-page checkout: `CartDrawer` Checkout → `/checkout` (address form + state dropdown + pincode→city/state auto-fill + order summary + validation) → `/payment` (Razorpay-style MOCK interface: 5 methods, pay → processing → order-confirmed, clears cart). Route guards on both pages.
- Verified: iteration_1 (PDP) 100%, iteration_2 (checkout flow) 100%.

## MOCKED / Placeholders
- **Razorpay payment is a MOCK interface** — no real gateway; `placeOrder()` simulates success. Real Razorpay key to be wired into `Payment.jsx` `pay()` later.
- Checkout/orders are not persisted to any backend.

## Backlog / Next
- P1: Wire real Razorpay (Stripe/Razorpay integration + backend order persistence).
- P2: Persist address to localStorage; same-category suggestions; order history.
