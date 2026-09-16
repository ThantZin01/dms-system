# Dormitory Management System (DMS)

A comprehensive, modern web application for managing dormitories, built with Next.js and a robust modern tech stack.

## 🚀 Tech Stack

### Framework & Core
- **[Next.js 15+](https://nextjs.org/)** (App Router)
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**

### Backend & Database
- **[Prisma](https://www.prisma.io/)** - Next-generation Node.js and TypeScript ORM
- **[Neon Database](https://neon.tech/)** - Serverless Postgres
- **[Better Auth](https://github.com/better-auth/better-auth)** - Authentication

### Styling & UI Components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful and consistent icons
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Perfect dark mode

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant, flexible and extensible forms
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation with static type inference

### Additional Features
- **[Next Intl](https://next-intl-docs.vercel.app/)** - Internationalization (i18n)
- **[Recharts](https://recharts.org/)** - Composable charting library
- **[Serwist](https://serwist.build/)** - PWA and offline support
- **[React Hot Toast](https://react-hot-toast.com/)** - Notifications

## 📦 Getting Started

### Prerequisites

- Node.js (v18.17 or newer)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ThantZin01/dms-system.git
   cd dms-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` or `.env.local` file in the root directory and add your configuration details. (e.g., Database URL, Auth secrets)
   ```env
   DATABASE_URL="your-neon-postgres-url"
   # Add other required environment variables
   ```

4. **Run database migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
dms-system/
├── prisma/             # Database schema and migrations
├── src/
│   ├── actions/        # Server actions
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable UI components
│   ├── i18n/           # Internationalization configurations
│   ├── lib/            # Utility functions and configurations
│   └── proxy.ts        # Proxy configurations
├── public/             # Static assets
└── package.json        # Project dependencies and scripts
```

## 🛠️ Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to catch issues.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ThantZin01/dms-system/issues).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
