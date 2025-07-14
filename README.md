# Custom Onboarding Flow

A full-stack onboarding app with a dynamic, admin-configurable multi-step user onboarding flow.  
Built with Next.js, React, Drizzle ORM, NextAuth.js, and PostgreSQL.

---

## Features

- **User Onboarding Wizard**
  - Three-step onboarding with a progress bar.
  - Collects email, password, and customizable onboarding fields (About Me, Address, Birthdate, etc.).
  - User data is saved to a PostgreSQL database.

- **Admin Section (`/admin`)**
  - Admins can assign which onboarding fields appear on each step (2nd and 3rd pages).
  - At least one field per page is enforced.
  - No authentication required for demo.

- **Data Table (`/data`)**
  - View all user data in a simple HTML table.
  - No authentication required.

- **Session Management**
  - After onboarding, the user is logged out so new users can onboard in the same browser.

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, shadcn/ui, react-hook-form, Zod
- **Backend:** Next.js API routes, Drizzle ORM, PostgreSQL
- **Auth:** NextAuth.js (credentials provider)
- **Deployment:** Vercel

---

## Getting Started

### 1. Clone the repo

```sh
git clone <your-repo-url>
cd <your-repo>
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

- Copy `.env.example` to `.env.local` and fill in your database and auth secrets.

### 4. Run migrations

```sh
npm run migrate
```

### 5. Start the dev server

```sh
npm run dev
```

### 6. Access the app

- User onboarding: `/register`
- Admin UI: `/admin`
- Data table: `/data`

---

## Deployment

- Deploy to [Vercel](https://vercel.com/) and set your environment variables in the dashboard.

---

## Folder Structure

```
components/
  auth/
    multi-step-form/
      multi-step-form.tsx
    register-form.tsx
    login-form.tsx
    logout-form.tsx
  ui/
server/
  actions/
    onboarding.ts
    register.ts
    login.ts
  schema.ts
  db.ts
  auth.ts
app/
  (auth)/
    admin/
    data/
    onboarding/
    register/
    login/
    api/
  layout.tsx
  page.tsx
```

---

## Notes

- The admin and data table sections are intentionally left unauthenticated for demo/testing purposes.
- After onboarding, the user is logged out so a new user can register and onboard in the same browser session.
- The onboarding flow and admin UI are fully dynamic and driven by the database configuration.

---
