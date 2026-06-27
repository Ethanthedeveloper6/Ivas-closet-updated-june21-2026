# IVAS Closet

Premium fashion e-commerce store — React (Vite) frontend, Express + SQLite backend.

## Stack

- **client/** — React 18 + React Router, built with Vite
- **server/** — Express 4 API with a SQLite database (better-sqlite3), JWT auth, image uploads

## Prerequisites

- Node.js 18+

## Setup

```bash
npm run install:all   # install server + client dependencies
npm run server:seed   # create the database and seed products + admin user
```

## Development

```bash
npm run dev           # backend on :5001, frontend dev server on :5173
```

The Vite dev server proxies `/api` and `/images` to the backend on port 5001.

## Production

```bash
npm run build         # build the React app into client/dist
npm start             # serve API + built frontend from http://localhost:5001
```

## Admin account

Created by the seed script:

- Email: `admin@ivascloset.com`
- Password: `admin123`

## API

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | authenticated |
| GET | `/api/products` | public |
| GET | `/api/products/:id` | public |
| POST | `/api/products` | admin |
| GET | `/api/orders` | authenticated (admin sees all) |
| POST | `/api/orders` | public |
| PUT | `/api/orders/:id/status` | admin |
| GET | `/api/stock` | public |
| PUT | `/api/stock/:productId` | admin |
| GET | `/api/users` | admin |
| POST | `/api/contact` | public |
| GET | `/api/health` | public |
