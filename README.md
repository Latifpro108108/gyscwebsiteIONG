# Global Youth Sustainability Council Website

Full-stack GYSC website with a public frontend and Node.js admin CMS.

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

Fill in your MongoDB URI, Cloudinary URL, JWT secret, and admin credentials in `.env`.

**Never commit `.env` to GitHub.**

2. Install dependencies:

```bash
npm install
```

3. Run frontend + backend together:

```bash
npm run dev
```

- Website: http://localhost:5173
- API: http://localhost:5000/api

## Admin CMS

- Login: http://localhost:5173/admin/login
- Default admin (from `.env`): `admin@gysc.com`

After login, admins can:

- Replace labeled site images (logo, hero background, about image)
- Edit all labeled text fields (layout stays fixed)
- Manage founders (photo, name, role, country, message)
- Create, edit, and delete newsletters (with Cloudinary cover + PDF)

Deleting images also removes them from Cloudinary.

## Member Registration

- Public registration: http://localhost:5173/register
- The public site remains fully viewable without logging in

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/founders` | Founders page |
| `/register` | Member registration |
| `/join` | Join info |
| `/partner` | Partner inquiry |
| `/admin/login` | Admin login |
| `/admin` | Admin CMS (admin only) |

## Production

```bash
npm run build
npm start
```

## Tech Stack

- React 18 + Vite + TypeScript
- Express + MongoDB + Cloudinary
- JWT authentication
