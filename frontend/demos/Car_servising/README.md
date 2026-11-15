# Global Digital Agency — Car Detailing Demo
Responsive fictional car-detailing showcase: animated hero, services, portfolio, pricing, process, testimonial placeholders, FAQ, contact form, and optional Express/SQLite admin.

## Frontend-only (safe showcase)
Open `frontend/index.html` in VS Code with Live Server. Form validates and displays a demo message; **no data is sent or saved**.

## Backend (optional local enquiry storage)
Node.js 20+:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with a long SESSION_SECRET and strong ADMIN_PASSWORD (14+ chars)
npm run seed-admin
npm start
```
Visit `http://localhost:5000` and `/admin/login`. Server serves frontend + API from same origin.
Admin login is private. Don't share admin route/credentials with prospects.

## Important before production
- Fictional brand, contact details, AUD prices and testimonial are placeholders.
- Replace with approved content and genuine reviews. Add privacy/terms/cancellation/payment/delivery scope.
- Starter backend stores enquiries but **does not send email notifications**.
- SQLite needs persistent disk; this Express app is not directly deployable on Cloudflare Workers/Pages. Use a Worker + D1 compatible rebuild or separate Node host.
- Add HTTPS, production session store, backups, monitoring, CSRF strategy, email provider and data-retention policy.
See `docs/INTEGRATION.md`.
