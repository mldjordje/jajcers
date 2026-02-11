# Deploy plan: Vercel frontend + cPanel backend

## 1) GitHub repo

Push this `jajcers-next` project to:
`https://github.com/mldjordje/jajcers.git`

## 2) What goes to Vercel

Deploy only Next.js app (this repo):

- `app/`
- `components/`
- `lib/`
- `public/`
- `package.json`
- `next.config.ts`
- `tsconfig.json`

## 3) Environment variables on Vercel

Set these in Project Settings -> Environment Variables:

- `PHP_API_BASE` (example: `https://api.jajce.rs/api`)
- `NEXT_PUBLIC_PHP_API_BASE` (same value as above)
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_AUTH_TOKEN`

## 4) What stays on cPanel

If cPanel remains backend/API source, keep:

- PHP API endpoints you still use (typically inside old `/api` folder)
- DB + MySQL users
- Any upload/media folders used by PHP

You can remove old PHP page templates only after all routes are confirmed on Next.js:

- `index.php`, `shop.php`, `product.php`, `checkout.php`, etc.

## 5) DNS routing

Recommended:

- `www.jajce.rs` (or root) -> Vercel
- `api.jajce.rs` -> cPanel (PHP backend)

Then Next.js should call `https://api.jajce.rs/...` for backend APIs.

## 7) cPanel cron for order retention

Add one daily cron on cPanel:

`/usr/local/bin/php /home/jajcers/public_html/api2/api/cron_cleanup_orders.php`

This removes only finished orders (`Gotova`) older than 14 days and keeps contact messages untouched.

## 6) Validation checklist

- Admin login works: `/admin/login`
- Public pages work on Vercel domain
- Checkout/API calls hit cPanel endpoints (`api.jajce.rs`)
- No mixed-content/http links
