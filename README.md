# Video Streaming Platform - Frontend

Industry-grade video streaming platform frontend built with Next.js 14, React, and TailwindCSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API URLs and configuration.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js 14 App Router
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── video/             # Video-specific components
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── api/               # API client
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand stores
│   └── utils/             # Utility functions
├── types/                 # TypeScript types
└── public/                # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion + Anime.js
- **Video Player**: HLS.js
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Design System

The project uses a CRED-inspired premium design system with:
- Dark theme with premium blacks
- Solid color palette (no gradients)
- Glassmorphism effects
- Smooth animations with Anime.js
- Typography scale
- Spacing system
- Component variants

See `DESIGN-IMPLEMENTATION.md` for detailed design specifications.

## 🔐 Authentication

The app uses JWT-based authentication. Tokens are stored in localStorage and automatically included in API requests.

## 📦 Features

- ✅ Video streaming with HLS
- ✅ User authentication
- ✅ Search functionality
- ✅ Responsive design
- ✅ Dark theme
- ✅ Component library
- 🚧 Video player (in progress)
- 🚧 User profiles (in progress)
- 🚧 Creator dashboard (in progress)

## 📄 License

MIT

