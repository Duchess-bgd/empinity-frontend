# impinity-frontend

A Vue 3 + Vite frontend application for product management. This repo is the frontend only and expects a separate backend API to be available.

## Prerequisites

- Node.js 20.x or newer
- npm (bundled with Node.js)
- Backend API service available and running

## Local setup

1. Clone the repo:

```sh
git clone <repository-url>
cd impinity-frontend
```

2. Install dependencies:

```sh
npm install
```

3. Ensure the frontend environment file is present:

```sh
cp .env .env.local
```

The existing `.env` file already contains:

```env
VITE_API_BASE_URL=http://impinity.test/api
```

Update this value to match your backend API URL if needed.

## Frontend commands

- Start the development server:

```sh
npm run dev
```

- Build for production:

```sh
npm run build
```

- Preview the production build locally:

```sh
npm run preview
```

- Run type checking:

```sh
npm run type-check
```

## Backend setup (example)

This repository does not include the backend code. The backend must be started separately. Below is an example workflow for a Laravel backend. Adapt these commands to match your backend stack.

### Example Laravel backend commands

```sh
cd ../your-backend-repo
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Once the backend is running, make sure the frontend `VITE_API_BASE_URL` points to the backend API, for example:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Migrations and seed data

If your backend is Laravel, run:

```sh
php artisan migrate
php artisan db:seed
```

For other backend frameworks, use the appropriate commands for database setup and seed data according to your backend repository.

## Running frontend and backend together

1. Start the backend service first.
2. Confirm the backend API is reachable at the configured URL.
3. Start the frontend with:

```sh
npm run dev
```

4. Open the URL shown by Vite (typically `http://localhost:5173`).

## Notes

- `node_modules` is not included in the repo archive. Run `npm install` after extraction.
- If you do not yet have a backend, you can replace `VITE_API_BASE_URL` with a mock server or API stub.
- This repository is a frontend client designed to work with an existing API.
