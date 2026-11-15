# Add this demo to Global Digital Agency

## Recommended: isolated demo URL
1. Unzip this package.
2. Copy `frontend/` into your agency repository as `frontend/demo/car-detailing/` (or equivalent).
3. Preserve `index.html`, `css/`, `js/`, and `admin/` folder paths.
4. Add a portfolio card/link: `<a href="/demo/car-detailing/">View Car Detailing Demo ↗</a>`.
5. Test `/demo/car-detailing/index.html` and `/demo/car-detailing/` on desktop/tablet/mobile.

## Frontend-only behavior
Static demo form validates and shows a safe confirmation. It sends/stores no data. Keep `backendEnabled:false`.

## Backend option
Run Express backend on a Node host with persistent storage, configure `.env`, create admin (`npm run seed-admin`) and enable `backendEnabled:true` only when frontend/API share the same origin. This backend stores enquiries but **does not send email notifications**. Add a transactional mail provider separately.

**Cloudflare Workers/Pages:** this Express + SQLite app cannot run directly there. Use Worker-compatible backend (e.g. Workers + D1 + compatible session/auth implementation) or host the Node backend separately. SQLite file/session storage requires persistent disk.

## Replace before client presentation
- Fictional Apex Auto Detail identity and demo phone/email
- Illustrative AUD starting prices
- Unsourced testimonial placeholder (replace with real permissioned review or remove)
- Unsplash remote images (replace with licensed/approved assets)
- Add business identity, privacy policy, terms, cancellations/refunds, scope and delivery conditions
- Do not promise guaranteed leads, sales or SEO rankings; never call fictional content a real client project.
